import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AiRequest } from "../types/ai-request.types";
import { aiRequestsService } from "../services/aiRequestsService";
import AiRequestRowSkeleton from "../components/AiRequestRowSkeleton";
import AiRequestDetailsModal from "../components/AiRequestDetailsModal";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "../../../icons";

export default function AiRequestsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  // State Management
  const [requests, setRequests] = useState<AiRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Operations Telemetry
  const [selectedRequest, setSelectedRequest] = useState<AiRequest | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [retryingId, setRetryingId] = useState<string | number | null>(null);

  // Search & Filter state parameters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Initial Fetch telemetry
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiRequestsService.getRequests();
      setRequests(data);
    } catch (err: any) {
      console.error("AI Requests fetch telemetry drop:", err);
      setError(err?.message || "Failed to sync AI diagnostic requests logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Delete Request Handler
  const handleDelete = async (id: string | number) => {
    if (!window.confirm(t("ai_requests.messages.confirm_delete", "Are you sure you want to purge this diagnostic audit log?"))) return;
    setDeletingId(id);
    try {
      const success = await aiRequestsService.deleteRequest(id);
      if (success) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(t("ai_requests.messages.delete_failed", "Failed to purge telemetry index."));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Retry Request Handler (simulating diagnostic handshake)
  const handleRetry = async (request: AiRequest) => {
    setRetryingId(request.id);
    try {
      const updated = await aiRequestsService.retryRequest(request);
      setRequests((prev) => prev.map((r) => (r.id === request.id ? updated : r)));
    } catch (err) {
      console.error(err);
    } finally {
      setRetryingId(null);
    }
  };

  // Copy Prompt Clipboard Helper
  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t("ai_requests.messages.copied", "Copied prompt text to clipboard."));
  };

  // User List extraction for filter dropdown
  const uniqueUsers = useMemo(() => {
    const emails = requests.map((r) => r.user_email);
    return Array.from(new Set(emails));
  }, [requests]);

  // Combined Search and Filters mapping
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.user_email.toLowerCase().includes(query) ||
          (r.user_name && r.user_name.toLowerCase().includes(query)) ||
          r.request_message.toLowerCase().includes(query) ||
          r.ai_response.toLowerCase().includes(query) ||
          r.request_type.toLowerCase().includes(query)
      );
    }

    // Status Filter match
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Category Type Filter match
    if (typeFilter) {
      result = result.filter((r) => r.request_type === typeFilter);
    }

    // User Email Filter match
    if (userFilter) {
      result = result.filter((r) => r.user_email === userFilter);
    }

    // Responsive Header Sorting
    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof AiRequest] ?? "";
      let valB: any = b[sortBy as keyof AiRequest] ?? "";

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
  }, [requests, searchQuery, statusFilter, typeFilter, userFilter, sortBy, sortOrder]);

  // Pagination parameters
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Categories helper mapping
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "medical_analysis":
        return t("medical_landing.features.f1_title", "Medical Analysis");
      case "xray_analysis":
        return t("medical_landing.features.f1_title", "AI Scan & X-Ray Mobile Scanner");
      case "symptom_checker":
        return t("medical_landing.features.f6_title", "Smart Symptom Logger");
      case "emergency_assistance":
        return t("medical_landing.features.f4_title", "Emergency Mobile Panic Button");
      case "first_aid":
        return t("medical_landing.features.f3_title", "Instant First Aid Coach");
      default:
        return t("medical_landing.features.f2_title", "AI Medical Chat");
    }
  };

  const getCategoryBadgeColor = (cat: string): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (cat) {
      case "medical_analysis":
        return "info";
      case "xray_analysis":
        return "primary";
      case "symptom_checker":
        return "warning";
      case "emergency_assistance":
        return "error";
      case "first_aid":
        return "success";
      default:
        return "light";
    }
  };

  const getStatusBadgeColor = (status: string): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "pending":
        return "warning";
      default:
        return "error";
    }
  };

  // Client-Side CSV Exporter
  const handleExportCSV = () => {
    if (filteredRequests.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["ID", "User Email", "Request Type", "Request message", "AI Response Preview", "Status", "Response Time (s)", "Created At"];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.user_email,
      r.request_type,
      `"${r.request_message.replace(/"/g, '""')}"`,
      `"${r.ai_response.replace(/"/g, '""')}"`,
      r.status,
      r.response_time,
      r.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\ufeff" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salamati_ai_requests_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting Handler Helper
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Truncated page numbers calculation for responsive pagination sliding window
  const getVisiblePageNumbers = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) {
        pages.push("...");
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push("...");
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <>
      <PageMeta
        title={t("ai_requests.meta.title", "AI requests Monitoring Console | Salamati Admin")}
        description="Premium medical AI requests table manager."
      />
      <div className="space-y-6 text-gray-800 dark:text-gray-100 font-outfit">
        
        {/* Futuristic Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-start">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              {t("ai_requests.title", "مراقبة طلبات المساعد الطبي (AI Requests Console)")}
            </h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("ai_requests.subtitle", "مراقبة وتحليل ومعالجة سجلات التفاعل الطبي وسرعة الاستجابة بالذكاء الاصطناعي.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all flex items-center gap-2 cursor-pointer shadow-theme-xs"
            >
              <svg className="w-4 h-4 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9l-4-4z" />
              </svg>
              {t("ai_requests.export", "Export CSV")}
            </button>
            <button
              onClick={fetchRequests}
              className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-all cursor-pointer shadow-theme-xs"
              title="Sync Telemetry"
            >
              <svg className={`w-4.5 h-4.5 text-teal-500 dark:text-teal-400 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Telemetry Counter Cards (Top summary) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {/* Total Requests */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-brand-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/15 text-brand-500 dark:text-brand-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("ai_requests.summary.total", "Total Requests")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {requests.length}
                </h4>
              </div>
              <Badge color="primary">
                <ArrowUpIcon className="w-3 h-3" />
                +12.5%
              </Badge>
            </div>
          </div>

          {/* Resolved */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-success-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-xl dark:bg-success-500/15 text-success-500 dark:text-success-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("ai_requests.summary.completed", "Resolved")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {requests.filter(r => r.status === "completed").length}
                </h4>
              </div>
              <Badge color="success">
                <ArrowUpIcon className="w-3 h-3" />
                +14.2%
              </Badge>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-warning-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-xl dark:bg-warning-500/15 text-warning-500 dark:text-warning-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("ai_requests.summary.pending", "Active")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {requests.filter(r => r.status === "processing").length}
                </h4>
              </div>
              <Badge color="warning">
                Active
              </Badge>
            </div>
          </div>

          {/* Avg Latency */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-blue-light-500/20 group">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-light-50 rounded-xl dark:bg-blue-light-500/15 text-blue-light-500 dark:text-blue-light-400 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-end justify-between mt-5">
              <div className="text-start">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("ai_requests.summary.latency", "Avg Latency")}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {(requests.reduce((acc, r) => acc + (r.response_time || 0), 0) / (requests.filter(r => r.response_time > 0).length || 1)).toFixed(2)}s
                </h4>
              </div>
              <Badge color="success">
                <ArrowDownIcon className="w-3 h-3" />
                -8.4%
              </Badge>
            </div>
          </div>
        </div>

        {/* Console Search & Filter Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input bar */}
            <div className="relative flex items-center">
              <svg className="w-4.5 h-4.5 text-gray-400 absolute start-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={t("ai_requests.search_placeholder", "البحث باسم المستخدم، الرسائل، أو نوع التشخيص...")}
                className="h-11 w-full pl-10 pr-4 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-white/30 dark:focus:border-brand-800"
              />
            </div>

            {/* Filter by Category Type */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full px-3.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800"
            >
              <option value="" className="dark:bg-gray-900">{t("ai_requests.filters.all_types", "All AI Categories")}</option>
              <option value="medical_analysis" className="dark:bg-gray-900">{t("medical_landing.features.f1_title", "Medical Analysis")}</option>
              <option value="xray_analysis" className="dark:bg-gray-900">{t("medical_landing.features.f1_title", "AI Scan & X-Ray Mobile Scanner")}</option>
              <option value="symptom_checker" className="dark:bg-gray-900">{t("medical_landing.features.f6_title", "Smart Symptom Logger")}</option>
              <option value="emergency_assistance" className="dark:bg-gray-900">{t("medical_landing.features.f4_title", "Emergency Mobile Panic Button")}</option>
              <option value="first_aid" className="dark:bg-gray-900">{t("medical_landing.features.f3_title", "Instant First Aid Coach")}</option>
              <option value="ai_medical_chat" className="dark:bg-gray-900">{t("medical_landing.features.f2_title", "AI Medical Chat")}</option>
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full px-3.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800"
            >
              <option value="" className="dark:bg-gray-900">{t("ai_requests.filters.all_statuses", "All Statuses")}</option>
              <option value="completed" className="dark:bg-gray-900">Completed</option>
              <option value="processing" className="dark:bg-gray-900">Processing</option>
              <option value="pending" className="dark:bg-gray-900">Pending</option>
              <option value="failed" className="dark:bg-gray-900">Failed</option>
            </select>

            {/* Filter by User Email */}
            <select
              value={userFilter}
              onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 w-full px-3.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800"
            >
              <option value="" className="dark:bg-gray-900">{t("ai_requests.filters.all_users", "All Patients")}</option>
              {uniqueUsers.map((email) => (
                <option key={email} value={email} className="dark:bg-gray-900">{email}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clean Dashboard Table Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs relative z-10">
          <div className="overflow-x-auto max-w-full custom-scrollbar">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
                <tr className="text-start">
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("id")}>
                    ID {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("user_email")}>
                    {t("ai_requests.columns.user", "User")} {sortBy === "user_email" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("request_type")}>
                    {t("ai_requests.columns.type", "Category")} {sortBy === "request_type" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold">{t("ai_requests.columns.message", "Request Message")}</th>
                  <th className="px-5 py-4 text-start font-bold">{t("ai_requests.columns.response", "AI Clinical Diagnosis Preview")}</th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("status")}>
                    {t("ai_requests.columns.status", "Status")} {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("response_time")}>
                    {t("ai_requests.columns.latency", "Latency")} {sortBy === "response_time" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-start font-bold cursor-pointer hover:text-brand-500 select-none transition-colors" onClick={() => handleSort("created_at")}>
                    {t("ai_requests.columns.date", "Created At")} {sortBy === "created_at" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="px-5 py-4 text-center font-bold">{t("ai_requests.columns.actions", "Actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                {loading ? (
                  <AiRequestRowSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-12 h-12 rounded-full bg-error-50 dark:bg-error-500/15 flex items-center justify-center mx-auto text-error-500 dark:text-error-400">
                          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h4 className="text-base font-semibold text-gray-800 dark:text-white">{t("ai_requests.telemetry_offline", "Telemetry Offline")}</h4>
                        <p className="text-xs text-gray-400 font-mono leading-relaxed">{error}</p>
                        <button
                          onClick={fetchRequests}
                          className="px-4 py-2 rounded-lg border border-error-500/30 hover:border-error-500 bg-error-50 dark:bg-error-500/15 text-error-600 dark:text-error-400 text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                          </svg>
                          {t("ai_requests.retry", "Retry Link")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                      <div className="max-w-sm mx-auto space-y-2.5">
                        <svg className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs">{t("ai_requests.no_data", "No matching diagnostic logs found.")}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request) => (
                    <motion.tr
                      key={request.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Request ID */}
                      <td className="px-5 py-4 font-mono text-xs text-gray-400 truncate max-w-[90px]" title={String(request.id)}>
                        {request.id}
                      </td>

                      {/* User Identity */}
                      <td className="px-5 py-4 text-start">
                        <span className="block font-semibold text-gray-800 dark:text-white/90 text-sm truncate max-w-[120px]">
                          {request.user_name || request.user_email.split("@")[0]}
                        </span>
                        <span className="block text-[11px] text-gray-400 mt-0.5 truncate max-w-[130px]" title={request.user_email}>
                          {request.user_email}
                        </span>
                      </td>

                      {/* Request Category Badge */}
                      <td className="px-5 py-4 text-start">
                        <Badge color={getCategoryBadgeColor(request.request_type)} size="sm">
                          {getCategoryLabel(request.request_type)}
                        </Badge>
                      </td>

                      {/* Request message clip */}
                      <td className="px-5 py-4 text-start max-w-[180px]">
                        <p className="truncate font-medium text-gray-600 dark:text-gray-300 text-xs leading-relaxed" title={request.request_message}>
                          {request.request_message}
                        </p>
                      </td>

                      {/* Diagnostic response clip */}
                      <td className="px-5 py-4 text-start max-w-[200px]">
                        <p className="truncate font-medium text-gray-500 dark:text-gray-400 text-xs leading-relaxed" title={request.ai_response}>
                          {request.ai_response}
                        </p>
                      </td>

                      {/* Request status */}
                      <td className="px-5 py-4 text-start">
                        <Badge color={getStatusBadgeColor(request.status)} size="sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            request.status === "completed" ? "bg-success-600 dark:bg-success-500" :
                            request.status === "processing" ? "bg-blue-light-500 dark:bg-blue-light-500" :
                            request.status === "pending" ? "bg-warning-500 dark:bg-orange-400" : "bg-error-500 dark:bg-error-500"
                          }`} />
                          {request.status}
                        </Badge>
                      </td>

                      {/* Latency timing */}
                      <td className="px-5 py-4 text-start font-mono text-xs font-bold text-gray-400 dark:text-gray-500">
                        {request.response_time > 0 ? `${request.response_time}s` : "0.0s"}
                      </td>

                      {/* Creation Date */}
                      <td className="px-5 py-4 text-start text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {new Date(request.created_at).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      {/* Action buttons list */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-brand-500 hover:border-brand-500/30 dark:text-gray-400 dark:hover:text-brand-400 transition-all cursor-pointer"
                            title={t("ai_requests.actions.view", "View Details")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Copy message */}
                          <button
                            onClick={() => handleCopyPrompt(request.request_message)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-success-500 hover:border-success-500/30 dark:text-gray-400 dark:hover:text-success-400 transition-all cursor-pointer"
                            title={t("ai_requests.actions.copy", "Copy Prompt")}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>

                          {/* Retry (only fail/processing) */}
                          <button
                            onClick={() => handleRetry(request)}
                            disabled={retryingId === request.id}
                            className={`p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-warning-500 hover:border-warning-500/30 dark:text-gray-400 dark:hover:text-warning-400 transition-all cursor-pointer ${
                              retryingId === request.id ? "opacity-50 pointer-events-none" : ""
                            }`}
                            title={t("ai_requests.actions.retry", "Re-run Triage")}
                          >
                            <svg className={`w-4 h-4 ${retryingId === request.id ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                            </svg>
                          </button>

                          {/* Delete log */}
                          <button
                            onClick={() => handleDelete(request.id)}
                            disabled={deletingId === request.id}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:text-error-500 hover:border-error-500/30 dark:text-gray-400 dark:hover:text-error-400 transition-all cursor-pointer"
                            title={t("ai_requests.actions.delete", "Purge Log")}
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
                  end: Math.min(currentPage * itemsPerPage, filteredRequests.length),
                  total: filteredRequests.length
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

        {/* Lazy Loaded Modal details trigger */}
        <AnimatePresence>
          {selectedRequest && (
            <AiRequestDetailsModal
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
