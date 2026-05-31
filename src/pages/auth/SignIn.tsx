import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/auth/useAuth";
import PageMeta from "../../components/common/PageMeta";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic Validation
    if (!email.trim() || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      
      // Save remember me configuration mock
      if (rememberMe) {
        localStorage.setItem("salamati_remember", email);
      } else {
        localStorage.removeItem("salamati_remember");
      }

      setSuccessMsg("Access authorized. Restoring secure session...");
      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (err: any) {
      console.error("Auth Failure:", err);
      // Map Supabase error codes to client-friendly alerts
      if (err.message?.includes("Invalid login credentials")) {
        setErrorMsg("Invalid credentials. Please double-check your email or password.");
      } else if (err.message?.includes("network")) {
        setErrorMsg("Network error. Please check your internet connection.");
      } else {
        setErrorMsg(err.message || "Failed to authenticate. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Secure Sign In - سلامتي (Salamati) AI Healthcare"
        description="Access the secure clinical dashboard and AI medical suite."
      />
      <div className="relative min-h-screen bg-[#050811] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-outfit">
        
        {/* Glowing futuristic grid and pulse orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e172a_1px,transparent_1px),linear-gradient(to_bottom,#0e172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
        <div className="absolute top-1/4 start-1/4 w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 end-1/4 w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#090e1a]/40 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-cyan-950/10"
        >
          {/* Logo brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="inline-block group mb-3">
              <img
                src="/images/logo/logo.png"
                alt="Salamati Logo"
                className="h-10 w-auto hover:scale-105 transition-transform duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              />
            </Link>
            <h2 className="text-xl font-black text-white tracking-tight">
              Secure Clinical Hub
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Enter your credential vectors to access dashboard tools
            </p>
          </div>

          {/* Alert banners */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 mb-5 rounded-xl border border-red-500/25 bg-red-950/20 text-xs font-semibold text-red-400 flex items-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 mb-5 rounded-xl border border-emerald-500/25 bg-emerald-950/20 text-xs font-semibold text-emerald-400 flex items-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                </svg>
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                placeholder="doctor@salamati.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-600 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Secure Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset trigger requires Supabase email configuration. Enter credentials directly.")}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-600 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={isSubmitting}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-sm border-white/[0.08] bg-[#090e1a]/40 text-cyan-500 focus:ring-cyan-500/20"
              />
              <label htmlFor="remember" className="ms-2 text-xs text-gray-400 font-semibold cursor-pointer select-none">
                Remember my terminal credentials
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/10 hover:scale-[1.01] hover:shadow-cyan-500/20 duration-200 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Authorize Connection"
              )}
            </button>
          </form>

          {/* Footer redirection */}
          <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
            <p className="text-xs text-gray-500">
              New medical specialist or user?{" "}
              <Link to="/signup" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Initialize Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
