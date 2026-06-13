import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/header/LanguageSwitcher";
import { statsService, DashboardStats } from "../services/statsService";

// High-fidelity smooth animated count-up counter component triggered on scroll in view
function AnimatedCounter({ value, duration = 2 }: { value: number | string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const valueStr = String(value);
    const hasPercent = valueStr.includes("%");
    const hasSeconds = valueStr.includes("s");
    const numericPart = valueStr.replace(/[^0-9.]/g, "");
    const parsedNum = parseFloat(numericPart);

    if (isNaN(parsedNum)) {
      setDisplayValue(valueStr);
      return;
    }

    let start = 0;
    const end = parsedNum;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quad formulation
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;

      let formatted: string;
      if (hasPercent) {
        formatted = current.toFixed(1) + "%";
      } else if (hasSeconds) {
        formatted = current.toFixed(1) + "s";
      } else {
        if (current >= 1000) {
          formatted = Math.floor(current).toLocaleString();
        } else {
          formatted = Math.floor(current).toString();
        }
      }

      setDisplayValue(formatted);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(valueStr);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function MedicalLandingPage() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Feedback form states
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("General Experience");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Handle sticky glass navbar background shift on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 8 Premium Medical Feature configurations
  const features = [
    {
      title: t("medical_landing.features.f1_title", "AI Scan & X-Ray Mobile Scanner"),
      desc: t("medical_landing.features.f1_desc", "Analyze X-rays, MRI, and laboratory scans in real-time using your phone's camera."),
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      glow: "hover:shadow-cyan-500/10",
      accent: "border-cyan-500/20 text-cyan-400 bg-cyan-950/20",
    },
    {
      title: t("medical_landing.features.f2_title", "24/7 Smart Pocket Assistant"),
      desc: t("medical_landing.features.f2_desc", "An expert AI health helper chat always with you to answer symptoms and direct routes."),
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      glow: "hover:shadow-teal-500/10",
      accent: "border-teal-500/20 text-teal-400 bg-teal-950/20",
    },
    {
      title: t("medical_landing.features.f3_title", "Instant First Aid Coach"),
      desc: t("medical_landing.features.f3_desc", "Visual, voice-guided steps on your phone to handle medical incidents in seconds."),
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      glow: "hover:shadow-emerald-500/10",
      accent: "border-emerald-500/20 text-emerald-400 bg-emerald-950/20",
    },
    {
      title: t("medical_landing.features.f4_title", "Emergency Mobile Panic Button"),
      desc: t("medical_landing.features.f4_desc", "One-tap emergency broadcast transmitting geo-coordinates to the nearest trauma unit."),
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      glow: "hover:shadow-red-500/10",
      accent: "border-red-500/20 text-red-400 bg-red-950/20",
    },
    {
      title: t("medical_landing.features.f5_title", "Clinic & Hospital Mapper"),
      desc: t("medical_landing.features.f5_desc", "Live distance maps and GPS directions showing active medical care providers near you."),
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      glow: "hover:shadow-sky-500/10",
      accent: "border-sky-500/20 text-sky-400 bg-sky-950/20",
    },
    {
      title: t("medical_landing.features.f6_title", "Smart Symptom Logger"),
      desc: t("medical_landing.features.f6_desc", "Log symptoms over time on your phone to generate visual reports for medical consults."),
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 00-2 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      glow: "hover:shadow-purple-500/10",
      accent: "border-purple-500/20 text-purple-400 bg-purple-950/20",
    },
    {
      title: t("medical_landing.features.f7_title", "Predictive Health Recommendations"),
      desc: t("medical_landing.features.f7_desc", "Personalized AI wellness advice and daily vector optimizations matching your activity logs."),
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      glow: "hover:shadow-pink-500/10",
      accent: "border-pink-500/20 text-pink-400 bg-pink-950/20",
    },
    {
      title: t("medical_landing.features.f8_title", "Clinical PDF Reports Export"),
      desc: t("medical_landing.features.f8_desc", "Generate professional, consolidated clinical logs to share with your family doctor."),
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      glow: "hover:shadow-indigo-500/10",
      accent: "border-indigo-500/20 text-indigo-400 bg-indigo-950/20",
    },
  ];

  // Real-time API statistics state managers
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getStats();
      setStatsData(data);
    } catch (err: any) {
      console.error("Telemetry fetch failed:", err);
      setError(err?.message || "Failed to establish telemetry interface with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsCards = statsData ? [
    {
      value: statsData.users_count,
      suffix: "+",
      label: t("medical_landing.stats.users", "Active Users"),
      desc: t("medical_landing.stats.users_desc", "Patients and users trusting our platform for daily health tracking."),
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-cyan-400 to-blue-500",
      accent: "border-cyan-500/20 text-cyan-400 bg-cyan-950/20 shadow-cyan-500/5 hover:shadow-cyan-500/10 hover:border-cyan-500/40"
    },
    {
      value: statsData.analyses_count,
      suffix: "+",
      label: t("medical_landing.stats.analyses", "Medical Analyses Resolved"),
      desc: t("medical_landing.stats.analyses_desc", "Laboratory results and scans analyzed and diagnosed by AI."),
      icon: (
        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-teal-400 to-emerald-500",
      accent: "border-teal-500/20 text-teal-400 bg-teal-950/20 shadow-teal-500/5 hover:shadow-teal-500/10 hover:border-teal-500/40"
    },
    {
      value: statsData.emergencies_count,
      suffix: "+",
      label: t("medical_landing.stats.emergencies", "Emergencies Dispatched"),
      desc: t("medical_landing.stats.emergencies_desc", "Critical emergency alarms navigated to nearest trauma units."),
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: "from-red-400 to-pink-500",
      accent: "border-red-500/20 text-red-400 bg-red-950/20 shadow-red-500/5 hover:shadow-red-500/10 hover:border-red-500/40"
    },
    {
      value: statsData.hospitals_count,
      suffix: "+",
      label: t("medical_landing.stats.hospitals", "Connected Hospitals"),
      desc: t("medical_landing.stats.hospitals_desc", "Advanced healthcare facilities and hospitals synced in our loop."),
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-indigo-400 to-purple-500",
      accent: "border-indigo-500/20 text-indigo-400 bg-indigo-950/20 shadow-indigo-500/5 hover:shadow-indigo-500/10 hover:border-indigo-500/40"
    },
    {
      value: statsData.response_time,
      suffix: "",
      label: t("medical_landing.stats.response_time", "Response Speed"),
      desc: t("medical_landing.stats.response_time_desc", "Unmatched dispatch latency for critical trauma rescue."),
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-amber-400 to-orange-500",
      accent: "border-amber-500/20 text-amber-400 bg-amber-950/20 shadow-amber-500/5 hover:shadow-amber-500/10 hover:border-amber-500/40"
    },
    {
      value: statsData.ai_accuracy,
      suffix: "",
      label: t("medical_landing.stats.ai_accuracy", "AI Diagnostic Accuracy"),
      desc: t("medical_landing.stats.ai_accuracy_desc", "Clinical-grade analytical precision validated by medical boards."),
      icon: (
        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-violet-400 to-fuchsia-500",
      accent: "border-violet-500/20 text-violet-400 bg-violet-950/20 shadow-violet-500/5 hover:shadow-violet-500/10 hover:border-violet-500/40"
    }
  ] : [];

  return (
    <div className="relative min-h-screen text-gray-100 bg-[#090e1a] font-outfit overflow-x-hidden w-full selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Dynamic ECG glowing grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#0e172a_1px,transparent_1px),linear-gradient(to_bottom,#0e172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_75%,transparent_100%)] pointer-events-none" />

      {/* Floating blurred neon medical glows constrained inside a relative wrapper to prevent horizontal scroll overflow */}
      <div className="absolute inset-0 z-0 overflow-hidden max-w-full pointer-events-none">
        <div className="absolute top-[-5%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[130px] animate-pulse duration-[8s]" />
        <div className="absolute top-[25%] end-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute bottom-[20%] start-[10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/5 blur-[120px]" />
      </div>

      {/* Sticky Premium Transparent Glass Navbar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#090e1a]/85 border-b border-white/[0.06] backdrop-blur-xl py-3.5 shadow-lg shadow-cyan-950/20"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Real Logo brand integration (/images/logo/logo.png) */}
            <div className="flex items-center gap-2">
              <Link to="/admin" className="flex items-center gap-2 group">
                <img
                  src="/images/logo/logo.png"
                  alt="Salamty Brand Logo"
                  className="h-9 w-auto hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300"
                />
              </Link>
            </div>

            {/* Anchors links */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#hero" className="text-sm font-semibold text-gray-400 transition-colors hover:text-cyan-400">
                {t("medical_landing.navbar.home", "الرئيسية")}
              </a>
              <a href="#features" className="text-sm font-semibold text-gray-400 transition-colors hover:text-cyan-400">
                {t("medical_landing.navbar.features", "المميزات")}
              </a>
              <a href="#preview" className="text-sm font-semibold text-gray-400 transition-colors hover:text-cyan-400">
                {t("medical_landing.navbar.analysis", "التحليلات")}
              </a>
              <a href="#emergency" className="text-sm font-semibold text-gray-400 transition-colors hover:text-cyan-400">
                {t("medical_landing.navbar.emergency", "الطوارئ")}
              </a>
            </div>

            {/* Switchers, login & ghost outline Admin Access button */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                {t("landing.navbar.login", "Login")}
              </Link>
              <Link
                to="/admin"
                className="rounded-xl border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-white bg-white/[0.02] px-4.5 py-2 text-xs font-bold transition-all shadow-inner active:scale-95"
              >
                {t("medical_landing.navbar.admin_panel", "Admin Panel")}
              </Link>
            </div>

            {/* Mobile buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors focus:outline-hidden"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu anchors */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/[0.05] bg-[#090e1a]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {t("medical_landing.navbar.home", "الرئيسية")}
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {t("medical_landing.navbar.features", "المميزات")}
                </a>
                <a
                  href="#preview"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {t("medical_landing.navbar.analysis", "التحليلات")}
                </a>
                <a
                  href="#emergency"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {t("medical_landing.navbar.emergency", "الطوارئ")}
                </a>
                <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-base font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {t("landing.navbar.login", "Login")}
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 rounded-xl border border-white/10 text-white font-bold"
                  >
                    {t("medical_landing.navbar.admin_panel", "Admin Panel")}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section promoting the Medical Mobile Application with real screen.jpeg screenshot */}
      <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-36 z-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero text panel (left side in LTR, aligns correctly based on grid flow) */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-start flex flex-col items-center lg:items-start">
            {/* Medical AI badge tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-4 py-1.5 text-xs font-semibold text-cyan-400 shadow-md shadow-cyan-500/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {t("medical_landing.hero.badge", "تطبيق الهاتف الذكي للذكاء الاصطناعي الطبي")}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
            >
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
                {t("medical_landing.hero.heading", "صحتك في أيدٍ ذكية")}
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 pb-2">
                {t("medical_landing.brand", "سلامتي")}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed"
            >
              {t("medical_landing.hero.subheading", "اختبر تطبيق سلامتي للهاتف المحمول، المساعد الذكي الذي يقدم لك تحليلاً فوريًا للأشعات، وإرشادات الطوارئ العاجلة، ومساعدًا طبيًا موثوقًا في جيبك.")}
            </motion.p>

            {/* App Store / Google Play download buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
            >
              {/* App Store button */}
              <a
                href="#download"
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-white text-gray-950 font-bold px-6 py-3.5 shadow-xl hover:scale-102 active:scale-98 transition-all tracking-wide"
              >
                <svg className="w-5 h-5 text-gray-950 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.99 1.12.09 2.27-.56 2.98-1.43z" />
                </svg>
                <div className="text-start">
                  <span className="block text-[10px] text-gray-500 font-medium uppercase leading-none">Download on the</span>
                  <span className="block text-sm leading-none font-bold mt-1">App Store</span>
                </div>
              </a>

              {/* Google Play button */}
              <a
                href="#download"
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-bold px-6 py-3.5 shadow-xl hover:scale-102 active:scale-98 transition-all tracking-wide"
              >
                <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.14v17.72c0 .48.28.91.72 1.09l10.23-10.23L5.72 2.05C5.28 2.23 5 2.66 5 3.14M16.67 12.2l3.41-3.41c.42-.42.42-1.1 0-1.52L5.86 1.34 16.67 12.2m4.18.73c.42-.42.42-1.1 0-1.52l-3.41-3.41L5.86 22.66l14.99-8.73z" />
                </svg>
                <div className="text-start">
                  <span className="block text-[10px] text-gray-400 font-medium uppercase leading-none">Get it on</span>
                  <span className="block text-sm leading-none font-bold mt-1">Google Play</span>
                </div>
              </a>
            </motion.div>

            {/* Small floating trust indicators */}
            <div className="flex items-center gap-3 pt-6 text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                </svg>
                HIPAA Compliant
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                </svg>
                Validated Clinical Accuracy
              </span>
            </div>
          </div>

          {/* Hero Mobile Phone Showcase Mockup (right side in LTR) */}
          <div className="lg:col-span-6 relative flex items-center justify-center px-6">
            
            {/* Soft decorative neon glow behind phone */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full z-0 pointer-events-none" />

            {/* Smartphone device container mockup frame with Framer Motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-72 h-[585px] rounded-[44px] border-[11px] border-[#0e1726] bg-[#0e1726] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              {/* Smartphone top camera notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 rounded-full bg-[#0e1726] z-30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 mr-1" />
                <span className="w-2.5 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Realistic Mobile app screen screenshot.jpeg */}
              <div className="absolute inset-0 bg-gray-950 overflow-hidden">
                <img
                  src="/screen.jpeg"
                  alt="Salamty AI Mobile App Screen"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Four Floating glassmorphic diagnostics cards surrounding phone mockup */}
            {/* Widget 1: AI Scan Analyzer */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute z-20 top-12 -start-6 rounded-2xl border border-cyan-500/25 bg-[#090e1a]/85 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 w-44 hover:border-cyan-400 transition-colors pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2M5 9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div className="text-start">
                <span className="block text-[9px] text-cyan-400 font-bold uppercase leading-none">Camera Scan</span>
                <span className="block text-xs font-bold text-white mt-1.5 leading-none">Lung Scan Clear</span>
              </div>
            </motion.div>

            {/* Widget 2: Active Heartbeat Pulse */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.5 }}
              className="absolute z-20 bottom-16 -end-6 rounded-2xl border border-teal-500/25 bg-[#090e1a]/85 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 w-44 hover:border-teal-400 transition-colors pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                <svg className="w-5 h-5 text-teal-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-start">
                <span className="block text-[9px] text-teal-400 font-bold uppercase leading-none">ECG Pulse Monitor</span>
                <span className="block text-xs font-bold text-white mt-1.5 leading-none">72 BPM · Stable</span>
              </div>
            </motion.div>

            {/* Widget 3: Emergency Alert */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute z-20 bottom-24 -start-8 rounded-2xl border border-red-500/25 bg-[#090e1a]/85 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 w-48 hover:border-red-400 transition-colors pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <svg className="w-5 h-5 text-red-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-start">
                <span className="block text-[9px] text-red-400 font-bold uppercase leading-none">Trauma Alert</span>
                <span className="block text-xs font-bold text-white mt-1.5 leading-none">Geo Broadcaster OK</span>
              </div>
            </motion.div>

            {/* Widget 4: Hospital Locator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 1.5 }}
              className="absolute z-20 top-28 -end-8 rounded-2xl border border-sky-500/25 bg-[#090e1a]/85 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 w-48 hover:border-sky-400 transition-colors pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="text-start">
                <span className="block text-[9px] text-sky-400 font-bold uppercase leading-none">Care Mapper</span>
                <span className="block text-xs font-bold text-white mt-1.5 leading-none">Nearest Unit: 1.2km</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Holographic Showcase Section */}
      <section id="preview" className="relative pb-24 z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl mx-auto relative rounded-3xl border border-white/[0.06] bg-[#090e1a]/40 p-2.5 md:p-3.5 backdrop-blur-md shadow-2xl shadow-cyan-500/5 group"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 opacity-40 group-hover:opacity-100 duration-500 transition-opacity pointer-events-none z-0" />

          {/* Glowing pulse rings */}
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full border border-blue-500/30 animate-ping opacity-25" />

          {/* Cardiac heartbeat line overlay using SVG */}
          <div className="absolute bottom-6 inset-x-6 h-10 pointer-events-none z-20 opacity-30">
            <svg className="w-full h-full text-cyan-400 stroke-current fill-none" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path
                d="M 0 5 L 10 5 L 12 5 L 14 2 L 16 8 L 18 5 L 20 5 L 40 5 L 42 5 L 44 0 L 46 10 L 48 5 L 50 5 L 90 5 L 92 5 L 94 3 L 96 7 L 98 5 L 100 5"
                strokeWidth="0.2"
                strokeLinecap="round"
                className="animate-[dash_3s_linear_infinite]"
                style={{ strokeDasharray: "100", strokeDashoffset: "100" }}
              />
            </svg>
          </div>

          {/* Custom generated 3D Medical Hologram showcase mockup */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-inner z-10">
            <img
              src="/images/medical_preview.png"
              alt="Holographic Health Preview"
              className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.012] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* 8 Premium Mobile Features Section */}
      <section id="features" className="relative py-20 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t("medical_landing.features.title", "أدوات طبية ذكية في جيبك")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-400">
              {t("medical_landing.features.desc", "عزز تحليلاتك الطبية وقراراتك الصحية مباشرة عبر هاتفك الذكي باستخدام وحدات الذكاء الاصطناعي المستقلة والفاخرة.")}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-md group ${feature.glow}`}
              >
                <div className="space-y-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner group-hover:scale-110 duration-300 transition-transform ${feature.accent}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Alert Mobile Section */}
      <section id="emergency" className="relative py-24 z-10 px-4 border-t border-white/[0.03] bg-radial from-red-950/5 via-transparent to-transparent">
        <div className="max-w-5xl mx-auto rounded-3xl border border-red-500/20 bg-red-950/5 p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-red-950/10">
          <div className="absolute top-0 end-0 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-4 py-1 text-xs font-semibold text-red-400 shadow-sm shadow-red-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {t("medical_landing.emergency.badge", "بروتوكول الطوارئ النشط")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t("medical_landing.emergency.title", "مركز الطوارئ المحمول الحرج")}
              </h2>
              <p className="text-base text-gray-400 leading-relaxed">
                {t("medical_landing.emergency.desc", "مساعدة طبية فورية عندما تكون كل ثانية حاسمة. ابث تنبيه موقعك، اتبع دليل الإسعافات، أو اتصل فوراً بلمسة زر.")}
              </p>
            </div>

            {/* Emergency Hotline actions */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              {/* Hotline dial */}
              <div className="rounded-2xl border border-red-500/10 bg-[#090e1a] p-5 shadow-lg flex-1 sm:w-48 group hover:border-red-500/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-105 duration-300 transition-transform">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {t("medical_landing.emergency.hotline_title", "اتصل الآن بالطوارئ")}
                </h4>
                <p className="text-xs text-gray-500">
                  {t("medical_landing.emergency.hotline_sub", "اتصال مجاني ومباشر على مدار الساعة")}
                </p>
              </div>

              {/* AI helper */}
              <div className="rounded-2xl border border-white/[0.05] bg-[#090e1a] p-5 shadow-lg flex-1 sm:w-48 group hover:border-cyan-500/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 duration-300 transition-transform">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {t("medical_landing.emergency.ai_assistant_title", "مساعد الطوارئ الذكي")}
                </h4>
                <p className="text-xs text-gray-500">
                  {t("medical_landing.emergency.ai_assistant_sub", "تصنيف فوري للحالة الطارئة")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="relative py-24 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            >
              {t("medical_landing.stats.section_title", "مؤشرات أداء الرعاية الرقمية الفورية")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto text-base text-gray-400"
            >
              {t("medical_landing.stats.section_desc", "نبث مباشرة مقاييس الذكاء الاصطناعي الطبي والنشاط التشغيلي لمنصتنا تأكيداً لالتزامنا بالسرعة والشفافية.")}
            </motion.p>
          </div>

          {loading ? (
            // High-fidelity Glassmorphic pulse Skeleton card grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-[#090e1a]/40 p-6 backdrop-blur-sm animate-pulse flex flex-col justify-between min-h-[180px] shadow-lg shadow-cyan-950/5"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
                      <div className="w-20 h-5 bg-white/[0.04] rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-1/2 h-8 bg-white/[0.06] rounded-md" />
                      <div className="w-3/4 h-4 bg-white/[0.03] rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Elegant Medical console connection-offline error card with retry button
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto rounded-2xl border border-red-500/20 bg-red-950/5 p-8 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-red-950/10 text-center space-y-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] pointer-events-none rounded-full" />
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-400 animate-pulse">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {t("medical_landing.stats.error_title", "فشل اتصال القياس الطبي (Telemetry Offline)")}
                </h3>
                <p className="text-sm text-gray-400 font-mono leading-relaxed">
                  CODE: 503_TELEMETRY_LINK_DROP <br />
                  {error}
                </p>
              </div>
              <button
                onClick={fetchStats}
                className="px-6 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 duration-200 transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                </svg>
                {t("medical_landing.stats.retry_button", "إعادة محاولة الربط (Retry Handshake)")}
              </button>
            </motion.div>
          ) : (
            // Premium glassmorphism 6 statistics grid with hover actions & glowing micro-animations
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {statsCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-[#090e1a]/60 p-6 backdrop-blur-md flex flex-col justify-between min-h-[190px] shadow-lg group hover:bg-[#0c1426]/75 transition-all duration-300 border-white/[0.06] hover:border-white/[0.12] pointer-events-auto"
                >
                  {/* Glowing background spotlight follow gradient */}
                  <div className="absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 duration-500 transition-opacity pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      {/* Curated medical icon wrapper */}
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner group-hover:scale-110 duration-300 transition-transform ${stat.accent}`}>
                        {stat.icon}
                      </div>

                      {/* Accent glow orb */}
                      <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping opacity-40 group-hover:opacity-80" />
                    </div>

                    <div className="space-y-1 text-start">
                      <h4 className={`text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} tracking-tight`}>
                        <AnimatedCounter value={stat.value} />
                        {stat.suffix}
                      </h4>
                      <h5 className="text-sm font-bold text-white tracking-wide mt-1 group-hover:text-cyan-400 duration-200 transition-colors">
                        {stat.label}
                      </h5>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Clinical Testimonials Section */}
      <section className="relative py-20 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("medical_landing.testimonials.title", "معتمد من رواد التكنولوجيا الطبية")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-400">
              {t("medical_landing.testimonials.desc", "تجارب الأطباء والمرضى في تحسين متجهاتهم الصحية وسلامتهم عبر تطبيق سلامتي للهاتف المحمول.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Doctor Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/[0.04] bg-[#090e1a]/60 p-8 backdrop-blur-sm relative group hover:border-cyan-500/25 duration-300 transition-all"
            >
              <div className="space-y-4">
                <p className="text-gray-300 italic text-base">
                  "{t("medical_landing.testimonials.dr_quote", "تطبيق سلامتي للهاتف هو رفيق سريري استثنائي. يتيح للمرضى فحص أعراضهم ومشاركة تقارير PDF الطبية معنا بدقة تامة.")}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold">
                    D
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {t("medical_landing.testimonials.dr_name", "د. سارة الفيصل")}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t("medical_landing.testimonials.dr_title", "رئيسة قسم الذكاء الاصطناعي السريري")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Patient Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/[0.04] bg-[#090e1a]/60 p-8 backdrop-blur-sm relative group hover:border-teal-500/25 duration-300 transition-all"
            >
              <div className="space-y-4">
                <p className="text-gray-300 italic text-base">
                  "{t("medical_landing.testimonials.patient_quote", "يمنحني وجود محلل الأشعة ومحدد الطوارئ الجغرافي على هاتفي راحة بال مطلقة أثناء التنقل والسفر.")}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-950 flex items-center justify-center border border-teal-500/20 text-teal-400 font-bold">
                    P
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {t("medical_landing.testimonials.patient_name", "ريان الحربي")}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t("medical_landing.testimonials.patient_title", "مستخدم تطبيق الهاتف")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section id="feedback" className="relative py-24 z-10 px-4 border-t border-white/[0.03]">
        <div className="absolute inset-0 bg-radial from-cyan-900/10 via-transparent to-transparent pointer-events-none z-0" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("medical_landing.feedback.title", "شاركنا رأيك وتجربتك")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-400">
              {t("medical_landing.feedback.desc", "نحن نهتم بمعرفة تجربتك مع منصة سلامتي. رأيك يساعدنا في تحسين نماذجنا الطبية وتطوير خدماتنا بشكل مستمر.")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/[0.06] bg-[#090e1a]/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-cyan-500/20 duration-300 transition-colors"
          >
            {/* Subtle glow behind the form */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
            
            <div className="relative z-10 space-y-6" id="feedback-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 text-start">
                  <label className="text-sm font-semibold text-gray-300">
                    {t("medical_landing.feedback.name_label", "الاسم (اختياري)")}
                  </label>
                  <input
                    type="text"
                    id="feedback-name"
                    name="name"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder={t("medical_landing.feedback.name_placeholder", "اكتب اسمك هنا")}
                    className="w-full h-12 rounded-xl bg-slate-950/50 border border-white/[0.08] px-4 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-hidden transition-colors"
                  />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-sm font-semibold text-gray-300">
                    {t("medical_landing.feedback.subject_label", "نوع الرسالة")}
                  </label>
                  <select
                    id="feedback-subject"
                    name="subject"
                    value={feedbackSubject}
                    onChange={(e) => setFeedbackSubject(e.target.value)}
                    className="w-full h-12 rounded-xl bg-slate-950/50 border border-white/[0.08] px-4 text-white focus:border-cyan-500/50 focus:outline-hidden transition-colors appearance-none cursor-pointer"
                  >
                    <option value="General Experience" className="bg-[#090e1a]">{t("medical_landing.feedback.subj_1", "تجربة الاستخدام العامة")}</option>
                    <option value="Medical AI Accuracy" className="bg-[#090e1a]">{t("medical_landing.feedback.subj_2", "دقة التحليل الطبي")}</option>
                    <option value="Feature Suggestion" className="bg-[#090e1a]">{t("medical_landing.feedback.subj_3", "اقتراح ميزة جديدة")}</option>
                    <option value="Issue/Bug" className="bg-[#090e1a]">{t("medical_landing.feedback.subj_4", "الإبلاغ عن مشكلة")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 text-start">
                <label className="text-sm font-semibold text-gray-300">
                  {t("medical_landing.feedback.msg_label", "رسالتك")}
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={4}
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder={t("medical_landing.feedback.msg_placeholder", "شاركنا تفاصيل تجربتك، اقتراحاتك، أو أي ملاحظات ترغب في إضافتها...")}
                  className="w-full rounded-xl bg-slate-950/50 border border-white/[0.08] p-4 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-hidden transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col items-start gap-3">
                <a
                  href={feedbackMsg.trim() ? `mailto:besadanabil86@gmail.com?subject=${encodeURIComponent("Salamty Feedback: " + feedbackSubject)}&body=${encodeURIComponent(feedbackName ? `الاسم: ${feedbackName}\n\n${feedbackMsg}` : feedbackMsg)}` : "#"}
                  onClick={(e) => {
                    if (!feedbackMsg.trim()) {
                      e.preventDefault();
                      alert(t("medical_landing.feedback.alert_empty", "يرجى كتابة رسالتك قبل الإرسال."));
                    } else {
                      // copy to clipboard fallback
                      navigator.clipboard.writeText("besadanabil86@gmail.com").catch(() => {});
                      
                      alert(t("medical_landing.feedback.alert_copied", "تم نسخ الإيميل بنجاح (besadanabil86@gmail.com)!\n\nيبدو أن جهاز الكمبيوتر الخاص بك لا يحتوي على تطبيق بريد إلكتروني مثبت للفتح التلقائي، لذلك قمنا بنسخ الإيميل لتتمكن من مراسلتنا يدوياً."));
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-3.5 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t("medical_landing.feedback.submit", "إرسال التقييم عبر البريد")}
                </a>
                <p className="text-xs text-gray-500 max-w-sm">
                  {t("medical_landing.feedback.note", "ملاحظة: سيقوم هذا الزر بفتح تطبيق البريد الإلكتروني (مثل Gmail أو Outlook) المربوط بجهازك. إذا لم يفتح، يرجى مراسلتنا مباشرة على besadanabil86@gmail.com")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gradient Medical App Download CTA Section */}
      <section id="download" className="relative py-24 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto relative rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-500/5">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950/40 opacity-90 z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-cyan-500/10 to-teal-500/10 blur-[80px] z-0" />

          <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center space-y-8 z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t("medical_landing.cta.title", "حمل مستقبل الرعاية الصحية اليوم")}
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
              {t("medical_landing.cta.desc", "احصل على تحليلات دقيقة للأشعات، مساعد سريري ذكي في جيبك، وخرائط طوارئ مباشرة مدعومة بنماذجنا الطبية الفاخرة.")}
            </p>

            {/* CTA App download buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              {/* App store */}
              <a
                href="#"
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-white text-gray-950 font-bold px-6 py-3.5 shadow-xl hover:scale-105 active:scale-95 duration-200 transition-all tracking-wide"
              >
                <svg className="w-5 h-5 text-gray-950 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.99 1.12.09 2.27-.56 2.98-1.43z" />
                </svg>
                <span className="block text-sm font-extrabold">{t("medical_landing.cta.button", "App Store")}</span>
              </a>

              {/* Google Play */}
              <a
                href="#"
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-bold px-6 py-3.5 shadow-xl hover:scale-105 active:scale-95 duration-200 transition-all tracking-wide"
              >
                <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.14v17.72c0 .48.28.91.72 1.09l10.23-10.23L5.72 2.05C5.28 2.23 5 2.66 5 3.14M16.67 12.2l3.41-3.41c.42-.42.42-1.1 0-1.52L5.86 1.34 16.67 12.2m4.18.73c.42-.42.42-1.1 0-1.52l-3.41-3.41L5.86 22.66l14.99-8.73z" />
                </svg>
                <span className="block text-sm font-extrabold">{t("medical_landing.cta.contact", "Google Play")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section integrating Existing PNG Logo */}
      <footer className="relative py-12 z-10 border-t border-white/[0.03] bg-[#050810] text-gray-500 text-sm px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo brand footer alignment */}
          <div className="flex items-center gap-2">
            <img
              src="/images/logo/logo.png"
              alt="Salamty Brand Logo"
              className="h-7 w-auto"
            />
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              {t("medical_landing.footer.terms", "البنود والشروط")}
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              {t("medical_landing.footer.privacy", "سياسة الخصوصية")}
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              {t("medical_landing.footer.service", "اتفاقية الخدمة")}
            </a>
          </div>

          <div className="text-center md:text-end text-xs">
            &copy; {new Date().getFullYear()} {t("medical_landing.brand", "سلامتي")}. {t("medical_landing.footer.rights", "كل الحقوق محفوظة.")}
          </div>
        </div>
      </footer>
    </div>
  );
}
