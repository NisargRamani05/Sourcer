"use client";

import { useCurrentUserClient } from "@/hook/use-current-user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Users,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { user: session, status } = useCurrentUserClient();
  const router = useRouter();

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#CFCBC8]">
        Loading Sourcer...
      </div>
    );
  }

  // Redirect logged-in users
  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-[#CFCBC8]">
      {/* ================= HEADER ================= */}
      <header className="border-b border-[#CFCBC8]/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Sourcer</h1>

          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-[#CFCBC8]/80 hover:text-[#CFCBC8]"
            >
              Login
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#CFCBC8] text-black hover:bg-[#CFCBC8]/90">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Modern HR Management <br /> Built for Growing Teams
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-[#CFCBC8]/70 text-lg">
          <strong>Sourcer</strong> helps organizations manage employees,
          authentication, roles, and company data securely — all in one
          professional platform.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link href="/auth/signup">
            <Button className="bg-[#CFCBC8] text-black px-8 hover:bg-[#CFCBC8]/90">
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/auth/login">
            <Button
              variant="outline"
              className="border-[#CFCBC8] text-[#CFCBC8] px-8 hover:bg-[#CFCBC8] hover:text-black"
            >
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-black/80 border-t border-[#CFCBC8]/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-14">
            Why Choose Sourcer?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Secure Authentication"
              description="Role-based authentication for Admins and Employees with strong security practices."
            />

            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Employee Management"
              description="Centralized employee profiles with personal and company details."
            />

            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Enterprise Ready"
              description="Built for scalability, reliability, and professional HR workflows."
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 border-t border-[#CFCBC8]/20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">
            How Sourcer Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <Step number="1" title="Create Account">
              Sign up as an Admin or Employee in seconds.
            </Step>

            <Step number="2" title="Manage Access">
              Securely control roles, permissions, and credentials.
            </Step>

            <Step number="3" title="Work Smarter">
              Access dashboards, company data, and employee tools.
            </Step>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#CFCBC8] text-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">
            Ready to simplify HR management?
          </h3>

          <p className="mt-4 text-black/70">
            Join companies using Sourcer to manage their workforce
            efficiently and securely.
          </p>

          <div className="mt-8">
            <Link href="/auth/signup">
              <Button className="bg-black text-[#CFCBC8] px-10 hover:bg-black/90">
                Get Started with Sourcer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#CFCBC8]/20 py-8 text-center text-sm text-[#CFCBC8]/50">
        © {new Date().getFullYear()} Sourcer. All rights reserved.
      </footer>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-[#CFCBC8]/20 rounded-lg p-6 bg-black/60">
      <div className="mb-4 text-[#CFCBC8]">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-[#CFCBC8]/60">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-3xl font-bold mb-3">{number}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-[#CFCBC8]/60">{children}</p>
    </div>
  );
}
