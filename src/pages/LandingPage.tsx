import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/header/LanguageSwitcher";

export default function LandingPage() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle sticky navbar scroll transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Features list configuration
  const features = [
    {
      title: t("landing.features.f1_title", "Generative Insights"),
      desc: t("landing.features.f1_desc", "Automatically synthesize daily logs into elegant qualitative performance actions."),
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      glow: "shadow-cyan-500/10",
    },
    {
      title: t("landing.features.f2_title", "Predictive Scaling"),
      desc: t("landing.features.f2_desc", "Forecast customer vectors up to three quarters in advance with 98% validated accuracy."),
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      glow: "shadow-purple-500/10",
    },
    {
      title: t("landing.features.f3_title", "Glassmorphism UI"),
      desc: t("landing.features.f3_desc", "A visual design system optimized for modern dark grids and harmony."),
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      glow: "shadow-pink-500/10",
    },
    {
      title: t("landing.features.f4_title", "Quantum Tables"),
      desc: t("landing.features.f4_desc", "Organize large-scale dataset rows with dynamic client-side filtering."),
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      glow: "shadow-emerald-500/10",
    },
  ];

  // Stats list configuration
  const stats = [
    { value: "5,000+", label: t("landing.stats.s1_label", "Active SaaS Installs") },
    { value: "1.2B+", label: t("landing.stats.s2_label", "AI Vectors Computed Daily") },
    { value: "99.99%", label: t("landing.stats.s3_label", "System Uptime Guaranteed") },
  ];

  return (
    <div className="min-h-screen text-gray-100 bg-[#07090e] font-outfit overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Animated futuristic background mesh and grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating blurred neon spheres */}
      <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] start-[20%] w-[45vw] h-[45vw] rounded-full bg-pink-500/5 blur-[130px] pointer-events-none z-0" />

      {/* Sticky Premium Navbar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#07090e]/75 border-b border-white/[0.06] backdrop-blur-xl py-3.5 shadow-lg"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {t("landing.navbar.logo_title", "AI SaaS")}
              </span>
            </div>

            {/* Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {t("landing.navbar.features", "Features")}
              </a>
              <a href="#preview" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {t("landing.navbar.preview", "Preview")}
              </a>
              <a href="#stats" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {t("landing.navbar.stats", "Statistics")}
              </a>
            </div>

            {/* Action buttons & Switchers */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t("landing.navbar.login", "Login")}
              </Link>
              <Link
                to="/admin"
                className="relative group overflow-hidden rounded-xl bg-white text-gray-950 px-5 py-2.5 text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-cyan-400 to-purple-500 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {t("landing.hero.cta_primary", "Enter Dashboard")}
                </span>
              </Link>
            </div>

            {/* Mobile menu trigger */}
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

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/[0.05] bg-[#07090e]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {t("landing.navbar.features", "Features")}
                </a>
                <a
                  href="#preview"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {t("landing.navbar.preview", "Preview")}
                </a>
                <a
                  href="#stats"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {t("landing.navbar.stats", "Statistics")}
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
                    className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/10"
                  >
                    {t("landing.hero.cta_primary", "Enter Dashboard")}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 flex flex-col items-center justify-center z-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-4 py-1.5 text-xs font-semibold text-cyan-400 shadow-md shadow-cyan-500/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t("landing.hero.badge", "Next-Gen AI Platform")}
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              {t("landing.hero.title_g1", "Transform Analytics")}
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 pb-2">
              {t("landing.hero.title_g2", "With Advanced AI")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed"
          >
            {t("landing.hero.subtitle", "Unlock deep user patterns, forecast financial vectors, and scale dashboard metrics using real-time generative models in a premium futuristic hub.")}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/admin"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold px-8 py-4 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-center tracking-wide"
            >
              {t("landing.hero.cta_primary", "Enter Dashboard")}
            </Link>
            <a
              href="#preview"
              className="w-full sm:w-auto rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium px-8 py-4 border border-white/[0.08] active:scale-[0.98] transition-all text-center"
            >
              {t("landing.hero.cta_secondary", "Watch Demo")}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Showcase Mockup Preview Section */}
      <section id="preview" className="relative pb-24 z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl mx-auto relative rounded-3xl border border-white/[0.06] bg-[#07090e]/40 p-2.5 md:p-3.5 backdrop-blur-md shadow-2xl shadow-cyan-500/5 group"
        >
          {/* Internal neon shadow bounds */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 opacity-30 group-hover:opacity-100 duration-500 transition-opacity pointer-events-none z-0" />

          {/* Visual container */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-inner z-10">
            <img
              src="/images/landing_preview.png"
              alt="Futuristic AI Analytics Showcase"
              className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.015] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative py-20 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("landing.features.title", "Built for Futuristic Tech Teams")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-400">
              {t("landing.features.desc", "Leverage quantum-level models to simplify metrics, forecast scales, and maximize operational flows.")}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.01] p-6 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 shadow-md group ${feature.glow}`}
              >
                {/* Visual card content */}
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-inner group-hover:scale-110 duration-300 transition-transform">
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

      {/* Statistics Section */}
      <section id="stats" className="relative py-24 z-10 px-4 border-t border-white/[0.03] bg-radial from-cyan-950/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("landing.stats.title", "Trusted by Hyper-Growth Startups")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-gray-400">
              {t("landing.stats.desc", "Real results backing our high-fidelity analytics ecosystem.")}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative rounded-2xl border border-white/[0.04] bg-[#07090e]/60 p-8 text-center backdrop-blur-sm group hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="space-y-2">
                  <h4 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:scale-105 duration-300 transition-transform">
                    {stat.value}
                  </h4>
                  <p className="text-sm font-semibold tracking-wide uppercase text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Gradient CTA Section */}
      <section className="relative py-24 z-10 px-4 border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto relative rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-500/5">
          {/* Radial Mesh */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-950/40 opacity-90 z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-[80px] z-0" />

          {/* Marketing contents */}
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center space-y-8 z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t("landing.cta.title", "Ready to Ascend into the Future of AI?")}
            </h2>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
              {t("landing.cta.desc", "Join over 5,000+ engineers building high-end scalable products today.")}
            </p>
            <div className="pt-4">
              <Link
                to="/admin"
                className="inline-flex rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-semibold px-8 py-4 shadow-xl hover:scale-105 active:scale-95 duration-200 transition-all text-center tracking-wide"
              >
                {t("landing.cta.button", "Get Started Instantly")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative py-12 z-10 border-t border-white/[0.03] bg-[#030508] text-gray-500 text-sm px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-400">
              {t("landing.navbar.logo_title", "AI SaaS")}
            </span>
          </div>

          {/* Social icons/Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Security
            </a>
          </div>

          <div className="text-center md:text-end text-xs">
            &copy; {new Date().getFullYear()} {t("landing.navbar.logo_title", "AI SaaS")}. All vectors reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
