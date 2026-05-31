import { useState, useEffect } from "react";
import { statsService, DashboardStats } from "../../services/statsService";
import { useTranslation } from "react-i18next";
import { GroupIcon, BoxIconLine, ArrowUpIcon, ArrowDownIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    statsService.getStats()
      .then((data) => {
        if (active) {
          setStatsData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard metric fetch failed:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const currentStats = statsData || {
    users_count: 142800,
    analyses_count: 982350,
    emergencies_count: 1245,
    hospitals_count: 850,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Active Patients */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-cyan-500/20 group">
        <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
          <GroupIcon className="size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("medical_landing.stats.users", "Active Patients")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ) : (
                currentStats.users_count.toLocaleString()
              )}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.0%
          </Badge>
        </div>
      </div>

      {/* Medical Analyses */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-teal-500/20 group">
        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform duration-300">
          <BoxIconLine className="size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("medical_landing.stats.analyses", "Analyses Resolved")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ) : (
                currentStats.analyses_count.toLocaleString()
              )}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            24.5%
          </Badge>
        </div>
      </div>

      {/* Emergency Cases */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-red-500/20 group">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-950/20 text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("medical_landing.stats.emergencies", "Emergency Cases")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ) : (
                currentStats.emergencies_count.toLocaleString()
              )}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
            3.2%
          </Badge>
        </div>
      </div>

      {/* Active Consultations */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden transition-all hover:border-indigo-500/20 group">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("medical_landing.stats.hospitals", "Active Consultations")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? (
                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ) : (
                currentStats.hospitals_count.toLocaleString()
              )}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            12.8%
          </Badge>
        </div>
      </div>
    </div>
  );
}

