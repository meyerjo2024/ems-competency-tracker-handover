"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (!isLoading && currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If user is logged in, show loading while redirecting
  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  // User is not logged in, show landing page
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6 md:px-8 md:py-10">
      <div className="w-full max-w-7xl flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          Welcome to EMS Competency Tracker
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          A modern platform for EMS students and instructors to track clinical skills, manage shifts, and monitor progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
