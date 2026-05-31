import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statsService, DashboardStats, AiUsageDaily } from "../../services/statsService";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";

// Premium icons from standard SVG vectors
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4M4 19h4m0-8h4m-2-2v4m5-9a3 3 0 013 3v1ch5a3 3 0 013 3v2h-13V6a3 3 0 013-3z" />
    </svg>
  );
}

export default function AdminHome() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [aiUsageDaily, setAiUsageDaily] = useState<AiUsageDaily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, usage] = await Promise.all([
        statsService.getStats(),
        statsService.getAiUsageDaily(),
      ]);
      setStatsData(stats);
      setAiUsageDaily(usage);
    } catch (err: any) {
      console.error("Admin Home data fetch error:", err);
      setError(t("ai_requests.telemetry_offline", "Telemetry Link Offline"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Standard fallback data in case of complete API failure (mapped to required default Supabase numbers)
  const currentStats = statsData || {
    total_ai_requests: 243,
    total_chat_messages: 143,
    active_chat_users: 2,
    total_radiology: 50,
    emergency_cases: 0,
    drug_checks: 0,
    total_labs: 0,
    total_users: 0,
  };

  // Dynamically compute insights to make it extremely premium
  const totalInteractions = currentStats.total_ai_requests + currentStats.total_chat_messages;
  
  // Calculate dynamic highest-used feature
  let mostUsedFeatureKey = "ai_requests_val";
  let maxInteractionVal = currentStats.total_ai_requests;
  
  if (currentStats.total_chat_messages > maxInteractionVal) {
    mostUsedFeatureKey = "chat_assistant_val";
    maxInteractionVal = currentStats.total_chat_messages;
  }
  if (currentStats.total_radiology > maxInteractionVal) {
    mostUsedFeatureKey = "radiology_reports";
    maxInteractionVal = currentStats.total_radiology;
  }

  // 1. Chart 1 Option Config (Area Chart - AI Requests Activity)
  const chart1Options: ApexOptions = {
    colors: ["#0ea5e9"], // Sky blue matching Salamati UI
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 320,
      toolbar: { show: false },
      foreColor: "#9ca3af",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: aiUsageDaily.map((item) => item.day),
      title: {
        text: t("admin_home.charts.day_label", "Day"),
        style: { fontSize: "12px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: t("admin_home.charts.requests_label", "Requests"),
        style: { fontSize: "12px", fontWeight: 600 },
      },
    },
    grid: {
      borderColor: "rgba(156, 163, 175, 0.15)",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: {
        formatter: (val: number) => `${val} ${t("admin_home.charts.requests_label", "Requests")}`,
      },
    },
  };

  const chart1Series = [
    {
      name: t("admin_home.charts.ai_requests", "AI Requests"),
      data: aiUsageDaily.map((item) => item.total_requests),
    },
  ];

  // 2. Chart 2 Option Config (Donut Chart - Platform Usage Distribution)
  const chart2Options: ApexOptions = {
    colors: ["#0ea5e9", "#6366f1", "#10b981"], // cyan, indigo, emerald
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      foreColor: "#9ca3af",
    },
    labels: [
      t("admin_home.charts.ai_requests", "AI Requests"),
      t("admin_home.charts.chat_messages", "Chat Messages"),
      t("admin_home.charts.radiology_reports", "Radiology Reports"),
    ],
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      labels: {
        colors: "#9ca3af",
      },
    },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("admin_home.insights.interactions", "Total Interactions"),
              color: "#9ca3af",
              fontSize: "12px",
              formatter: () => `${currentStats.total_ai_requests + currentStats.total_chat_messages + currentStats.total_radiology}`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const chart2Series = [
    currentStats.total_ai_requests,
    currentStats.total_chat_messages,
    currentStats.total_radiology,
  ];

  // 3. Chart 3 Option Config (Bar Chart - Medical Services Comparison)
  const chart3Options: ApexOptions = {
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], // blue, emerald, warning, error
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: { show: false },
      foreColor: "#9ca3af",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        t("admin_home.charts.radiology_reports", "Radiology Reports"),
        t("admin_home.charts.labs", "Laboratory Analyses"),
        t("admin_home.charts.drugs", "Drug Checks"),
        t("admin_home.charts.emergencies", "Emergency Cases"),
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: t("admin_home.charts.requests_label", "Count"),
        style: { fontSize: "12px", fontWeight: 600 },
      },
    },
    grid: {
      borderColor: "rgba(156, 163, 175, 0.15)",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const chart3Series = [
    {
      name: t("admin_home.charts.services_comp_title", "Medical Services"),
      data: [
        currentStats.total_radiology,
        currentStats.total_labs,
        currentStats.drug_checks,
        currentStats.emergency_cases,
      ],
    },
  ];

  // Definition of the 8 distinct cards
  const kpiCards = [
    {
      key: "total_ai_requests",
      label: t("admin_home.metrics.total_ai_requests", "Total AI Requests"),
      value: currentStats.total_ai_requests,
      themeColor: "cyan",
      badgeColor: "primary" as const,
      trend: "+15.4%",
      icon: (
        <SparklesIcon className="size-6 text-cyan-600 dark:text-cyan-400" />
      ),
      bgClass: "bg-cyan-100 dark:bg-cyan-950/20",
      borderHover: "hover:border-cyan-500/20",
    },
    {
      key: "total_chat_messages",
      label: t("admin_home.metrics.total_chat_messages", "Total Chat Messages"),
      value: currentStats.total_chat_messages,
      themeColor: "indigo",
      badgeColor: "info" as const,
      trend: "+12.8%",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-indigo-600 dark:text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      bgClass: "bg-indigo-100 dark:bg-indigo-950/20",
      borderHover: "hover:border-indigo-500/20",
    },
    {
      key: "active_chat_users",
      label: t("admin_home.metrics.active_chat_users", "Active Chat Users"),
      value: currentStats.active_chat_users,
      themeColor: "emerald",
      badgeColor: "success" as const,
      trend: "Active",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-emerald-600 dark:text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgClass: "bg-emerald-100 dark:bg-emerald-950/20",
      borderHover: "hover:border-emerald-500/20",
    },
    {
      key: "total_radiology",
      label: t("admin_home.metrics.total_radiology", "Radiology Reports"),
      value: currentStats.total_radiology,
      themeColor: "blue",
      badgeColor: "info" as const,
      trend: "+9.2%",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-blue-600 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
      ),
      bgClass: "bg-blue-100 dark:bg-blue-950/20",
      borderHover: "hover:border-blue-500/20",
    },
    {
      key: "emergency_cases",
      label: t("admin_home.metrics.emergency_cases", "Emergency Cases"),
      value: currentStats.emergency_cases,
      themeColor: "red",
      badgeColor: "error" as const,
      trend: "Triage",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-red-600 dark:text-red-450">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgClass: "bg-red-100 dark:bg-red-950/20",
      borderHover: "hover:border-red-500/20",
    },
    {
      key: "drug_checks",
      label: t("admin_home.metrics.drug_checks", "Drug Checks"),
      value: currentStats.drug_checks,
      themeColor: "amber",
      badgeColor: "warning" as const,
      trend: "Stable",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-amber-600 dark:text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      bgClass: "bg-amber-100 dark:bg-amber-955/20",
      borderHover: "hover:border-amber-500/20",
    },
    {
      key: "total_labs",
      label: t("admin_home.metrics.total_labs", "Laboratory Analyses"),
      value: currentStats.total_labs,
      themeColor: "teal",
      badgeColor: "success" as const,
      trend: "Ready",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-teal-600 dark:text-teal-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bgClass: "bg-teal-100 dark:bg-teal-950/20",
      borderHover: "hover:border-teal-500/20",
    },
    {
      key: "total_users",
      label: t("admin_home.metrics.total_users", "Total Users"),
      value: currentStats.total_users,
      themeColor: "purple",
      badgeColor: "primary" as const,
      trend: "Synced",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 text-purple-600 dark:text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgClass: "bg-purple-100 dark:bg-purple-950/20",
      borderHover: "hover:border-purple-500/20",
    },
  ];

  return (
    <>
      <PageMeta
        title={t("admin_home.title", "Platform Analytics Control Center")}
        description={t("admin_home.subtitle", "Monitor real-time generative models, medical triage metrics, and system analytics.")}
      />

      <div className="space-y-6 select-none font-outfit" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white/90">
              {t("admin_home.title", "Platform Analytics Control Center")}
            </h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("admin_home.subtitle", "Monitor real-time generative models, medical triage metrics, and system analytics.")}
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start h-11 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all flex items-center gap-2 font-bold text-sm shadow-theme-xs cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
            <span>{loading ? t("common.loading", "Loading...") : t("ai_requests.retry", "Refresh Telemetry")}</span>
          </button>
        </div>

        {/* Error Fallback Banner */}
        {error && (
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-950/15 text-xs text-red-400 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-bold">{t("ai_requests.telemetry_offline", "Telemetry Link Offline")}:</span> {error}
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold tracking-wide transition-all uppercase text-[10px]"
            >
              {t("ai_requests.retry", "Retry Handshake")}
            </button>
          </div>
        )}

        {/* 8 Statistics Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {kpiCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all duration-300 ${card.borderHover} group`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgClass} group-hover:scale-105 transition-transform duration-300`}>
                  {card.icon}
                </div>
                
                {loading ? (
                  <span className="w-14 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                ) : (
                  <Badge color={card.badgeColor} variant="light" size="sm">
                    {card.trend === "Active" || card.trend === "Triage" || card.trend === "Stable" || card.trend === "Ready" || card.trend === "Synced" ? (
                      card.trend
                    ) : (
                      <>
                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span>{card.trend}</span>
                      </>
                    )}
                  </Badge>
                )}
              </div>

              <div className="mt-5">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-normal">
                  {card.label}
                </span>
                <h4 className="mt-2.5 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {loading ? (
                    <span className="inline-block w-20 h-7 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  ) : (
                    card.value.toLocaleString()
                  )}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Chart 1: Area Chart - AI Activity */}
          <div className="col-span-12 xl:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white/90">
                  {t("admin_home.charts.ai_activity_title", "AI Requests Activity")}
                </h3>
              </div>
            </div>

            {loading ? (
              <div className="w-full h-80 bg-gray-100 dark:bg-white/[0.02] rounded-xl animate-pulse flex items-center justify-center text-sm text-gray-400">
                {t("common.loading", "Loading details...")}
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-3 min-w-[500px] xl:min-w-full">
                  <Chart options={chart1Options} series={chart1Series} type="area" height={320} />
                </div>
              </div>
            )}
          </div>

          {/* Chart 2: Donut Chart - Platform Usage */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white/90 mb-5">
                {t("admin_home.charts.usage_dist_title", "Platform Usage Distribution")}
              </h3>

              {loading ? (
                <div className="w-full h-64 bg-gray-100 dark:bg-white/[0.02] rounded-xl animate-pulse flex items-center justify-center text-sm text-gray-400">
                  {t("common.loading", "Loading...")}
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <Chart options={chart2Options} series={chart2Series} type="donut" width="100%" height={280} />
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Bar Chart - Medical Comparison */}
          <div className="col-span-12 md:col-span-6 xl:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white/90 mb-5">
              {t("admin_home.charts.services_comp_title", "Medical Services Comparison")}
            </h3>

            {loading ? (
              <div className="w-full h-80 bg-gray-100 dark:bg-white/[0.02] rounded-xl animate-pulse flex items-center justify-center text-sm text-gray-400">
                {t("common.loading", "Loading comparison...")}
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-3 min-w-[500px] xl:min-w-full">
                  <Chart options={chart3Options} series={chart3Series} type="bar" height={320} />
                </div>
              </div>
            )}
          </div>

          {/* Insights Panel */}
          <div className="col-span-12 xl:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white/90 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>{t("admin_home.insights.title", "Intelligent Platform Insights")}</span>
              </h3>

              <div className="space-y-4">
                {/* 1. Most Used Feature */}
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {t("admin_home.insights.most_used", "Most Used Feature")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white/90 mt-1.5 block">
                      {t(`admin_home.insights.${mostUsedFeatureKey}`)}
                    </span>
                  </div>
                  <Badge color="primary" variant="solid" size="sm">
                    {t("admin_home.insights.ai_requests_val", "AI Requests")}
                  </Badge>
                </div>

                {/* 2. Most Active Module */}
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {t("admin_home.insights.most_active", "Most Active Module")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white/90 mt-1.5 block">
                      {t("admin_home.insights.chat_assistant_val", "Chat Assistant")}
                    </span>
                  </div>
                  <Badge color="success" variant="solid" size="sm">
                    {t("admin_home.insights.chat_assistant_val", "Chat Assistant")}
                  </Badge>
                </div>

                {/* 3. Total Interactions */}
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      {t("admin_home.insights.interactions", "Total Interactions")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white/90 mt-1.5 block">
                      {loading ? "..." : totalInteractions.toLocaleString()}
                    </span>
                  </div>
                  <Badge color="info" variant="solid" size="sm">
                    {t("admin_home.charts.requests_label", "Interactions")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
