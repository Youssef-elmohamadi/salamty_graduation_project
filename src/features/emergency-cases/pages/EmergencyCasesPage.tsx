import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { UrgentCase } from "../types/urgent-case.types";
import { urgentCasesService } from "../services/urgentCasesService";
import EmergencyCaseRowSkeleton from "../components/EmergencyCaseRowSkeleton";
import EmergencyCaseDetailsModal from "../components/EmergencyCaseDetailsModal";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";
import { ArrowUpIcon } from "../../../icons";

export default function EmergencyCasesPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  // State Management
  const [cases, setCases] = useState<UrgentCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Operations and Modal telemetry
  const [selectedCase, setSelectedCase] = useState<UrgentCase | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search & Filter state parameters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Initial Fetch telemetry
  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await urgentCasesService.getCases();
      setCases(data);
    } catch (err: any) {
      console.error("Emergency cases fetch telemetry drop:", err);
      setError(err?.message || "Failed to sync emergency cases logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Delete Urgent Case Handler
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("emergency_cases.messages.confirm_delete", "Are you sure you want to purge this emergency case log?"))) return;
    setDeletingId(id);
    try {
      const success = await urgentCasesService.deleteCase(id);
      if (success) {
        setCases((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(t("emergency_cases.messages.delete_failed", "Failed to purge case telemetry record."));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Copy ID Clipboard Helper
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert(t("emergency_cases.messages.copied", "Copied Case ID to clipboard."));
  };

  // Export Single Case Helper
  const handleExportSingleCase = (item: UrgentCase) => {
    const headers = ["ID", "User ID", "Severity Level", "Summary (Arabic)", "Created At"];
    const row = [
      item.id,
      item.user_id || "N/A",
      item.severity_level,
      `"${item.summary_ar.replace(/"/g, '""')}"`,
      item.created_at
    ];

    const csvContent = "data:text/csv;charset=utf-8,\ufeff" 
      + [headers.join(","), row.join(",")].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salamati_emergency_case_${item.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-Side CSV Exporter
  const handleExportCSV = () => {
    if (filteredCases.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["ID", "User ID", "Severity Level", "Summary (Arabic)", "Created At"];
    const rows = filteredCases.map((c) => [
      c.id,
      c.user_id || "N/A",
      c.severity_level,
      `"${c.summary_ar.replace(/"/g, '""')}"`,
      c.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\ufeff" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salamati_emergency_cases_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Combined Search and Filters mapping
  const filteredCases = useMemo(() => {
    let result = [...cases];

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.summary_ar.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query) ||
          (c.user_id && c.user_id.toLowerCase().includes(query))
      );
    }

    // Severity Level Filter match
    if (severityFilter) {
      result = result.filter((c) => c.severity_level === severityFilter);
    }

    // Date Filter match
    if (dateFilter) {
      const now = new Date();
      result = result.filter((c) => {
        const caseDate = new Date(c.created_at);
        const diffTime = Math.abs(now.getTime() - caseDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === "today") {
          return caseDate.toDateString() === now.toDateString();
        } else if (dateFilter === "last_7") {
          return diffDays <= 7;
        } else if (dateFilter === "last_30") {
          return diffDays <= 30;
        }
        return true;
      });
    }

    // Sorting columns logic
    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof UrgentCase] ?? "";
      let valB: any = b[sortBy as keyof UrgentCase] ?? "";

      if (sortBy === "created_at") {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [cases, searchQuery, severityFilter, dateFilter, sortBy, sortOrder]);

  // Pagination parameters
  const paginatedCases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCases.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCases, currentPage]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  // Dynamic counts for KPI cards
  const totalCount = cases.length;
  const criticalCount = cases.filter(c => c.severity_level === "Critical").length;
  const urgentCount = cases.filter(c => c.severity_level === "Urgent").length;
  
  // Find latest case created date
  const latestCaseDateString = useMemo(() => {
    if (cases.length === 0) return "N/A";
    const timestamps = cases.map((c) => new Date(c.created_at).getTime());
    const maxVal = Math.max(...timestamps);
    return new Date(maxVal).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, [cases, i18n.language]);

  const getSeverityBadgeColor = (level: string): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (level) {
      case "Critical":
        return "error";
      case "Urgent":
        return "warning";
      case "Medium":
        return "info";
      default:
        return "success";
    }
  };

  const getSeverityLabel = (level: string) => {
    switch (level) {
      case "Critical":
        return t("emergency_cases.filters.critical", "Critical");
      case "Urgent":
        return t("emergency_cases.filters.urgent", "Urgent");
      case "Medium":
        return t("emergency_cases.filters.medium", "Medium");
      default:
        return t("emergency_cases.filters.low", "Low");
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getVisiblePageNumbers = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <PageMeta
        title={t("emergency_cases.meta.title", "Emergency Cases Console | Salamati Admin")}
        description="Premium medical emergency cases table manager."
      />
      <div className="space-y-6 text-gray-800 dark:text-gray-100 font-outfit">
        
        {/* Futuristic Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-start">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              {t("emergency_cases.title", "حالات الطوارئ الطبية")}
            </h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("emergency_cases.subtitle", "مراقبة وإدارة البلاغات والحالات الطارئة التي تم تحليلها بواسطة النظام.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all flex items-center gap-2 cursor-pointer shadow-theme-xs"
            >
              <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9l-4-4z" />
              </svg>
              {t("emergency_cases.export", "Export CSV")}
            </button>
            <button
              onClick={fetchCases}
              className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer shadow-theme-xs"
              title="Sync Telemetry"
            >
              <svg className={`w-4.5 h-4.5 text-red-500 dark:text-red-450 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Telemetry Counter Cards (Top summary) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {/* Total Cases */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-brand-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/15 text-brand-500 dark:text-brand-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("emergency_cases.summary.total", "Total Cases")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading ? (
                    <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-850 rounded animate-pulse" />
                  ) : (
                    totalCount
                  )}
                </h4>
              </div>
              <Badge color="primary">
                <ArrowUpIcon className="w-3 h-3" />
                Active
              </Badge>
            </div>
          </div>

          {/* Critical Cases */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-error-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-error-50 rounded-xl dark:bg-error-500/15 text-error-500 dark:text-error-450 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("emergency_cases.summary.critical", "Critical Cases")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading ? (
                    <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-850 rounded animate-pulse" />
                  ) : (
                    criticalCount
                  )}
                </h4>
              </div>
              <Badge color="error">
                Critical
              </Badge>
            </div>
          </div>

          {/* Urgent Cases */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-warning-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-xl dark:bg-warning-500/15 text-warning-500 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("emergency_cases.summary.urgent", "Urgent Cases")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading ? (
                    <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-850 rounded animate-pulse" />
                  ) : (
                    urgentCount
                  )}
                </h4>
              </div>
              <Badge color="warning">
                Urgent
              </Badge>
            </div>
          </div>

          {/* Latest Case */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-info-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-info-50 rounded-xl dark:bg-blue-light-500/15 text-blue-light-500 dark:text-blue-light-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("emergency_cases.summary.latest", "Latest Case")}
                </span>
                <h4 className="mt-2.5 font-bold text-gray-800 text-xs dark:text-white/90">
                  {loading ? (
                    <span className="inline-block w-20 h-5 bg-gray-200 dark:bg-gray-850 rounded animate-pulse" />
                  ) : (
                    latestCaseDateString
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Console Search & Filter Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Search Input bar */}
            <div className="relative flex items-center">
              <svg className="w-4.5 h-4.5 text-gray-400 absolute start-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={t("emergency_cases.search_placeholder", "البحث بالملخص العربي، معرف المستخدم، أو معرف الحالة...")}
                className="h-11 w-full pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-white/30 dark:focus:border-brand-800"
              />
            </div>

            {/* Filter by Severity level */}
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full px-3.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800"
            >
              <option value="" className="dark:bg-gray-900">{t("emergency_cases.filters.all_severities", "All Severity Levels")}</option>
              <option value="Critical" className="dark:bg-gray-900">{t("emergency_cases.filters.critical", "Critical")}</option>
              <option value="Urgent" className="dark:bg-gray-900">{t("emergency_cases.filters.urgent", "Urgent")}</option>
              <option value="Medium" className="dark:bg-gray-900">{t("emergency_cases.filters.medium", "Medium")}</option>
              <option value="Low" className="dark:bg-gray-900">{t("emergency_cases.filters.low", "Low")}</option>
            </select>

            {/* Filter by Date */}
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full px-3.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800"
            >
              <option value="" className="dark:bg-gray-900">{t("emergency_cases.filters.all_dates", "All Dates")}</option>
              <option value="today" className="dark:bg-gray-900">{t("emergency_cases.filters.today", "Today")}</option>
              <option value="last_7" className="dark:bg-gray-900">{t("emergency_cases.filters.last_7_days", "Last 7 Days")}</option>
              <option value="last_30" className="dark:bg-gray-900">{t("emergency_cases.filters.last_30_days", "Last 30 Days")}</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs relative z-10">
          <div className="overflow-x-auto max-w-full custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
                <tr className="text-start">
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("id")}>
                    {t("emergency_cases.columns.id", "ID")} {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("user_id")}>
                    {t("emergency_cases.columns.user_id", "User ID")} {sortBy === "user_id" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("severity_level")}>
                    {t("emergency_cases.columns.severity", "Severity Level")} {sortBy === "severity_level" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold">{t("emergency_cases.columns.summary", "Case Summary")}</th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("created_at")}>
                    {t("emergency_cases.columns.date", "Created At")} {sortBy === "created_at" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-center font-bold">{t("emergency_cases.columns.actions", "Actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                {loading ? (
                  <EmergencyCaseRowSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-12 h-12 rounded-full bg-error-50 dark:bg-error-500/15 flex items-center justify-center mx-auto text-error-500 dark:text-error-400">
                          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h4 className="text-base font-semibold text-gray-800 dark:text-white">{t("emergency_cases.telemetry_offline", "Telemetry Offline")}</h4>
                        <p className="text-xs text-gray-400 font-mono leading-relaxed">{error}</p>
                        <button
                          onClick={fetchCases}
                          className="px-4 py-2 rounded-lg border border-error-500/30 hover:border-error-500 bg-error-50 dark:bg-error-500/15 text-error-600 dark:text-error-400 text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                          </svg>
                          {t("emergency_cases.retry", "Retry Link")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                      <div className="max-w-sm mx-auto space-y-2.5">
                        <svg className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs">{t("emergency_cases.no_data", "No emergency cases found")}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map((item) => (
                    <motion.tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors text-start"
                    >
                      {/* ID */}
                      <td className="px-5 py-4 font-mono text-xs text-gray-400 truncate max-w-[120px]" title={item.id}>
                        {item.id}
                      </td>

                      {/* User ID */}
                      <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]" title={item.user_id || "N/A"}>
                        {item.user_id || "N/A"}
                      </td>

                      {/* Severity Level */}
                      <td className="px-5 py-4">
                        <Badge color={getSeverityBadgeColor(item.severity_level)} size="sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.severity_level === "Critical" ? "bg-red-500" :
                            item.severity_level === "Urgent" ? "bg-orange-400" :
                            item.severity_level === "Medium" ? "bg-yellow-400" : "bg-green-500"
                          }`} />
                          {getSeverityLabel(item.severity_level)}
                        </Badge>
                      </td>

                      {/* Case Summary summary_ar max 2 lines with tooltip */}
                      <td className="px-5 py-4 max-w-xs md:max-w-md">
                        <p 
                          className="line-clamp-2 font-medium text-gray-600 dark:text-gray-300 text-xs leading-relaxed" 
                          title={item.summary_ar}
                          dir="rtl"
                        >
                          {item.summary_ar}
                        </p>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(item.created_at).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedCase(item)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-brand-500 hover:border-brand-500/30 dark:text-gray-400 dark:hover:text-brand-400 transition-all cursor-pointer"
                            title={t("emergency_cases.actions.view", "View Details")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Copy Case ID */}
                          <button
                            onClick={() => handleCopyId(item.id)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-success-500 hover:border-success-500/30 dark:text-gray-400 dark:hover:text-success-400 transition-all cursor-pointer"
                            title={t("emergency_cases.actions.copy", "Copy ID")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>

                          {/* Export Case */}
                          <button
                            onClick={() => handleExportSingleCase(item)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-brand-500 hover:border-brand-500/30 dark:text-gray-400 dark:hover:text-brand-400 transition-all cursor-pointer"
                            title={t("emergency_cases.actions.export", "Export Case")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9l-4-4z" />
                            </svg>
                          </button>

                          {/* Delete Log */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-error-500 hover:border-error-500/30 dark:text-gray-400 dark:hover:text-error-400 transition-all cursor-pointer"
                            title={t("emergency_cases.actions.delete", "Purge Log")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Dynamic Pagination Footer panel with truncated sliding window */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-white/[0.01]">
              <div className="text-xs text-gray-500">
                {t("ai_requests.pagination.info", "Showing {{start}} to {{end}} of {{total}} requests", {
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, filteredCases.length),
                  total: filteredCases.length
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-700 dark:hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
                >
                  {isRtl ? "السابق ←" : "← Previous"}
                </button>

                <div className="flex items-center gap-1">
                  {getVisiblePageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-gray-500 font-bold self-center">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(Number(page))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === page
                            ? "bg-brand-500 text-white shadow-theme-xs"
                            : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-700 dark:hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
                >
                  {isRtl ? "→ التالي" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Details Modal */}
        <AnimatePresence>
          {selectedCase && (
            <EmergencyCaseDetailsModal
              item={selectedCase}
              onClose={() => setSelectedCase(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
