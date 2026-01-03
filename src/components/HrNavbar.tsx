"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUserClient } from "@/hook/use-current-user";
import { signOut } from "next-auth/react";

export function HrNavbar() {
  const pathname = usePathname();
  const { user, status } = useCurrentUserClient();

  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<string | null>(null);

  if (status === "loading") return null;

  const handleToggleAttendance = () => {
    if (!isCheckedIn) {
      setCheckInTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      setCheckInTime(null);
    }
    setIsCheckedIn(!isCheckedIn);
  };

  const navLinks = [
    // { name: "Dashboard", href: "/hr/dashboard" },
    { name: "Employees", href: "/hr/employees" },
    { name: "Attendance", href: "/hr/attendance" },
    { name: "Time Off", href: "/hr/time-off" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#CFCBC8]/10 bg-black/80 backdrop-blur-md">
      {/* CHANGED: Replaced 'container' with 'max-w-7xl' to match your dashboard width */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* ================= LEFT: Logo & Nav ================= */}
        <div className="flex items-center gap-10">
          <Link
            href="/hr/dashboard"
            className="flex items-center gap-2 group"
          >
            {/* <div className="h-8 w-8 bg-gradient-to-br from-[#CFCBC8] to-[#555] rounded-lg flex items-center justify-center shadow-[0_0_10px_-2px_rgba(207,203,200,0.3)] group-hover:shadow-[0_0_15px_-2px_rgba(207,203,200,0.5)] transition-all">
              <span className="font-bold text-black text-sm">HR</span>
            </div> */}
            <span className="hidden sm:inline-block font-bold tracking-wide text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#CFCBC8] to-[#999]">
              {user?.companyName || "sourcer"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
                    isActive 
                      ? "text-[#CFCBC8] bg-[#CFCBC8]/10" 
                      : "text-[#CFCBC8]/60 hover:text-[#CFCBC8] hover:bg-[#CFCBC8]/5"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CFCBC8] shadow-[0_0_8px_rgba(207,203,200,0.5)] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: Actions ================= */}
        <div className="flex items-center gap-6">
          
          {/* Check in / out Widget */}
          <div className="hidden sm:flex items-center gap-4 pr-6 border-r border-[#CFCBC8]/10">
            <div className="flex flex-col items-end">
              {isCheckedIn && (
                <span className="text-[10px] text-[#CFCBC8]/50 uppercase font-semibold tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Since {checkInTime}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isCheckedIn && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isCheckedIn ? "bg-green-500" : "bg-red-500"
                  )}></span>
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  isCheckedIn ? "text-[#CFCBC8]" : "text-[#CFCBC8]/60"
                )}>
                  {isCheckedIn ? "Active" : "Offline"}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              className={cn(
                "h-9 px-4 gap-2 font-semibold transition-all duration-300",
                isCheckedIn 
                  ? "bg-transparent border border-red-500/50 text-red-400 hover:bg-red-950/30 hover:border-red-500" 
                  : "bg-[#CFCBC8] text-black border border-[#CFCBC8] hover:bg-[#EAE8E6] shadow-[0_0_10px_-2px_rgba(207,203,200,0.3)]"
              )}
              onClick={handleToggleAttendance}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
              <ArrowRight className={cn("w-3.5 h-3.5 transition-transform duration-300", !isCheckedIn && "group-hover:translate-x-1")} />
            </Button>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 border border-[#CFCBC8]/20 hover:border-[#CFCBC8]/50 hover:bg-[#CFCBC8]/5 transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback className="bg-[#CFCBC8] text-black font-bold">
                    {user?.name?.charAt(0) ?? "H"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 bg-black border border-[#CFCBC8]/20 text-[#CFCBC8] p-2" align="end">
              <div className="flex items-center gap-3 p-2 mb-1">
                <div className="h-10 w-10 rounded-full bg-[#CFCBC8]/10 flex items-center justify-center border border-[#CFCBC8]/10">
                   <ShieldCheck className="w-5 h-5 text-[#CFCBC8]" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className="text-xs text-[#CFCBC8]/50 truncate max-w-[140px]">{user?.email}</p>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-[#CFCBC8]/10" />

              <DropdownMenuItem asChild className="focus:bg-[#CFCBC8]/10 focus:text-white cursor-pointer rounded-md my-1">
                <Link href="/profile" className="flex items-center py-2.5">
                  <User className="mr-3 h-4 w-4 opacity-70" />
                  My Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#CFCBC8]/10" />

              <DropdownMenuItem
                className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer rounded-md py-2.5"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}