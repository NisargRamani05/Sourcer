"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function loadProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
        jobPosition: true,
        department: true,
        manager: true,
        location: true,
        dateOfBirth: true,
        residingAddress: true,
        nationality: true,
        personalEmail: true,
        gender: true,
        maritalStatus: true,
        dateOfJoining: true,
        accountNumber: true,
        bankName: true,
        ifscCode: true,
        panNo: true,
        uanNo: true,
        employeeId: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
        skills: true,
        experience: true,
        education: true,
        certifications: true,
        languages: true,
        resumeFile: true,
        // Salary fields
        monthlyWage: true,
        yearlyWage: true,
        workingDaysPerWeek: true,
        breakTimeHours: true,
        basicSalary: true,
        basicSalaryPercent: true,
        hra: true,
        hraPercent: true,
        standardAllowance: true,
        standardAllowancePercent: true,
        performanceBonus: true,
        performanceBonusPercent: true,
        lta: true,
        ltaPercent: true,
        fixedAllowance: true,
        fixedAllowancePercent: true,
        employeePF: true,
        employeePFPercent: true,
        employerPF: true,
        employerPFPercent: true,
        professionalTax: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Format dates to strings for form inputs
    return {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      jobPosition: user.jobPosition || "",
      department: user.department || "",
      manager: user.manager || "",
      location: user.location || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : "",
      residingAddress: user.residingAddress || "",
      nationality: user.nationality || "",
      personalEmail: user.personalEmail || "",
      gender: user.gender || "",
      maritalStatus: user.maritalStatus || "",
      dateOfJoining: user.dateOfJoining ? user.dateOfJoining.toISOString().split("T")[0] : "",
      accountNumber: user.accountNumber || "",
      bankName: user.bankName || "",
      ifscCode: user.ifscCode || "",
      panNo: user.panNo || "",
      uanNo: user.uanNo || "",
      employeeId: user.employeeId || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      emergencyContactRelation: user.emergencyContactRelation || "",
      skills: user.skills || "",
      experience: user.experience || "",
      education: user.education || "",
      certifications: user.certifications || "",
      languages: user.languages || "",
      resumeFile: user.resumeFile || "",
      // Salary fields
      monthlyWage: user.monthlyWage?.toString() || "",
      yearlyWage: user.yearlyWage?.toString() || "",
      workingDaysPerWeek: user.workingDaysPerWeek?.toString() || "",
      breakTimeHours: user.breakTimeHours?.toString() || "",
      basicSalary: user.basicSalary?.toString() || "",
      basicSalaryPercent: user.basicSalaryPercent?.toString() || "",
      hra: user.hra?.toString() || "",
      hraPercent: user.hraPercent?.toString() || "",
      standardAllowance: user.standardAllowance?.toString() || "",
      standardAllowancePercent: user.standardAllowancePercent?.toString() || "",
      performanceBonus: user.performanceBonus?.toString() || "",
      performanceBonusPercent: user.performanceBonusPercent?.toString() || "",
      lta: user.lta?.toString() || "",
      ltaPercent: user.ltaPercent?.toString() || "",
      fixedAllowance: user.fixedAllowance?.toString() || "",
      fixedAllowancePercent: user.fixedAllowancePercent?.toString() || "",
      employeePF: user.employeePF?.toString() || "",
      employeePFPercent: user.employeePFPercent?.toString() || "",
      employerPF: user.employerPF?.toString() || "",
      employerPFPercent: user.employerPFPercent?.toString() || "",
      professionalTax: user.professionalTax?.toString() || "",
    };
  } catch (error) {
    console.error("Error loading profile:", error);
    return { error: "Failed to load profile" };
  }
}

