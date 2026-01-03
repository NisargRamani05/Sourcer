"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  LogOut, 
  Lock, 
  AlertCircle, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Shield, 
  KeyRound, 
  Fingerprint 
} from "lucide-react";
import Image from "next/image";

export default function EmployeeDashboard() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.role !== "EMPLOYEE") {
    router.push("/hr/employees");
    return null;
  }

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // --- UI CONSTANTS ---
  const cardStyles = "relative overflow-hidden rounded-2xl border border-[#CFCBC8]/10 bg-zinc-900/30 p-6 backdrop-blur-sm transition-all hover:border-[#CFCBC8]/20";
  const labelStyles = "text-xs font-medium text-[#CFCBC8]/50 uppercase tracking-wider mb-1";
  const valueStyles = "text-[#CFCBC8] font-medium flex items-center gap-2";

  return (
    <div className="min-h-screen bg-black text-[#CFCBC8] selection:bg-[#CFCBC8] selection:text-black relative">
      
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#cfcbc80a_1px,transparent_1px),linear-gradient(to_bottom,#cfcbc80a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CFCBC8] opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-[#CFCBC8]/10 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#CFCBC8] to-[#999] bg-clip-text text-transparent mb-2">
              Employee Portal
            </h1>
            <p className="text-[#CFCBC8]/60 flex items-center gap-2">
              Welcome back, <span className="font-semibold text-[#CFCBC8]">{session.name}</span>
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-[#CFCBC8]/30 text-[#CFCBC8] hover:bg-red-950/30 hover:text-red-400 hover:border-red-900 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="space-y-8">
          
          {/* ================= ALERT: PASSWORD CHANGE ================= */}
          {!session.isPasswordChanged && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-6 relative overflow-hidden group animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
              <div className="flex gap-5 items-start relative z-10">
                <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-200 text-lg mb-1">
                    Security Action Required
                  </h3>
                  <p className="text-amber-200/60 mb-4 max-w-2xl leading-relaxed text-sm">
                    This appears to be your first login. To ensure the security of your account and organization data, please update your password immediately.
                  </p>
                  <Link href="/change-password">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold border-none shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]">
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* ================= LEFT COLUMN ================= */}
             <div className="space-y-8">
                
                {/* Personal Information */}
                <div className={cardStyles}>
                    <h2 className="text-xl font-semibold text-[#CFCBC8] mb-6 flex items-center gap-2 pb-4 border-b border-[#CFCBC8]/10">
                        <User className="w-5 h-5 text-[#CFCBC8]/70" />
                        My Profile
                    </h2>
                    
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className={labelStyles}>Full Name</p>
                                <p className="text-lg font-semibold text-white tracking-wide">{session.name}</p>
                            </div>
                            <div>
                                <p className={labelStyles}>Employee ID</p>
                                <p className="font-mono text-sm bg-[#CFCBC8]/5 p-1 px-2 rounded inline-block text-[#CFCBC8] border border-[#CFCBC8]/10">
                                    {session.employeeId || "N/A"}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <p className={labelStyles}>Contact Email</p>
                            <p className={valueStyles}>
                                <Mail className="w-3.5 h-3.5 opacity-50" />
                                {session.email}
                            </p>
                        </div>
                        
                        <div>
                            <p className={labelStyles}>Mobile Number</p>
                            <p className={valueStyles}>
                                <Phone className="w-3.5 h-3.5 opacity-50" />
                                {session.phoneNumber || "Not registered"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Security Actions */}
                <div className={cardStyles}>
                    <h2 className="text-xl font-semibold text-[#CFCBC8] mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#CFCBC8]/70" />
                        Security Settings
                    </h2>
                    <div className="space-y-3">
                        <Link href="/change-password" className="block">
                            <Button variant="outline" className="w-full justify-start border-[#CFCBC8]/20 text-[#CFCBC8] hover:bg-[#CFCBC8] hover:text-black transition-all h-12 group">
                                <KeyRound className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100" />
                                Change Password
                            </Button>
                        </Link>
                        
                        <div className="mt-4 pt-4 border-t border-[#CFCBC8]/10 flex items-center justify-between">
                             <span className="text-sm text-[#CFCBC8]/50">Password Status</span>
                             <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                session.isPasswordChanged 
                                    ? "bg-green-900/20 text-green-400 border-green-900/50" 
                                    : "bg-amber-900/20 text-amber-400 border-amber-900/50"
                             }`}>
                                {session.isPasswordChanged ? "SECURE" : "DEFAULT"}
                             </span>
                        </div>
                    </div>
                </div>
             </div>

             {/* ================= RIGHT COLUMN ================= */}
             <div className="space-y-8">
                
                {/* Organization Info */}
                <div className={cardStyles}>
                    <h2 className="text-xl font-semibold text-[#CFCBC8] mb-6 flex items-center gap-2 pb-4 border-b border-[#CFCBC8]/10">
                        <Building2 className="w-5 h-5 text-[#CFCBC8]/70" />
                        Organization
                    </h2>
                    
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="relative h-24 w-24 mb-4 rounded-xl overflow-hidden border border-[#CFCBC8]/20 bg-black shadow-lg">
                            {session.image ? (
                                <Image
                                    src={session.image}
                                    alt={session.companyName || "Logo"}
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-zinc-900">
                                    <Building2 className="w-8 h-8 text-[#CFCBC8]/20" />
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-1">{session.companyName}</h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFCBC8]/5 border border-[#CFCBC8]/10 text-xs font-medium text-[#CFCBC8]/60 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Verified Workspace
                        </div>
                    </div>
                </div>

                {/* Session Data (Technical) */}
                <div className={`${cardStyles} bg-black/60`}>
                    <h2 className="text-sm font-semibold text-[#CFCBC8]/70 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" />
                        Session Data
                    </h2>
                    <div className="space-y-4 text-xs font-mono">
                        <div className="flex justify-between items-center border-b border-[#CFCBC8]/5 pb-2">
                            <span className="text-[#CFCBC8]/40">Role</span>
                            <span className="text-[#CFCBC8]">{session.role}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[#CFCBC8]/40">User ID</span>
                            <span className="text-[#CFCBC8]/60 break-all">{session.id}</span>
                        </div>
                        {/* Company ID removed as per request */}
                    </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}