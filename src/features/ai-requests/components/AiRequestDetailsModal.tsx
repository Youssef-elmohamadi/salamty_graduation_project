import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AiRequest } from "../types/ai-request.types";
import Badge from "../../../components/ui/badge/Badge";

interface Props {
  request: AiRequest;
  onClose: () => void;
}

export default function AiRequestDetailsModal({ request, onClose }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    // Prevent background page scrolling on mount
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable page scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Maps category slug to user-friendly titles
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

  // Render the modal inside a React Portal attached directly to document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8 font-outfit select-none">
      
      {/* Backdrop full screen overlay - matches requirements (z-[9998], blur, click to close) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-gray-400/50 backdrop-blur-[32px] dark:bg-black/60 transition-opacity"
      />

      {/* Modal card content - z-[9999], responsive sizes, max-height scrolling constraints */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-[9999] w-full w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] flex flex-col rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden text-gray-800 dark:text-gray-100"
      >
        {/* Decorative soft glowing spots inside card */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

        {/* Sticky Header - border-b, backdrop-blur, remains visible on vertical scroll */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-850 px-6 py-4 md:px-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center text-brand-500 dark:text-brand-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-start">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                {t("ai_requests.modal.details_title", "تقرير التشخيص والتحليل الطبي")}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                ID: {request.id} · {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar text-start relative z-10">
          
          {/* Console Metadata Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <div className="flex flex-col justify-center">
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("ai_requests.columns.user", "User")}</span>
              <span className="block text-sm font-bold text-gray-700 dark:text-gray-200 mt-0.5 truncate" title={request.user_email}>
                {request.user_name || request.user_email.split("@")[0]}
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("ai_requests.columns.type", "Type")}</span>
              <div className="mt-1">
                <Badge color={getCategoryBadgeColor(request.request_type)} size="sm">
                  {getCategoryLabel(request.request_type)}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("ai_requests.modal.response_time", "Latency")}</span>
              <div className="mt-1">
                <Badge color="info" size="sm">
                  {request.response_time > 0 ? `${request.response_time}s` : "0.0s"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("ai_requests.columns.status", "Status")}</span>
              <div className="mt-1">
                <Badge color={getStatusBadgeColor(request.status)} size="sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    request.status === "completed" ? "bg-success-600 dark:bg-success-500" :
                    request.status === "processing" ? "bg-blue-light-600 dark:bg-blue-light-500" :
                    request.status === "pending" ? "bg-warning-600 dark:bg-orange-400" : "bg-error-600 dark:bg-error-500"
                  }`} />
                  {request.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Input vs Output side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Request Section - Scroll locked at max 300px */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wide">
                  {t("ai_requests.modal.user_prompt", "مطلب المريض (User Prompt)")}
                </span>
                <button
                  onClick={() => handleCopyText(request.request_message)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {t("ai_requests.modal.copy", "Copy")}
                </button>
              </div>
              <div className="flex-1 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-150 dark:border-gray-800 p-4 text-sm font-medium leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar break-words whitespace-pre-wrap select-text text-gray-600 dark:text-gray-300">
                {request.request_message}
              </div>
            </div>

            {/* AI Clinical Diagnosis Response Section - Scroll locked at max 300px, break-words whitespace-pre-wrap */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-success-600 dark:text-success-500 uppercase tracking-wide">
                  {t("ai_requests.modal.clinical_diagnosis", "التشخيص الطبي للذكاء الاصطناعي (Clinical Response)")}
                </span>
                <button
                  onClick={() => handleCopyText(request.ai_response)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {t("ai_requests.modal.copy", "Copy")}
                </button>
              </div>
              <div className="flex-1 rounded-xl bg-success-50/10 dark:bg-success-500/5 border border-success-500/10 p-4 text-sm font-medium leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar break-words whitespace-pre-wrap select-text text-gray-700 dark:text-gray-200">
                {request.ai_response}
              </div>
            </div>
          </div>

          {/* Detailed Metadata/Flags & Uploaded Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            
            {/* Clinical Flags & Diagnostics Model - Scroll locked at max 300px */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
                {t("ai_requests.modal.telemetry_analysis", "تحليل مقاييس الأداء والنماذج (Model Performance Telemetry)")}
              </span>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{t("ai_requests.modal.model_used", "AI Model Engine")}</span>
                  <span className="font-bold text-gray-600 dark:text-gray-300 font-mono">{request.metadata?.model_used || "Salamati-Med-Triage-v2"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{t("ai_requests.modal.tokens", "Token Telemetry")}</span>
                  <span className="font-bold text-gray-600 dark:text-gray-300 font-mono">
                    {request.metadata?.tokens_consumed ? `${request.metadata.tokens_consumed} tokens` : "N/A"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {request.metadata?.clinical_flags?.map((flag, idx) => (
                    <Badge
                      key={idx}
                      color="primary"
                      size="sm"
                      startIcon={<span>✦</span>}
                    >
                      {flag}
                    </Badge>
                  )) || (
                    <span className="text-xs text-gray-500 italic">No diagnostic markers flagged.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Attached visual scans - Scroll locked at max 300px */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
                {t("ai_requests.modal.attached_visuals", "الملفات وصور الأشعة المرفقة (Visual Scan Attachments)")}
              </span>
              <div className="space-y-2">
                {request.metadata?.attached_files && request.metadata.attached_files.length > 0 ? (
                  request.metadata.attached_files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.01] p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center text-brand-500 dark:text-brand-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-start">
                          <span className="block font-bold text-gray-700 dark:text-gray-200 truncate max-w-[160px]">{file}</span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">JPEG scan · 1.4 MB</span>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                      >
                        {t("ai_requests.modal.view_scan", "عرض الأشعة")}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 text-xs gap-1.5">
                    <svg className="w-6 h-6 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{t("ai_requests.modal.no_attachments", "لا توجد ملفات مرفقة")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>,
    document.body
  );
}
