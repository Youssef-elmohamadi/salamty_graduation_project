import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/database.types";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!firstName || !lastName || !email || !password) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!isChecked) {
      setFormError("You must agree to the Terms and Conditions to continue.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      setIsSubmitting(true);
      await signUp(email, password, fullName, role);
      setSuccessMsg("Registration successful! Redirecting you to the admin home...");
      
      // Delay redirect to allow reading success message
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err: any) {
      console.error("Registration error:", err);
      setFormError(err.message || "An error occurred during sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to homepage
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your secure Salamati credentials to get started
            </p>
          </div>
          <div>
            {/* Show Form Alerts dynamically */}
            {formError && (
              <div className="p-4 mb-5 rounded-lg border border-red-500/20 bg-red-950/20 text-xs font-medium text-red-400 animate-in fade-in duration-200">
                <span className="font-bold">Error:</span> {formError}
              </div>
            )}

            {successMsg && (
              <div className="p-4 mb-5 rounded-lg border border-success-500/20 bg-success-950/20 text-xs font-medium text-success-400 animate-in fade-in duration-200">
                <span className="font-bold">Success:</span> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                      error={!!formError}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSubmitting}
                      error={!!formError}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    error={!!formError}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Minimum 6 characters"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      error={!!formError}
                    />
                    <span
                      onClick={() => !isSubmitting && setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Role Dropdown (RBAC Preparation) --> */}
                <div>
                  <Label>
                    Account Type / Role <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      disabled={isSubmitting}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
                    >
                      <option value="user" className="dark:bg-gray-900 text-gray-800 dark:text-white/90">
                        Patient / General User (المريض)
                      </option>
                      <option value="doctor" className="dark:bg-gray-900 text-gray-800 dark:text-white/90">
                        Medical Specialist / Doctor (الأخصائي الطبي)
                      </option>
                      <option value="admin" className="dark:bg-gray-900 text-gray-800 dark:text-white/90">
                        Administrator (المدير العام)
                      </option>
                    </select>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                    onChange={setIsChecked}
                    disabled={isSubmitting}
                  />
                  <p className="inline-block font-normal text-xs text-gray-500 dark:text-gray-400 leading-normal">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90 font-semibold cursor-pointer hover:underline">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white font-semibold cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div className="pt-2">
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                    size="sm"
                  >

                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
