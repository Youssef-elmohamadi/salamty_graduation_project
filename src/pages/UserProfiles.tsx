import { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/auth/useAuth";
import { supabase } from "../lib/supabase";
import PageMeta from "../components/common/PageMeta";
import Badge from "../components/ui/badge/Badge";

interface UserProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  blood_type: string;
  height: string;
  weight: string;
  allergies: string;
  chronic_diseases: string;
}

export default function UserProfiles() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const { refreshProfile } = useAuth();

  // Loading, saving, error state parameters
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Profile data states
  const [profileData, setProfileData] = useState<UserProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    blood_type: "",
    height: "",
    weight: "",
    allergies: "",
    chronic_diseases: "",
  });

  // Edit form states
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    height: "",
    weight: "",
    allergies: "",
    chronic_diseases: "",
  });

  // Fetch active Supabase auth user profile metadata
  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setErrorMsg(null);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        const meta = user.user_metadata || {};
        const fetchedData: UserProfileData = {
          first_name: meta.first_name || "",
          last_name: meta.last_name || "",
          email: user.email || "",
          phone: meta.phone || "",
          gender: meta.gender || "",
          date_of_birth: meta.date_of_birth || "",
          blood_type: meta.blood_type || "",
          height: meta.height || "",
          weight: meta.weight || "",
          allergies: meta.allergies || "",
          chronic_diseases: meta.chronic_diseases || "",
        };
        setProfileData(fetchedData);
        
        // Pre-populate edit form fields
        setEditForm({
          first_name: fetchedData.first_name,
          last_name: fetchedData.last_name,
          phone: fetchedData.phone,
          height: fetchedData.height,
          weight: fetchedData.weight,
          allergies: fetchedData.allergies,
          chronic_diseases: fetchedData.chronic_diseases,
        });
      }
    } catch (err: any) {
      console.error("Profile loading telemetry mismatch:", err);
      setErrorMsg(t("profile.error", "Failed to retrieve secure medical profile."));
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Save updated metadata to Supabase Auth
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: {
          first_name: editForm.first_name.trim(),
          last_name: editForm.last_name.trim(),
          full_name: `${editForm.first_name.trim()} ${editForm.last_name.trim()}`,
          phone: editForm.phone.trim(),
          height: editForm.height.trim(),
          weight: editForm.weight.trim(),
          allergies: editForm.allergies.trim(),
          chronic_diseases: editForm.chronic_diseases.trim(),
        }
      });

      if (error) throw error;

      if (user) {
        // Sync context profile fields
        await refreshProfile();
        
        // Update local displays
        const meta = user.user_metadata || {};
        setProfileData((prev) => ({
          ...prev,
          first_name: meta.first_name || "",
          last_name: meta.last_name || "",
          phone: meta.phone || "",
          height: meta.height || "",
          weight: meta.weight || "",
          allergies: meta.allergies || "",
          chronic_diseases: meta.chronic_diseases || "",
        }));

        setSuccessMsg(t("profile.success", "Profile updated successfully!"));
        setIsEditing(false);
        
        // Hide success message after delay
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setErrorMsg(err.message || t("profile.error", "Failed to update profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  // Generate Initials from First + Last Name
  const getInitials = () => {
    const f = profileData.first_name.trim();
    const l = profileData.last_name.trim();
    if (f && l) {
      return (f[0] + l[0]).toUpperCase();
    } else if (f) {
      return f.slice(0, 2).toUpperCase();
    } else if (l) {
      return l.slice(0, 2).toUpperCase();
    }
    return profileData.email ? profileData.email.slice(0, 2).toUpperCase() : "US";
  };

  // Safe fallback display helper
  const displayValue = (val: string) => {
    return val.trim() ? val : t("profile.not_available", "Not Available");
  };

  return (
    <>
      <PageMeta
        title={t("profile.title", "Medical Specialist Profile") + " | Salamati Admin"}
        description="Secure patient and specialist medical telemetry profile card."
      />

      <div className="space-y-6 text-gray-800 dark:text-gray-100 font-outfit select-none" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Alerts Block */}
        {errorMsg && (
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-950/15 text-xs text-red-400 flex items-center gap-3 animate-in fade-in duration-200 text-start">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 text-xs text-emerald-400 flex items-center gap-3 animate-in fade-in duration-200 text-start">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Loading Skeletons State */}
        {profileLoading ? (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0" />
              <div className="space-y-3 flex-1 text-center sm:text-start">
                <div className="w-40 h-6 bg-gray-200 dark:bg-gray-800 rounded mx-auto sm:mx-0" />
                <div className="w-48 h-4 bg-gray-150 dark:bg-gray-850 rounded mx-auto sm:mx-0" />
                <div className="w-24 h-5 bg-gray-200 dark:bg-gray-850 rounded-full mx-auto sm:mx-0" />
              </div>
            </div>

            {/* Info cards skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse space-y-5">
                <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-24 h-4 bg-gray-150 dark:bg-gray-850 rounded" />
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse space-y-5">
                <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="w-24 h-4 bg-gray-150 dark:bg-gray-850 rounded" />
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header user details Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-theme-xs">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
                {/* Initials Avatar */}
                <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-2xl tracking-wider shadow-md shadow-brand-500/10 shrink-0">
                  {getInitials()}
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {profileData.first_name || profileData.last_name 
                      ? `${profileData.first_name} ${profileData.last_name}`.trim() 
                      : t("profile.not_available", "Not Available")}
                  </h2>
                  <p className="text-sm text-gray-400 font-mono font-medium">
                    {profileData.email}
                  </p>
                  <div className="pt-1 flex justify-center sm:justify-start">
                    <Badge color="primary" variant="solid" size="sm">
                      {t("profile.administrator", "Administrator")}
                    </Badge>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-11 px-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.05] text-xs font-bold text-gray-700 dark:text-gray-300 transition-all flex items-center gap-2 cursor-pointer shadow-theme-xs shrink-0 self-center"
                >
                  <svg className="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{t("profile.edit", "Edit Profile")}</span>
                </button>
              )}
            </div>

            {/* Editing Card Block */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs space-y-6 text-start">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-150 dark:border-gray-800 pb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  {t("profile.edit", "Edit Profile Details")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.first_name", "First Name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.last_name", "Last Name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.phone", "Phone Number")}
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.height", "Height (cm)")}
                    </label>
                    <input
                      type="text"
                      value={editForm.height}
                      onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                      placeholder="e.g. 175"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.weight", "Weight (kg)")}
                    </label>
                    <input
                      type="text"
                      value={editForm.weight}
                      onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                      placeholder="e.g. 70"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.allergies", "Known Allergies")}
                    </label>
                    <input
                      type="text"
                      value={editForm.allergies}
                      onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                      placeholder="Separated by commas"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("profile.chronic_diseases", "Chronic Diseases")}
                    </label>
                    <input
                      type="text"
                      value={editForm.chronic_diseases}
                      onChange={(e) => setEditForm({ ...editForm, chronic_diseases: e.target.value })}
                      placeholder="Separated by commas"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-transparent text-gray-800 shadow-theme-xs focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? t("common.loading", "Saving...") : t("profile.save", "Save Changes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        phone: profileData.phone,
                        height: profileData.height,
                        weight: profileData.weight,
                        allergies: profileData.allergies,
                        chronic_diseases: profileData.chronic_diseases,
                      });
                    }}
                    className="h-11 px-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-gray-700 dark:hover:text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    {t("profile.cancel", "Cancel")}
                  </button>
                </div>
              </form>
            ) : (
              /* Display View Mode Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                
                {/* 1. Personal Information Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-theme-xs space-y-5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-150 dark:border-gray-800 pb-3">
                    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{t("profile.personal_info", "Personal Information")}</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.first_name", "First Name")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{displayValue(profileData.first_name)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.last_name", "Last Name")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{displayValue(profileData.last_name)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.email", "Email")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200 font-mono text-xs">{profileData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.phone", "Phone Number")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{displayValue(profileData.phone)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.gender", "Gender")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {profileData.gender ? (
                          <Badge color="primary" size="sm">
                            {profileData.gender}
                          </Badge>
                        ) : (
                          t("profile.not_available", "Not Available")
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pb-1">
                      <span className="text-gray-400 font-medium">{t("profile.dob", "Date of Birth")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{displayValue(profileData.date_of_birth)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Health Information Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-theme-xs space-y-5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-150 dark:border-gray-800 pb-3">
                    <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{t("profile.health_info", "Health Information")}</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.blood_type", "Blood Type")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {profileData.blood_type ? (
                          <Badge color="error" variant="light" size="sm">
                            {profileData.blood_type}
                          </Badge>
                        ) : (
                          t("profile.not_available", "Not Available")
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.height", "Height")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {profileData.height ? `${profileData.height} cm` : t("profile.not_available", "Not Available")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.weight", "Weight")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {profileData.weight ? `${profileData.weight} kg` : t("profile.not_available", "Not Available")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-50 dark:border-gray-800/20 pb-2">
                      <span className="text-gray-400 font-medium">{t("profile.allergies", "Known Allergies")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-xs">
                        {profileData.allergies ? (
                          <Badge color="warning" size="sm">
                            {profileData.allergies}
                          </Badge>
                        ) : (
                          t("profile.not_available", "Not Available")
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pb-1">
                      <span className="text-gray-400 font-medium">{t("profile.chronic_diseases", "Chronic Diseases")}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-xs">
                        {profileData.chronic_diseases ? (
                          <Badge color="primary" size="sm">
                            {profileData.chronic_diseases}
                          </Badge>
                        ) : (
                          t("profile.not_available", "Not Available")
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
