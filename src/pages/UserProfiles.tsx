import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useVyapar } from "../context/VyaparContext";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";

export default function UserProfiles() {
  const { t } = useTranslation();
  const { profile, updateUserProfile, isProfileLoading } = useVyapar();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const DEFAULT_AVATARS = [
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Jack",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Leo",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Mia",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Sophie",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Zoe"
  ];

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarSelect = (url: string) => {
    setAvatar(url);
    setFormData((prev: any) => ({ ...prev, picture: url }));
    localStorage.setItem("userAvatar", url);
    window.dispatchEvent(new Event("avatarUpdated"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleAvatarSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setFormData(profile);
    } else {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setFormData({ name: user.name || "", email: user.email || "" });
        }
      } catch (e) {}
    }
  }, [profile]);

  
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data && data.address) {
          const addr = data.address;
          const addressLine1 = addr.road || addr.suburb || addr.neighbourhood || "";
          const state = addr.state || "";
          const district = addr.state_district || addr.county || "";
          const taluka = addr.county || addr.suburb || "";
          const village = addr.city || addr.town || addr.village || "";
          const pincode = addr.postcode || "";

          setFormData((prev: any) => ({
            ...prev,
            locationDetails: {
              ...(prev.locationDetails || {}),
              addressLine1: addressLine1 || prev.locationDetails?.addressLine1 || "",
              state: state || prev.locationDetails?.state || "",
              district: district || prev.locationDetails?.district || "",
              taluka: taluka || prev.locationDetails?.taluka || "",
              village: village || prev.locationDetails?.village || "",
              pincode: pincode || prev.locationDetails?.pincode || ""
            }
          }));
        }
      } catch (e) {
        alert("Failed to fetch location details.");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      setIsLocating(false);
      alert("Failed to get your location. Please ensure location permissions are granted.");
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        name: formData.name,
        personalDetails: formData.personalDetails,
        businessDetails: formData.businessDetails,
        locationDetails: formData.locationDetails,
        financialDetails: formData.financialDetails,
        kycDetails: formData.kycDetails,
        preferences: formData.preferences,
          picture: formData.picture,
      });
      setIsEditing(false);
        alert("Profile updated successfully!");
    } catch (e) {
      console.error(e as any);
      alert("Failed to save profile: " + ((e as any).message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (!section) {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: value
        }
      }));
    }
  };

  const calculateProgress = () => {
    let filled = 0;
    let total = 8;
    if (formData.name) filled++;
    if (formData.email) filled++;
    if (formData.personalDetails?.phone) filled++;
    if (formData.businessDetails?.businessName) filled++;
    if (formData.locationDetails?.state) filled++;
    if (formData.financialDetails?.panNumber) filled++;
    if (formData.kycDetails?.kycStatus === 'VERIFIED') filled += 2;
    return Math.min(100, Math.round((filled / total) * 100));
  };

  const renderInput = (section: string, field: string, label: string, type = "text") => {
    const val = section ? (formData[section]?.[field] || "") : (formData[field] || "");
    return (
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <Input 
          type={type} 
          value={val} 
          onChange={(e: any) => handleChange(section, field, type === 'checkbox' ? e.target.checked : e.target.value)}
          disabled={!isEditing}
        />
      </div>
    );
  };

  const renderCheckbox = (section: string, field: string, label: string) => {
    const val = section ? (formData[section]?.[field] || false) : (formData[field] || false);
    return (
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={val} 
          onChange={(e: any) => handleChange(section, field, e.target.checked)}
          disabled={!isEditing}
          className="w-5 h-5 rounded border-gray-300"
        />
        <Label>{label}</Label>
      </div>
    );
  };

  if (isProfileLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;
  }

  const maskPan = (pan: string) => {
    if (!pan || pan.length < 10) return pan;
    return `XXXXXX${pan.slice(-4)}`;
  };

  return (
    <>
      <PageMeta title="Profile | VyaparMitra" description="VyaparMitra user profile." />
      <PageBreadcrumb pageTitle="Profile Settings" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 space-y-8">
        
        {/* Header & Progress */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="flex items-center gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-brand-500 relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Complete Profile</h2>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{`${calculateProgress()}%`} Completed</span>
                </div>
              </div>
            </div>

            {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => {
                setFormData(profile);
                setIsEditing(false);
              }}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Avatar Selector */}
          {isEditing && (
            <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <h3 className="text-sm font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Choose an Avatar</h3>
              <div className="flex flex-wrap gap-4">
                {DEFAULT_AVATARS.map((url, i) => (
                  <div key={i} onClick={() => handleAvatarSelect(url)} className={`w-14 h-14 rounded-full overflow-hidden cursor-pointer border-2 transition-all ${avatar === url ? 'border-brand-500 scale-110' : 'border-transparent hover:border-brand-300'}`}>
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover bg-white" />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="h-14 rounded-full px-6 ml-2" onClick={() => fileInputRef.current?.click()}>
                  Upload Custom
                </Button>
              </div>
            </section>
          )}
          
          {/* General & Personal */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput("", "name", "Full Name")}
            {renderInput("", "email", "Email Address", "email")}
            {renderInput("personalDetails", "phone", "Phone Number")}
            {renderInput("personalDetails", "dateOfBirth", "Date of Birth", "date")}
            {renderInput("personalDetails", "gender", "Gender")}
          </div>
        </section>

        {/* Business Details */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput("businessDetails", "businessName", "Business Name")}
            {renderInput("businessDetails", "industry", "Industry")}
            {renderInput("businessDetails", "registrationType", "Registration Type")}
            {renderInput("businessDetails", "yearEstablished", "Year Established", "number")}
            {renderInput("businessDetails", "annualTurnover", "Annual Turnover (INR)", "number")}
            {renderInput("businessDetails", "gstNumber", "GST Number")}
          </div>
        </section>

        {/* Location Details (Dependent Dropdowns style) */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <h3 className="text-lg font-semibold">Business Location</h3>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={handleLiveLocation} disabled={isLocating} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isLocating ? "Locating..." : "Use Live Location"}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput("locationDetails", "addressLine1", "Address Line 1")}
            {renderInput("locationDetails", "state", "State")}
            {renderInput("locationDetails", "district", "District")}
            {renderInput("locationDetails", "taluka", "Taluka / Tehsil")}
            {renderInput("locationDetails", "village", "Village / City")}
            {renderInput("locationDetails", "pincode", "Pincode")}
          </div>
        </section>

        {/* Financial Details */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Financial Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInput("financialDetails", "availableMarginCapital", "Available Margin Capital (INR)", "number")}
            {renderInput("financialDetails", "existingBusinessInvestment", "Existing Business Investment", "number")}
            {renderInput("financialDetails", "monthlyBusinessIncomeRange", "Monthly Business Income Range")}
            {renderInput("financialDetails", "preferredLoanAmount", "Preferred Loan Amount", "number")}
            {renderCheckbox("financialDetails", "existingLoanStatus", "I have an existing loan")}
          </div>
        </section>

        {/* KYC Details */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">KYC & Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <Label>PAN Number</Label>
              {isEditing ? (
                <Input type="text" value={formData.financialDetails?.panNumber || ""} onChange={(e: any) => handleChange("financialDetails", "panNumber", e.target.value)} />
              ) : (
                <div className="p-3 bg-white dark:bg-gray-900 border rounded-lg font-mono">{maskPan(formData.financialDetails?.panNumber)}</div>
              )}
            </div>
            {renderInput("kycDetails", "aadhaarNumber", "Aadhaar Number")}
            <div className="flex flex-col gap-1">
              <Label>KYC Status</Label>
              <div className="mt-2 text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 self-start">
                {profile?.kycDetails?.kycStatus || "PENDING"}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences / Notifications */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Notification Settings</h3>
          <div className="flex flex-col gap-4">
            {renderCheckbox("preferences", "whatsappAlerts", "WhatsApp Notifications")}
            {renderCheckbox("preferences", "smsAlerts", "SMS Alerts")}
            {renderCheckbox("preferences", "schemeAlerts", "Government Scheme Alerts")}
            {renderCheckbox("preferences", "repaymentReminders", "Loan Repayment Reminders")}
          </div>
        </section>

        {/* Security & Login */}
        <section className="p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Account Actions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </section>
        
      </div>
    </>
  );
}
