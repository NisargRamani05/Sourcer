"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function saveProfile(data: {
  name?: string;
  phoneNumber?: string;
  jobPosition?: string;
  department?: string;
  manager?: string;
  location?: string;
  dateOfBirth?: string;
  residingAddress?: string;
  nationality?: string;
  personalEmail?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfJoining?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  panNo?: string;
  uanNo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
  languages?: string;
  // Salary fields
  monthlyWage?: string;
  yearlyWage?: string;
  workingDaysPerWeek?: string;
  breakTimeHours?: string;
  basicSalary?: string;
  basicSalaryPercent?: string;
  hra?: string;
  hraPercent?: string;
  standardAllowance?: string;
  standardAllowancePercent?: string;
  performanceBonus?: string;
  performanceBonusPercent?: string;
  lta?: string;
  ltaPercent?: string;
  fixedAllowance?: string;
  fixedAllowancePercent?: string;
  employeePF?: string;
  employeePFPercent?: string;
  employerPF?: string;
  employerPFPercent?: string;
  professionalTax?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // First, verify the user exists
    const existingUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true },
    });

    if (!existingUser) {
      return { error: "User not found. Please log in again." };
    }

    // Parse date strings to DateTime (only if not empty)
    const dateOfBirth = data.dateOfBirth && data.dateOfBirth.trim() !== "" 
      ? new Date(data.dateOfBirth) 
      : null;
    const dateOfJoining = data.dateOfJoining && data.dateOfJoining.trim() !== "" 
      ? new Date(data.dateOfJoining) 
      : null;

    // Validate dates
    if (dateOfBirth && isNaN(dateOfBirth.getTime())) {
      return { error: "Invalid date of birth format" };
    }
    if (dateOfJoining && isNaN(dateOfJoining.getTime())) {
      return { error: "Invalid date of joining format" };
    }

    // Only update name if it's provided and not empty
    // If name is empty, don't update it (keep existing name from database)
    const updateData: any = {};
    if (data.name !== undefined && data.name.trim() !== "") {
      updateData.name = data.name.trim();
    }
    // If name is empty or undefined, we don't include it in the update
    // This way the existing name in the database is preserved

    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...updateData,
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber || null }),
        ...(data.jobPosition !== undefined && { jobPosition: data.jobPosition || null }),
        ...(data.department !== undefined && { department: data.department || null }),
        ...(data.manager !== undefined && { manager: data.manager || null }),
        ...(data.location !== undefined && { location: data.location || null }),
        ...(data.dateOfBirth !== undefined && { dateOfBirth: dateOfBirth }),
        ...(data.residingAddress !== undefined && { residingAddress: data.residingAddress || null }),
        ...(data.nationality !== undefined && { nationality: data.nationality || null }),
        ...(data.personalEmail !== undefined && { personalEmail: data.personalEmail || null }),
        ...(data.gender !== undefined && { gender: data.gender || null }),
        ...(data.maritalStatus !== undefined && { maritalStatus: data.maritalStatus || null }),
        ...(data.dateOfJoining !== undefined && { dateOfJoining: dateOfJoining }),
        ...(data.accountNumber !== undefined && { accountNumber: data.accountNumber || null }),
        ...(data.bankName !== undefined && { bankName: data.bankName || null }),
        ...(data.ifscCode !== undefined && { ifscCode: data.ifscCode || null }),
        ...(data.panNo !== undefined && { panNo: data.panNo || null }),
        ...(data.uanNo !== undefined && { uanNo: data.uanNo || null }),
        ...(data.emergencyContactName !== undefined && { emergencyContactName: data.emergencyContactName || null }),
        ...(data.emergencyContactPhone !== undefined && { emergencyContactPhone: data.emergencyContactPhone || null }),
        ...(data.emergencyContactRelation !== undefined && { emergencyContactRelation: data.emergencyContactRelation || null }),
        ...(data.skills !== undefined && { skills: data.skills || null }),
        ...(data.experience !== undefined && { experience: data.experience || null }),
        ...(data.education !== undefined && { education: data.education || null }),
        ...(data.certifications !== undefined && { certifications: data.certifications || null }),
        ...(data.languages !== undefined && { languages: data.languages || null }),
        // Salary fields
        ...(data.monthlyWage !== undefined && { monthlyWage: data.monthlyWage ? parseFloat(data.monthlyWage) : null }),
        ...(data.yearlyWage !== undefined && { yearlyWage: data.yearlyWage ? parseFloat(data.yearlyWage) : null }),
        ...(data.workingDaysPerWeek !== undefined && { workingDaysPerWeek: data.workingDaysPerWeek ? parseInt(data.workingDaysPerWeek) : null }),
        ...(data.breakTimeHours !== undefined && { breakTimeHours: data.breakTimeHours ? parseFloat(data.breakTimeHours) : null }),
        ...(data.basicSalary !== undefined && { basicSalary: data.basicSalary ? parseFloat(data.basicSalary) : null }),
        ...(data.basicSalaryPercent !== undefined && { basicSalaryPercent: data.basicSalaryPercent ? parseFloat(data.basicSalaryPercent) : null }),
        ...(data.hra !== undefined && { hra: data.hra ? parseFloat(data.hra) : null }),
        ...(data.hraPercent !== undefined && { hraPercent: data.hraPercent ? parseFloat(data.hraPercent) : null }),
        ...(data.standardAllowance !== undefined && { standardAllowance: data.standardAllowance ? parseFloat(data.standardAllowance) : null }),
        ...(data.standardAllowancePercent !== undefined && { standardAllowancePercent: data.standardAllowancePercent ? parseFloat(data.standardAllowancePercent) : null }),
        ...(data.performanceBonus !== undefined && { performanceBonus: data.performanceBonus ? parseFloat(data.performanceBonus) : null }),
        ...(data.performanceBonusPercent !== undefined && { performanceBonusPercent: data.performanceBonusPercent ? parseFloat(data.performanceBonusPercent) : null }),
        ...(data.lta !== undefined && { lta: data.lta ? parseFloat(data.lta) : null }),
        ...(data.ltaPercent !== undefined && { ltaPercent: data.ltaPercent ? parseFloat(data.ltaPercent) : null }),
        ...(data.fixedAllowance !== undefined && { fixedAllowance: data.fixedAllowance ? parseFloat(data.fixedAllowance) : null }),
        ...(data.fixedAllowancePercent !== undefined && { fixedAllowancePercent: data.fixedAllowancePercent ? parseFloat(data.fixedAllowancePercent) : null }),
        ...(data.employeePF !== undefined && { employeePF: data.employeePF ? parseFloat(data.employeePF) : null }),
        ...(data.employeePFPercent !== undefined && { employeePFPercent: data.employeePFPercent ? parseFloat(data.employeePFPercent) : null }),
        ...(data.employerPF !== undefined && { employerPF: data.employerPF ? parseFloat(data.employerPF) : null }),
        ...(data.employerPFPercent !== undefined && { employerPFPercent: data.employerPFPercent ? parseFloat(data.employerPFPercent) : null }),
        ...(data.professionalTax !== undefined && { professionalTax: data.professionalTax ? parseFloat(data.professionalTax) : null }),
      },
    });

    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error saving profile:", error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return { error: `Failed to save profile: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}

