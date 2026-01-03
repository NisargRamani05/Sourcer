"use client";

import { useState, useEffect } from "react";
import { useCurrentUserClient } from "@/hook/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, EyeOff, Plus, X } from "lucide-react";
import Loading from "@/components/Loading";
import { loadProfile } from "@/actions/profile/load-profile";
import { saveProfile } from "@/actions/profile/save-profile";
import { toast } from "sonner";

type TabType = "personal" | "private" | "salary";

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
  // Salary fields
  monthlyWage: string;
  yearlyWage: string;
  workingDaysPerWeek: string;
  breakTimeHours: string;
  basicSalary: string;
  basicSalaryPercent: string;
  hra: string;
  hraPercent: string;
  standardAllowance: string;
  standardAllowancePercent: string;
  performanceBonus: string;
  performanceBonusPercent: string;
  lta: string;
  ltaPercent: string;
  fixedAllowance: string;
  fixedAllowancePercent: string;
  employeePF: string;
  employeePFPercent: string;
  employerPF: string;
  employerPFPercent: string;
  professionalTax: string;
}

export default function HrProfilePage() {
  const { user, status } = useCurrentUserClient();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [certificationsList, setCertificationsList] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
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
    monthlyWage: "",
    yearlyWage: "",
    workingDaysPerWeek: "",
    breakTimeHours: "",
    basicSalary: "",
    basicSalaryPercent: "",
    hra: "",
    hraPercent: "",
    standardAllowance: "",
    standardAllowancePercent: "",
    performanceBonus: "",
    performanceBonusPercent: "",
    lta: "",
    ltaPercent: "",
    fixedAllowance: "",
    fixedAllowancePercent: "",
    employeePF: "",
    employeePFPercent: "",
    employerPF: "",
    employerPFPercent: "",
    professionalTax: "",
  });

  // Load profile data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      
      // Set company name from user session first
      if (user.companyName) {
        setCompanyName(user.companyName);
      }
      
      const profileResult = await loadProfile();
      if (profileResult && !profileResult.error) {
        const loadedData = profileResult as ProfileData;
        if (!loadedData.name || loadedData.name.trim() === "") {
          loadedData.name = user.name || "";
        }
        setProfileData(loadedData);
        // Initialize skills and certifications arrays
        setSkillsList(loadedData.skills ? loadedData.skills.split(",").filter(s => s.trim() !== "") : []);
        setCertificationsList(loadedData.certifications ? loadedData.certifications.split(",").filter(c => c.trim() !== "") : []);
      } else {
        setProfileData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          employeeId: user.employeeId || "",
        }));
        setSkillsList([]);
        setCertificationsList([]);
      }
      
      // If company name is still not set, try to get it from user object
      if (!companyName && user.companyName) {
        setCompanyName(user.companyName);
      }
      
      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-calculate salary components
  const calculateSalaryComponents = (field: keyof ProfileData, value: string) => {
    const monthlyWage = parseFloat(profileData.monthlyWage) || 0;
    const basicSalary = parseFloat(profileData.basicSalary) || 0;
    const basicSalaryPercent = parseFloat(profileData.basicSalaryPercent) || 0;

    if (field === "monthlyWage" && value) {
      const wage = parseFloat(value);
      const yearly = (wage * 12).toString();
      handleInputChange("yearlyWage", yearly);
      
      // Recalculate all components based on new wage
      if (basicSalaryPercent > 0) {
        const newBasic = ((basicSalaryPercent / 100) * wage).toFixed(2);
        handleInputChange("basicSalary", newBasic);
        calculateHRA(newBasic);
      }
      // Recalculate fixed allowance after a delay to ensure other values are updated
      setTimeout(() => calculateFixedAllowance(), 100);
    } else if (field === "yearlyWage" && value) {
      const yearly = parseFloat(value);
      const monthly = (yearly / 12).toFixed(2);
      handleInputChange("monthlyWage", monthly);
    } else if (field === "basicSalary" && value) {
      const basic = parseFloat(value);
      if (monthlyWage > 0) {
        const percent = ((basic / monthlyWage) * 100).toFixed(2);
        handleInputChange("basicSalaryPercent", percent);
      }
      calculateHRA(value);
    } else if (field === "basicSalaryPercent" && value) {
      const percent = parseFloat(value);
      if (monthlyWage > 0) {
        const basic = ((percent / 100) * monthlyWage).toFixed(2);
        handleInputChange("basicSalary", basic);
        calculateHRA(basic);
      }
    }
  };

  const calculateHRA = (basicSalaryStr: string) => {
    const basic = parseFloat(basicSalaryStr) || 0;
    const hraPercent = parseFloat(profileData.hraPercent) || 50; // Default 50%
    if (basic > 0 && !profileData.hra) {
      const hra = ((hraPercent / 100) * basic).toFixed(2);
      handleInputChange("hra", hra);
    }
  };

  const calculateFixedAllowance = () => {
    const monthlyWage = parseFloat(profileData.monthlyWage) || 0;
    const basic = parseFloat(profileData.basicSalary) || 0;
    const hra = parseFloat(profileData.hra) || 0;
    const standardAllowance = parseFloat(profileData.standardAllowance) || 0;
    const performanceBonus = parseFloat(profileData.performanceBonus) || 0;
    const lta = parseFloat(profileData.lta) || 0;
    
    const total = basic + hra + standardAllowance + performanceBonus + lta;
    const fixed = (monthlyWage - total).toFixed(2);
    if (monthlyWage > 0) {
      handleInputChange("fixedAllowance", fixed);
      const percent = ((parseFloat(fixed) / monthlyWage) * 100).toFixed(2);
      handleInputChange("fixedAllowancePercent", percent);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentSkills = skillsList.length === 0 ? [""] : skillsList;
      const currentCerts = certificationsList.length === 0 ? [""] : certificationsList;
      
      const dataToSave = {
        ...profileData,
        skills: currentSkills.filter(s => s.trim() !== "").join(","),
        certifications: currentCerts.filter(c => c.trim() !== "").join(","),
      };
      const result = await saveProfile(dataToSave);
      if (result.success) {
        toast.success(result.success);
        setSkillsList(currentSkills.filter(s => s.trim() !== ""));
        setCertificationsList(currentCerts.filter(c => c.trim() !== ""));
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

  if (!user || user.role !== "HR") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <h1 className="text-3xl font-bold">My Profile</h1>

          {/* Profile Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="bg-red-900 text-white text-2xl">
                        {user.name?.charAt(0) ?? "H"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label htmlFor="name">My Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobPosition">Job Position</Label>
                      <Input
                        id="jobPosition"
                        value={profileData.jobPosition}
                        onChange={(e) => handleInputChange("jobPosition", e.target.value)}
                        placeholder="Enter job position"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Login ID</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={companyName || user.companyName || ""}
                      disabled
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      placeholder={companyName || user.companyName ? "" : "Company name from signup"}
                    />
                    {companyName || user.companyName ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Company name is set during signup and cannot be changed
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1 text-amber-500">
                        No company name found. Please contact support.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      value={profileData.manager}
                      onChange={(e) => handleInputChange("manager", e.target.value)}
                      placeholder="Enter manager name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "personal"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("private")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "private"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Private Info
            </button>
            <button
              onClick={() => setActiveTab("salary")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "salary"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Salary Info
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === "personal" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="text"
                          value={profileData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                          placeholder="Enter years of experience"
                        />
                      </div>
                      <div>
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={profileData.education}
                          onChange={(e) => handleInputChange("education", e.target.value)}
                          placeholder="Enter education details"
                        />
                      </div>
                      <div>
                        <Label htmlFor="languages">Languages</Label>
                        <Input
                          id="languages"
                          value={profileData.languages}
                          onChange={(e) => handleInputChange("languages", e.target.value)}
                          placeholder="Enter languages known"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(skillsList.length === 0 ? [""] : skillsList).map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const currentList = skillsList.length === 0 ? [""] : skillsList;
                                const newSkills = [...currentList];
                                newSkills[idx] = e.target.value;
                                setSkillsList(newSkills);
                              }}
                              placeholder="Enter skill"
                              className="flex-1"
                            />
                            {(skillsList.length === 0 ? 1 : skillsList.length) > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const currentList = skillsList.length === 0 ? [""] : skillsList;
                                  const filtered = currentList.filter((_, i) => i !== idx);
                                  setSkillsList(filtered.length === 0 ? [] : filtered);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-primary w-full"
                          onClick={() => setSkillsList([...skillsList, ""])}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Skills
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Certification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(certificationsList.length === 0 ? [""] : certificationsList).map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={cert}
                              onChange={(e) => {
                                const currentList = certificationsList.length === 0 ? [""] : certificationsList;
                                const newCerts = [...currentList];
                                newCerts[idx] = e.target.value;
                                setCertificationsList(newCerts);
                              }}
                              placeholder="Enter certification"
                              className="flex-1"
                            />
                            {(certificationsList.length === 0 ? 1 : certificationsList.length) > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const currentList = certificationsList.length === 0 ? [""] : certificationsList;
                                  const filtered = currentList.filter((_, i) => i !== idx);
                                  setCertificationsList(filtered.length === 0 ? [] : filtered);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-primary w-full"
                          onClick={() => setCertificationsList([...certificationsList, ""])}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Certification
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "private" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="residingAddress">Residing Address</Label>
                        <Input
                          id="residingAddress"
                          value={profileData.residingAddress}
                          onChange={(e) => handleInputChange("residingAddress", e.target.value)}
                          placeholder="Enter your address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={profileData.nationality}
                          onChange={(e) => handleInputChange("nationality", e.target.value)}
                          placeholder="Enter nationality"
                        />
                      </div>
                      <div>
                        <Label htmlFor="personalEmail">Personal Email</Label>
                        <Input
                          id="personalEmail"
                          type="email"
                          value={profileData.personalEmail}
                          onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                          placeholder="Enter personal email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          value={profileData.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          placeholder="Enter gender"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Input
                          id="maritalStatus"
                          value={profileData.maritalStatus}
                          onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                          placeholder="Enter marital status"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfJoining">Date of Joining</Label>
                        <Input
                          id="dateOfJoining"
                          type="date"
                          value={profileData.dateOfJoining}
                          onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                        <Input
                          id="emergencyName"
                          value={profileData.emergencyContactName}
                          onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          placeholder="Enter emergency contact name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={profileData.emergencyContactPhone}
                          onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                          placeholder="Enter emergency contact phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelation">Relationship</Label>
                        <Input
                          id="emergencyRelation"
                          value={profileData.emergencyContactRelation}
                          onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                          placeholder="Enter relationship"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "salary" && (
              <div className="col-span-2 space-y-6">
                {/* Salary Info Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center border-b pb-4">Salary Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                      <div>
                        <Label htmlFor="monthlyWage">Month Wage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="monthlyWage"
                            type="number"
                            value={profileData.monthlyWage}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("monthlyWage", value);
                              calculateSalaryComponents("monthlyWage", value);
                            }}
                            placeholder="0"
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">/ Month</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="yearlyWage">Yearly wage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="yearlyWage"
                            type="number"
                            value={profileData.yearlyWage}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange("yearlyWage", value);
                              calculateSalaryComponents("yearlyWage", value);
                            }}
                            placeholder="0"
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">/ Yearly</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="workingDays">No of working days in a week</Label>
                        <Input
                          id="workingDays"
                          type="number"
                          value={profileData.workingDaysPerWeek}
                          onChange={(e) => handleInputChange("workingDaysPerWeek", e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="breakTime">Break Time</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="breakTime"
                            type="number"
                            value={profileData.breakTimeHours}
                            onChange={(e) => handleInputChange("breakTimeHours", e.target.value)}
                            placeholder="0"
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">/hrs</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Salary Components */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Salary Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Basic Salary */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Basic Salary</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.basicSalary}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("basicSalary", value);
                                  calculateSalaryComponents("basicSalary", value);
                                  calculateFixedAllowance();
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.basicSalaryPercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("basicSalaryPercent", value);
                                calculateSalaryComponents("basicSalaryPercent", value);
                                calculateFixedAllowance();
                              }}
                              placeholder="0.00"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Define Basic salary from company cost compute it based on monthly Wages
                          </p>
                        </div>

                        {/* HRA */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label>House Rent Allowance (HRA)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.hra}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("hra", value);
                                  if (value && profileData.basicSalary) {
                                    const percent = ((parseFloat(value) / parseFloat(profileData.basicSalary)) * 100).toFixed(2);
                                    handleInputChange("hraPercent", percent);
                                  }
                                  calculateFixedAllowance();
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.hraPercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("hraPercent", value);
                                if (value && profileData.basicSalary) {
                                  const amount = ((parseFloat(value) / 100) * parseFloat(profileData.basicSalary)).toFixed(2);
                                  handleInputChange("hra", amount);
                                }
                                calculateFixedAllowance();
                              }}
                              placeholder="50.00"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            HRA provided to employees 50% of the basic salary
                          </p>
                        </div>

                        {/* Standard Allowance */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label>Standard Allowance</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.standardAllowance}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("standardAllowance", value);
                                  if (value && profileData.monthlyWage) {
                                    const percent = ((parseFloat(value) / parseFloat(profileData.monthlyWage)) * 100).toFixed(2);
                                    handleInputChange("standardAllowancePercent", percent);
                                  }
                                  calculateFixedAllowance();
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.standardAllowancePercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("standardAllowancePercent", value);
                                if (value && profileData.monthlyWage) {
                                  const amount = ((parseFloat(value) / 100) * parseFloat(profileData.monthlyWage)).toFixed(2);
                                  handleInputChange("standardAllowance", amount);
                                }
                                calculateFixedAllowance();
                              }}
                              placeholder="0.00"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            A standard allowance is a predetermined, fixed amount provided to employee as part of their salary
                          </p>
                        </div>

                        {/* Performance Bonus */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label>Performance Bonus</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.performanceBonus}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("performanceBonus", value);
                                  if (value && profileData.basicSalary) {
                                    const percent = ((parseFloat(value) / parseFloat(profileData.basicSalary)) * 100).toFixed(2);
                                    handleInputChange("performanceBonusPercent", percent);
                                  }
                                  calculateFixedAllowance();
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.performanceBonusPercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("performanceBonusPercent", value);
                                if (value && profileData.basicSalary) {
                                  const amount = ((parseFloat(value) / 100) * parseFloat(profileData.basicSalary)).toFixed(2);
                                  handleInputChange("performanceBonus", amount);
                                }
                                calculateFixedAllowance();
                              }}
                              placeholder="8.33"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary
                          </p>
                        </div>

                        {/* LTA */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label>Leave Travel Allowance (LTA)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.lta}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("lta", value);
                                  if (value && profileData.basicSalary) {
                                    const percent = ((parseFloat(value) / parseFloat(profileData.basicSalary)) * 100).toFixed(2);
                                    handleInputChange("ltaPercent", percent);
                                  }
                                  calculateFixedAllowance();
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.ltaPercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("ltaPercent", value);
                                if (value && profileData.basicSalary) {
                                  const amount = ((parseFloat(value) / 100) * parseFloat(profileData.basicSalary)).toFixed(2);
                                  handleInputChange("lta", amount);
                                }
                                calculateFixedAllowance();
                              }}
                              placeholder="8.33"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            LTA is paid by the company to employees to cover their travel expenses. and calculated as a % of the basic salary
                          </p>
                        </div>

                        {/* Fixed Allowance */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label>Fixed Allowance</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.fixedAllowance}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("fixedAllowance", value);
                                  if (value && profileData.monthlyWage) {
                                    const percent = ((parseFloat(value) / parseFloat(profileData.monthlyWage)) * 100).toFixed(2);
                                    handleInputChange("fixedAllowancePercent", percent);
                                  }
                                }}
                                placeholder="0.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Input
                              type="number"
                              step="0.01"
                              value={profileData.fixedAllowancePercent}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleInputChange("fixedAllowancePercent", value);
                                if (value && profileData.monthlyWage) {
                                  const amount = ((parseFloat(value) / 100) * parseFloat(profileData.monthlyWage)).toFixed(2);
                                  handleInputChange("fixedAllowance", amount);
                                }
                              }}
                              placeholder="0.00"
                              className="w-20 text-right"
                            />
                            <span className="text-sm ml-1">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            fixed allowance portion of wages is determined after calculating all salary components
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column: PF and Tax Deductions */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Provident Fund (PF) Contribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Employee PF */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Employee (PF)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={profileData.employeePF}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange("employeePF", value);
                                    if (value && profileData.basicSalary) {
                                      const percent = ((parseFloat(value) / parseFloat(profileData.basicSalary)) * 100).toFixed(2);
                                      handleInputChange("employeePFPercent", percent);
                                    }
                                  }}
                                  placeholder="0.00"
                                  className="w-32 text-right"
                                />
                                <span className="text-sm">₹ / month</span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.employeePFPercent}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("employeePFPercent", value);
                                  if (value && profileData.basicSalary) {
                                    const amount = ((parseFloat(value) / 100) * parseFloat(profileData.basicSalary)).toFixed(2);
                                    handleInputChange("employeePF", amount);
                                  }
                                }}
                                placeholder="12.00"
                                className="w-20 text-right"
                              />
                              <span className="text-sm ml-1">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              PF is calculated based on the basic salary
                            </p>
                          </div>

                          {/* Employer PF */}
                          <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between items-center">
                              <Label>Employer (PF)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={profileData.employerPF}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange("employerPF", value);
                                    if (value && profileData.basicSalary) {
                                      const percent = ((parseFloat(value) / parseFloat(profileData.basicSalary)) * 100).toFixed(2);
                                      handleInputChange("employerPFPercent", percent);
                                    }
                                  }}
                                  placeholder="0.00"
                                  className="w-32 text-right"
                                />
                                <span className="text-sm">₹ / month</span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.employerPFPercent}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleInputChange("employerPFPercent", value);
                                  if (value && profileData.basicSalary) {
                                    const amount = ((parseFloat(value) / 100) * parseFloat(profileData.basicSalary)).toFixed(2);
                                    handleInputChange("employerPF", amount);
                                  }
                                }}
                                placeholder="12.00"
                                className="w-20 text-right"
                              />
                              <span className="text-sm ml-1">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              PF is calculated based on the basic salary
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Tax Deductions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Professional Tax</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={profileData.professionalTax}
                                onChange={(e) => handleInputChange("professionalTax", e.target.value)}
                                placeholder="200.00"
                                className="w-32 text-right"
                              />
                              <span className="text-sm">₹ / month</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Professional Tax deducted from the Gross salary
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bank Details Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Bank Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                              id="accountNumber"
                              value={profileData.accountNumber}
                              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                              id="bankName"
                              value={profileData.bankName}
                              onChange={(e) => handleInputChange("bankName", e.target.value)}
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ifscCode">IFSC Code</Label>
                            <Input
                              id="ifscCode"
                              value={profileData.ifscCode}
                              onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                              placeholder="Enter IFSC code"
                            />
                          </div>
                          <div>
                            <Label htmlFor="panNo">PAN No</Label>
                            <Input
                              id="panNo"
                              value={profileData.panNo}
                              onChange={(e) => handleInputChange("panNo", e.target.value)}
                              placeholder="Enter PAN number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="uanNo">UAN No</Label>
                            <Input
                              id="uanNo"
                              value={profileData.uanNo}
                              onChange={(e) => handleInputChange("uanNo", e.target.value)}
                              placeholder="Enter UAN number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="empCode">Emp Code</Label>
                            <Input
                              id="empCode"
                              value={profileData.employeeId}
                              disabled
                              className="bg-muted cursor-not-allowed"
                              placeholder="Enter employee code"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

