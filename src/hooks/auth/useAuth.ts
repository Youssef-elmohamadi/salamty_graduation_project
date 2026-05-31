import { useAuthContext } from "../../context/auth/AuthContext";
import { authService, RegisterMetadata } from "../../services/auth/authService";

export const useAuth = () => {
  const context = useAuthContext();

  const handleSignUp = async (email: string, password: string, metadata: RegisterMetadata) => {
    return await authService.signUp(email, password, metadata);
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
    isAuthenticated: context.isAuthenticated,
    refreshProfile: context.refreshProfile,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };
};
export default useAuth;
