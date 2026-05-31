import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UrgentCase } from "../types/urgent-case.types";
import Badge from "../../../components/ui/badge/Badge";

interface Props {
  item: UrgentCase;
  onClose: () => void;
}

export default function EmergencyCaseDetailsModal({ item, onClose }: Props) {
  const { t, i18n } = useTranslation();

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
        className="relative z-[9999] w-full w-[95vw] sm:max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden text-gray-800 dark:text-gray-100"
      >
        {/* Soft neon background glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

        {/* Sticky Header - border-b, backdrop-blur, remains visible on vertical scroll */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-850 px-6 py-4 md:px-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center text-red-500 dark:text-red-400">
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-start">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                {t("emergency_cases.modal.details_title", "Medical Emergency Case Details")}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                ID: {item.id} · {new Date(item.created_at).toLocaleString()}
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
          
          {/* Metadata Details Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("emergency_cases.modal.case_id", "Case ID")}</span>
              <span className="block text-xs font-mono font-bold text-gray-700 dark:text-gray-200 mt-1 truncate" title={item.id}>
                {item.id}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("emergency_cases.modal.user_id", "User ID")}</span>
              <span className="block text-xs font-mono font-bold text-gray-700 dark:text-gray-200 mt-1 truncate" title={item.user_id || "N/A"}>
                {item.user_id || "N/A"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase">{t("emergency_cases.modal.severity", "Severity")}</span>
              <div className="mt-0.5">
                <Badge color={getSeverityBadgeColor(item.severity_level)} size="sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.severity_level === "Critical" ? "bg-red-500" :
                    item.severity_level === "Urgent" ? "bg-orange-400" :
                    item.severity_level === "Medium" ? "bg-yellow-400" : "bg-green-500"
                  }`} />
                  {getSeverityLabel(item.severity_level)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Arabic Case Summary (large text container) - Scroll locked at max 300px, break-words whitespace-pre-wrap */}
          <div className="flex flex-col space-y-2" dir="rtl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                {t("emergency_cases.modal.arabic_summary", "الملخص العربي الكامل (Arabic Summary)")}
              </span>
              <button
                onClick={() => handleCopyText(item.summary_ar)}
                className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{t("ai_requests.modal.copy", "نسخ النص")}</span>
              </button>
            </div>
            <div className="rounded-xl bg-red-50/5 dark:bg-red-500/5 border border-red-500/10 p-5 text-sm font-medium leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar break-words whitespace-pre-wrap select-text text-gray-750 dark:text-gray-200">
              {item.summary_ar}
            </div>
          </div>

        </div>

        {/* Bottom Details Footer */}
        <div className="flex justify-between text-xs text-gray-400 p-6 border-t border-gray-100 dark:border-gray-850">
          <span>{t("emergency_cases.modal.created_at", "Created Date")}:</span>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            {new Date(item.created_at).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US")}
          </span>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
