"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { AddEmployeeForm } from "@/components/auth/add-employee-form";
import { useState } from "react";
import { LogOut, Plus, Users, Building2, UserCircle, Phone, Mail, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HRDashboard() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.role !== "HR") {
    router.push("/employee/attendence");
    return null;
  }

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Reusable card style for consistency
  const cardStyles = "relative overflow-hidden rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-6 backdrop-blur-sm transition-all hover:border-[#CFCBC8]/20";
  const labelStyles = "text-xs font-medium text-[#CFCBC8]/50 uppercase tracking-wider mb-1";
  const valueStyles = "text-[#CFCBC8] font-medium flex items-center gap-2";

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black relative">
      
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-[#CFCBC8]/10 pb-8">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#CFCBC8]/20 shadow-[0_0_15px_-5px_rgba(207,203,200,0.3)]">
              {session?.image ? (
                <Image
                  src={session.image}
                  alt={session.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-[#CFCBC8]/50" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent">
                {session.companyName || "Organization"}
              </h1>
              <div className="flex items-center gap-2 text-[#CFCBC8]/60 mt-1">
                <Shield className="w-3 h-3" />
                <p className="text-sm font-medium">HR Administrator Portal</p>
              </div>
            </div>
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            className="border-[#CFCBC8]/30 text-[#CFCBC8] hover:bg-red-950/30 hover:text-red-400 hover:border-red-900 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= MAIN CONTENT (Left Col) ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Company Information */}
            <div className={cardStyles}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building2 className="w-24 h-24 text-[#CFCBC8]" />
              </div>
              
              <h2 className="text-xl font-semibold text-[#CFCBC8] mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#CFCBC8]/70" />
                Organization Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <p className={labelStyles}>Registered Name</p>
                  <p className="text-lg font-semibold text-white tracking-wide">{session.companyName}</p>
                </div>
                <div>
                  <p className={labelStyles}>Admin Contact</p>
                  <p className={valueStyles}>
                    <Mail className="w-3.5 h-3.5 opacity-50" />
                    {session.email}
                  </p>
                </div>
                <div>
                  <p className={labelStyles}>Direct Line</p>
                  <p className={valueStyles}>
                    <Phone className="w-3.5 h-3.5 opacity-50" />
                    {session.phoneNumber || "Not registered"}
                  </p>
                </div>
                <div>
                  <p className={labelStyles}>Account Status</p>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#CFCBC8]/10 border border-[#CFCBC8]/20 text-[#CFCBC8] text-xs font-bold uppercase tracking-widest">
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Employee Management */}
            <div className={cardStyles}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#CFCBC8]/10 pb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[#CFCBC8] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#CFCBC8]/70" />
                    Workforce Management
                    </h2>
                    <p className="text-sm text-[#CFCBC8]/50 mt-1">Manage access and onboarding for your team.</p>
                </div>
                
                <Button
                  onClick={() => setShowAddEmployee(!showAddEmployee)}
                  className={`border transition-all duration-300 ${
                    showAddEmployee 
                        ? "bg-transparent border-red-500/50 text-red-400 hover:bg-red-950/30" 
                        : "bg-[#CFCBC8] text-black border-[#CFCBC8] hover:bg-[#EAE8E6] shadow-[0_0_15px_-3px_rgba(207,203,200,0.3)]"
                  }`}
                >
                  <Plus className={`w-4 h-4 mr-2 transition-transform duration-300 ${showAddEmployee ? "rotate-45" : ""}`} />
                  {showAddEmployee ? "Cancel Action" : "Onboard Employee"}
                </Button>
              </div>

              <div className={`transition-all duration-500 ease-in-out ${showAddEmployee ? "opacity-100 translate-y-0" : "opacity-100"}`}>
                {showAddEmployee ? (
                  <div className="bg-black/40 rounded-xl border border-[#CFCBC8]/10 p-4 md:p-6">
                    <AddEmployeeForm />
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-[#CFCBC8]/10 rounded-xl bg-[#CFCBC8]/5">
                    <Users className="w-12 h-12 text-[#CFCBC8]/20 mx-auto mb-3" />
                    <p className="text-[#CFCBC8]/70 font-medium">No action selected</p>
                    <p className="text-sm text-[#CFCBC8]/40 mt-1 max-w-sm mx-auto">
                      Click the button above to open the employee registration form. Credentials will be auto-generated.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= SIDEBAR (Right Col) ================= */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className={cardStyles}>
              <h3 className="font-semibold text-white mb-6 border-l-2 border-[#CFCBC8] pl-3">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/auth/change-password" className="block">
                  <Button variant="outline" className="w-full justify-start border-[#CFCBC8]/20 text-[#CFCBC8] hover:bg-[#CFCBC8] hover:text-black transition-colors h-12">
                    <ShieldCheckIcon className="w-4 h-4 mr-3 opacity-70" />
                    Change Credentials
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#CFCBC8]/10 text-[#CFCBC8]/40 cursor-not-allowed hover:bg-transparent"
                  disabled
                >
                  <LayoutIcon className="w-4 h-4 mr-3" />
                  View Reports (Coming Soon)
                </Button>
              </div>
            </div>

            {/* Session Debug Info / Account */}
            <div className={`${cardStyles} bg-black/60`}>
              <h3 className="font-semibold text-white mb-4 border-l-2 border-[#CFCBC8] pl-3">Session Data</h3>
              <div className="space-y-4">
                <div>
                  <p className={labelStyles}>Current Role</p>
                  <div className="inline-flex items-center gap-2 text-[#CFCBC8]">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="font-bold">{session.role}</span>
                  </div>
                </div>
                <div>
                  <p className={labelStyles}>Session ID</p>
                  <p className="font-mono text-[10px] text-[#CFCBC8]/40 break-all bg-zinc-900 p-2 rounded border border-[#CFCBC8]/5">
                    {session.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper icons for the sidebar
function ShieldCheckIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
}

function LayoutIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="1" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
}