import { useAuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { UserRole } from "../types/database.types";

export const useAuth = () => {
  const context = useAuthContext();

  const handleSignUp = async (email: string, password: string, fullName: string, role: UserRole = "user") => {
    return await authService.signUp(email, password, fullName, role);
  };

  const handleSignIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  const handleSignOut = async () => {
    await authService.signOut();
  };

  const handleResetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  return {
    user: context.user,
    session: context.session,
    profile: context.profile,
    loading: context.loading,
    isAdmin: context.isAdmin,
    isDoctor: context.isDoctor,
    isUser: context.isUser,
    refreshProfile: context.refreshProfile,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };
};
