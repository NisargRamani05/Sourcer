"use client";

import { useState, useEffect } from "react";
import { useCurrentUserClient } from "@/hook/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, EyeOff, User, Briefcase, FileText, Shield, Wallet, Save } from "lucide-react";
import Loading from "@/components/Loading";
import { EmployeeNavbar } from "@/components/EmployeeNavbar";
import { HrNavbar } from "@/components/HrNavbar";
import { getHrCompanyName } from "@/actions/profile/get-hr-company";
import { loadProfile } from "@/actions/profile/load-profile";
import { saveProfile } from "@/actions/profile/save-profile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabType = "resume" | "private" | "salary" | "security";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  jobPosition: string;
  department: string;
  manager: string;
  location: string;
  dateOfBirth: string;
  residingAddress: string;
  nationality: string;
  personalEmail: string;
  gender: string;
  maritalStatus: string;
  dateOfJoining: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo: string;
  uanNo: string;
  employeeId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  skills: string;
  experience: string;
  education: string;
  certifications: string;
  languages: string;
}

export default function ProfilePage() {
  const { user, status } = useCurrentUserClient();
  const [activeTab, setActiveTab] = useState<TabType>("salary");
  const [showPassword, setShowPassword] = useState(false);
  const [hrCompanyName, setHrCompanyName] = useState<string>("");
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    jobPosition: "",
    department: "",
    manager: "",
    location: "",
    dateOfBirth: "",
    residingAddress: "",
    nationality: "",
    personalEmail: "",
    gender: "",
    maritalStatus: "",
    dateOfJoining: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    panNo: "",
    uanNo: "",
    employeeId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    skills: "",
    experience: "",
    education: "",
    certifications: "",
    languages: "",
  });

  const Navbar = user?.role === "EMPLOYEE" ? EmployeeNavbar : HrNavbar;
  const isEmployee = user?.role === "EMPLOYEE";

  // Load profile data and HR company name
  // Load profile data and HR company name
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Only set loading to true if we don't have data yet to prevent flashing
      if (!profileData.email) setIsLoading(true);
      
      // Fetch profile data
      const profileResult = await loadProfile();
      if (profileResult && !profileResult.error) {
        // Ensure name is always set (required field)
        const loadedData = profileResult as ProfileData;
        if (!loadedData.name || loadedData.name.trim() === "") {
          loadedData.name = user.name || "";
        }
        setProfileData(loadedData);
      } else {
        // Initialize with user data if profile not loaded
        setProfileData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          employeeId: user.employeeId || "",
        }));
      }

      // Fetch HR's company name for employees
      if (isEmployee) {
        setIsLoadingCompany(true);
        const result = await getHrCompanyName();
        if (result && !result.error && result.companyName) {
          setHrCompanyName(result.companyName);
        } else {
          // Fallback to user's stored company name
          setHrCompanyName(user.companyName || "");
        }
        setIsLoadingCompany(false);
      } else {
        // For HR, use their own company name
        setHrCompanyName(user.companyName || "");
        setIsLoadingCompany(false);
      }

      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
    // FIX: Depend on user.id instead of the whole user object
    // This prevents re-fetching when you switch tabs
  }, [user?.id, isEmployee]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveProfile(profileData);
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  // --- UI Styles ---
  const inputStyles = "bg-black/50 border-[#CFCBC8]/20 text-[#CFCBC8] placeholder:text-[#CFCBC8]/30 focus:border-[#CFCBC8] focus:ring-[#CFCBC8]/20 h-11";
  const labelStyles = "text-xs font-semibold text-[#CFCBC8]/60 uppercase tracking-wider mb-2 block";
  const cardStyles = "bg-zinc-900/30 border border-[#CFCBC8]/10 backdrop-blur-sm shadow-xl";
  const cardHeaderStyles = "border-b border-[#CFCBC8]/10 pb-4 mb-6";
  const cardTitleStyles = "text-xl font-bold text-[#CFCBC8] flex items-center gap-2";

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black">
       {/* Background Grid */}
       <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-10 px-6">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent mb-2">
                  My Profile
                </h1>
                <p className="text-[#CFCBC8]/60">Manage your personal information and account settings.</p>
              </div>
              
              <Button
                size="lg"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-[#CFCBC8] text-black hover:bg-[#fff] transition-all shadow-[0_0_20px_-5px_rgba(207,203,200,0.3)] font-semibold"
              >
                {isSaving ? (
                    <span className="flex items-center gap-2">Saving...</span>
                ) : (
                    <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                )}
              </Button>
            </div>

            {/* Profile Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information (Avatar & Basic) */}
              <Card className={cardStyles}>
                <CardHeader className={cardHeaderStyles}>
                  <CardTitle className={cardTitleStyles}>
                    <User className="w-5 h-5 text-[#CFCBC8]/70" />
                    Identity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start gap-8">
                    <div className="relative group">
                      <div className="h-28 w-28 rounded-full p-1 bg-gradient-to-br from-[#CFCBC8]/20 to-transparent border border-[#CFCBC8]/30">
                        <Avatar className="h-full w-full">
                          <AvatarImage src={user.image ?? ""} className="object-cover" />
                          <AvatarFallback className="bg-zinc-900 text-[#CFCBC8] text-3xl font-bold">
                            {user.name?.charAt(0) ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#CFCBC8] text-black hover:bg-white border-2 border-black"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-5 w-full">
                      <div>
                        <Label htmlFor="name" className={labelStyles}>Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className={labelStyles}>System Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className={cn(inputStyles, "bg-[#CFCBC8]/5 opacity-70 cursor-not-allowed")}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="jobPosition" className={labelStyles}>Role</Label>
                            <Input
                            id="jobPosition"
                            value={profileData.jobPosition}
                            onChange={(e) => handleInputChange("jobPosition", e.target.value)}
                            placeholder="e.g. Developer"
                            className={inputStyles}
                            />
                        </div>
                        <div>
                            <Label htmlFor="mobile" className={labelStyles}>Phone</Label>
                            <Input
                            id="mobile"
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className={inputStyles}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card className={cardStyles}>
                <CardHeader className={cardHeaderStyles}>
                  <CardTitle className={cardTitleStyles}>
                    <Briefcase className="w-5 h-5 text-[#CFCBC8]/70" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="company" className={labelStyles}>Company Name</Label>
                      <Input
                        id="company"
                        value={isLoadingCompany ? "Loading..." : (hrCompanyName || "")}
                        disabled={isEmployee}
                        readOnly={isEmployee}
                        placeholder={isEmployee ? "Company name will appear here" : "Enter company name"}
                        className={cn(inputStyles, isEmployee && "bg-[#CFCBC8]/5 opacity-70 cursor-not-allowed")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                        <Label htmlFor="department" className={labelStyles}>Department</Label>
                        <Input
                            id="department"
                            value={profileData.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            className={inputStyles}
                        />
                        </div>
                        <div>
                        <Label htmlFor="manager" className={labelStyles}>Reporting Manager</Label>
                        <Input
                            id="manager"
                            value={profileData.manager}
                            onChange={(e) => handleInputChange("manager", e.target.value)}
                            className={inputStyles}
                        />
                        </div>
                    </div>
                    <div>
                      <Label htmlFor="location" className={labelStyles}>Work Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className={inputStyles}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-[#CFCBC8]/10 pb-1">
              {[
                  { id: "salary", label: "Financial Details", icon: Wallet },
                  { id: "private", label: "Private Info", icon: User },
                  { id: "resume", label: "Resume & Skills", icon: FileText },
                  { id: "security", label: "Security", icon: Shield },
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "px-6 py-3 text-sm font-medium transition-all duration-300 rounded-t-lg flex items-center gap-2 border-b-2",
                      activeTab === tab.id
                        ? "border-[#CFCBC8] text-[#CFCBC8] bg-[#CFCBC8]/5"
                        : "border-transparent text-[#CFCBC8]/40 hover:text-[#CFCBC8]/70 hover:bg-[#CFCBC8]/5"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "resume" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Professional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                          <Label htmlFor="resumeFile" className={labelStyles}>Upload Resume (PDF/DOC)</Label>
                          <Input
                            id="resumeFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="cursor-pointer file:bg-[#CFCBC8] file:text-black file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold hover:file:bg-[#EAE8E6] text-[#CFCBC8]/70 border-[#CFCBC8]/20 bg-black/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills" className={labelStyles}>Key Skills</Label>
                          <Input
                            id="skills"
                            value={profileData.skills}
                            onChange={(e) => handleInputChange("skills", e.target.value)}
                            placeholder="e.g. React, Node.js, Project Management"
                            className={inputStyles}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="experience" className={labelStyles}>Experience (Years)</Label>
                                <Input
                                    id="experience"
                                    type="text"
                                    value={profileData.experience}
                                    onChange={(e) => handleInputChange("experience", e.target.value)}
                                    className={inputStyles}
                                />
                            </div>
                            <div>
                                <Label htmlFor="education" className={labelStyles}>Highest Education</Label>
                                <Input
                                    id="education"
                                    value={profileData.education}
                                    onChange={(e) => handleInputChange("education", e.target.value)}
                                    className={inputStyles}
                                />
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Additional Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                          <Label htmlFor="certifications" className={labelStyles}>Certifications</Label>
                          <Input
                            id="certifications"
                            value={profileData.certifications}
                            onChange={(e) => handleInputChange("certifications", e.target.value)}
                            placeholder="e.g. AWS Solutions Architect"
                            className={inputStyles}
                          />
                        </div>
                        <div>
                          <Label htmlFor="languages" className={labelStyles}>Languages</Label>
                          <Input
                            id="languages"
                            value={profileData.languages}
                            onChange={(e) => handleInputChange("languages", e.target.value)}
                            placeholder="e.g. English, Spanish"
                            className={inputStyles}
                          />
                        </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "private" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Personal Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="dateOfBirth" className={labelStyles}>Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                className={cn(inputStyles, "text-[#CFCBC8] [color-scheme:dark]")} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="nationality" className={labelStyles}>Nationality</Label>
                            <Input
                                id="nationality"
                                placeholder="Enter nationality"
                                className={inputStyles}
                            />
                          </div>
                      </div>
                      <div>
                        <Label htmlFor="residingAddress" className={labelStyles}>Residing Address</Label>
                        <Input
                          id="residingAddress"
                          placeholder="Full address"
                          className={inputStyles}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="personalEmail" className={labelStyles}>Personal Email</Label>
                            <Input
                            id="personalEmail"
                            type="email"
                            className={inputStyles}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender" className={labelStyles}>Gender</Label>
                            <Input
                            id="gender"
                            className={inputStyles}
                            />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="maritalStatus" className={labelStyles}>Marital Status</Label>
                            <Input
                            id="maritalStatus"
                            className={inputStyles}
                            />
                        </div>
                        <div>
                            <Label htmlFor="dateOfJoining" className={labelStyles}>Joining Date</Label>
                            <Input
                            id="dateOfJoining"
                            type="date"
                            className={cn(inputStyles, "text-[#CFCBC8] [color-scheme:dark]")}
                            />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <Label htmlFor="emergencyName" className={labelStyles}>Contact Name</Label>
                        <Input
                          id="emergencyName"
                          value={profileData.emergencyContactName}
                          onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          className={inputStyles}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="emergencyPhone" className={labelStyles}>Phone Number</Label>
                            <Input
                                id="emergencyPhone"
                                type="tel"
                                value={profileData.emergencyContactPhone}
                                onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <Label htmlFor="emergencyRelation" className={labelStyles}>Relationship</Label>
                            <Input
                                id="emergencyRelation"
                                value={profileData.emergencyContactRelation}
                                onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "salary" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Bank Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="bankName" className={labelStyles}>Bank Name</Label>
                            <Input
                                id="bankName"
                                value={profileData.bankName}
                                onChange={(e) => handleInputChange("bankName", e.target.value)}
                                className={inputStyles}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ifscCode" className={labelStyles}>IFSC Code</Label>
                            <Input
                                id="ifscCode"
                                value={profileData.ifscCode}
                                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                                className={inputStyles}
                            />
                          </div>
                      </div>
                      <div>
                        <Label htmlFor="accountNumber" className={labelStyles}>Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={profileData.accountNumber}
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                          className={inputStyles}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Tax & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="panNo" className={labelStyles}>PAN Number</Label>
                            <Input
                                id="panNo"
                                value={profileData.panNo}
                                onChange={(e) => handleInputChange("panNo", e.target.value)}
                                className={inputStyles}
                            />
                          </div>
                          <div>
                            <Label htmlFor="uanNo" className={labelStyles}>UAN Number</Label>
                            <Input
                                id="uanNo"
                                value={profileData.uanNo}
                                onChange={(e) => handleInputChange("uanNo", e.target.value)}
                                className={inputStyles}
                            />
                          </div>
                      </div>
                      <div>
                        <Label htmlFor="empCode" className={labelStyles}>Employee Code</Label>
                        <Input
                          id="empCode"
                          value={profileData.employeeId}
                          disabled
                          className={cn(inputStyles, "bg-[#CFCBC8]/5 opacity-70 cursor-not-allowed")}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Duplicate Personal Data from Salary tab (retained from your request) */}
                   <Card className={cn(cardStyles, "lg:col-span-2 opacity-60")}>
                    <CardHeader className={cardHeaderStyles}>
                        <CardTitle className={cardTitleStyles}>Read-Only Verified Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div>
                                <Label className={labelStyles}>Date of Birth</Label>
                                <div className="text-[#CFCBC8]">{profileData.dateOfBirth || "N/A"}</div>
                            </div>
                            <div>
                                <Label className={labelStyles}>Nationality</Label>
                                <div className="text-[#CFCBC8]">{profileData.nationality || "N/A"}</div>
                            </div>
                             <div>
                                <Label className={labelStyles}>Personal Email</Label>
                                <div className="text-[#CFCBC8] truncate">{profileData.personalEmail || "N/A"}</div>
                            </div>
                            <div>
                                <Label className={labelStyles}>Gender</Label>
                                <div className="text-[#CFCBC8]">{profileData.gender || "N/A"}</div>
                            </div>
                        </div>
                    </CardContent>
                   </Card>
                </div>
              )}

              {activeTab === "security" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Card 1: Change Password */}
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="currentPassword" className={labelStyles}>Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            className={cn(inputStyles, "pr-10")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full text-[#CFCBC8]/50 hover:text-[#CFCBC8] hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="newPassword" className={labelStyles}>New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                className={inputStyles}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className={labelStyles}>Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className={inputStyles}
                            />
                        </div>
                      </div>
                      <Button className="w-full bg-[#CFCBC8]/10 hover:bg-[#CFCBC8]/20 text-[#CFCBC8] border border-[#CFCBC8]/20 mt-4 h-11">
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Card 2: Two-Factor Auth */}
                  <Card className={cardStyles}>
                    <CardHeader className={cardHeaderStyles}>
                      <CardTitle className={cardTitleStyles}>Two-Factor Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-3 p-4 bg-[#CFCBC8]/5 rounded-lg border border-[#CFCBC8]/10">
                        <input
                            type="checkbox"
                            id="twoFactorEnabled"
                            className="mt-1 accent-[#CFCBC8] h-4 w-4 bg-black border-[#CFCBC8]"
                        />
                        <div>
                            <Label htmlFor="twoFactorEnabled" className="text-[#CFCBC8] font-bold cursor-pointer">
                                Enable 2FA
                            </Label>
                            <p className="text-xs text-[#CFCBC8]/50 mt-1 leading-relaxed">
                                Adds an extra layer of security to your account by requiring a code when logging in.
                            </p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="securityQuestions" className={labelStyles}>Security Question</Label>
                        <Input
                          id="securityQuestions"
                          placeholder="What was the name of your first pet?"
                          className={inputStyles}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}