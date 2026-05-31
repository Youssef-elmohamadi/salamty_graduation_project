import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/auth/useAuth";
import PageMeta from "../../components/common/PageMeta";

export default function SignUp() {
  // Core Profile inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Future-ready Medical inputs
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form Validations
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required profile fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (!isChecked) {
      setErrorMsg("You must accept the terms and clinical privacy guidelines.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const fullName = `${firstName} ${lastName}`.trim();
      const metadata = {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        phone,
        blood_type: bloodType || undefined,
        allergies: allergies || undefined,
        chronic_diseases: chronicDiseases || undefined,
      };

      await signUp(email, password, metadata);

      setSuccessMsg("Registration authorized. Creating clinical profiles...");
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err: any) {
      console.error("Register Error:", err);
      if (err.message?.includes("already registered")) {
        setErrorMsg("This email is already registered. Please log in instead.");
      } else {
        setErrorMsg(err.message || "Failed to initialize credentials. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Initialize Account - سلامتي (Salamati) AI Healthcare"
        description="Register a new digital health profile and configure medical vectors."
      />
      <div className="relative min-h-screen bg-[#050811] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none font-outfit">
        
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e172a_1px,transparent_1px),linear-gradient(to_bottom,#0e172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
        <div className="absolute top-1/4 end-1/4 w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 start-1/4 w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/[0.08] bg-[#090e1a]/45 p-8 sm:p-10 my-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/15"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="inline-block group mb-3">
              <img
                src="/images/logo/logo.png"
                alt="Salamati Logo"
                className="h-10 w-auto hover:scale-105 transition-transform duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              />
            </Link>
            <h2 className="text-xl font-black text-white tracking-tight">
              Create Smart Health Profile
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Initialize your secure medical logs and AI telemetry
            </p>
          </div>

          {/* Messages */}
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

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Section 1: Core credentials */}
            <div>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/[0.05] pb-2 mb-4">
                1. Core Profile Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-650 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-655 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="info@salamati.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-650 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={isSubmitting}
                    placeholder="+966 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-650 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isSubmitting}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-655 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-3 flex items-center text-gray-500 hover:text-gray-300 bg-transparent border-none"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    disabled={isSubmitting}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-655 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Optional medical details */}
            <div>
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/[0.05] pb-2 mb-4">
                2. Medical Registry Details (Optional)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Blood Type
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full h-11 rounded-xl px-3 text-sm bg-slate-950/30 text-white border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  >
                    <option value="" className="bg-[#090e1a]">Select Type</option>
                    <option value="A+" className="bg-[#090e1a]">A+</option>
                    <option value="A-" className="bg-[#090e1a]">A-</option>
                    <option value="B+" className="bg-[#090e1a]">B+</option>
                    <option value="B-" className="bg-[#090e1a]">B-</option>
                    <option value="AB+" className="bg-[#090e1a]">AB+</option>
                    <option value="AB-" className="bg-[#090e1a]">AB-</option>
                    <option value="O+" className="bg-[#090e1a]">O+</option>
                    <option value="O-" className="bg-[#090e1a]">O-</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Penicillin, Nuts (Separated by commas)"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-650 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Chronic Diseases
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Hypertension, Type 2 Diabetes"
                    value={chronicDiseases}
                    onChange={(e) => setChronicDiseases(e.target.value)}
                    className="w-full h-11 rounded-xl px-4 text-sm bg-slate-950/30 text-white placeholder:text-gray-650 border border-white/[0.06] focus:border-cyan-500/50 focus:outline-hidden transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                required
                disabled={isSubmitting}
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded-sm border-white/[0.08] bg-[#090e1a]/40 text-cyan-500 focus:ring-cyan-500/20"
              />
              <label htmlFor="agree" className="ms-2 text-xs text-gray-400 select-none leading-normal">
                By creating an account, I authorize Salamati to compile digital health records matching HIPAA security guidelines.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/10 hover:scale-[1.005] hover:shadow-cyan-500/20 duration-200 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Initializing medical files...
                </>
              ) : (
                "Initialize Digital Medical Profile"
              )}
            </button>
          </form>

          {/* Footer redirection */}
          <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
            <p className="text-xs text-gray-500">
              Already have an authorized medical profile?{" "}
              <Link to="/signin" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Authorize Session
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
