import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";

export const GuestRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Futuristic loading ECG spinner screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090e1a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px]" />

        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
            <span className="absolute inset-2 bg-cyan-950/40 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">Salamati Healthcare</h3>
            <p className="text-xs text-gray-500 mt-1.5">Checking active credentials session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to Dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Render guest forms (like SignIn, SignUp)
  return <Outlet />;
};

export default GuestRoute;
