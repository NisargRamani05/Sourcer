"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { useRouter } from "next/navigation";
import { HrNavbar } from "@/components/HrNavbar";
import { useEffect } from "react";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useCurrentUserClient();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && user?.role !== "HR") {
      router.replace("/employee/dashboard");
    }
  }, [user, status, router]);

  if (status === "loading") return null;

  if (user?.role !== "HR") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <HrNavbar />
      <main className="max-w-7xl mx-auto py-8">{children}</main>
    </div>
  );
}
