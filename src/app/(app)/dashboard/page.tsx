// src/app/(app)/dashboard/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      // Redirect to role-specific dashboard
      if (currentUser.role === 'Student') {
        router.replace('/dashboard/student');
      } else if (currentUser.role === 'Instructor') {
        router.replace('/dashboard/instructor');
      } else if (currentUser.role === 'Administrator') {
        // For MVP, admins go to instructor dashboard (or create admin dashboard)
        router.replace('/dashboard/instructor');
      }
    } else if (!isLoading && !currentUser) {
      // This should be handled by ProtectedRoute, but just in case
      router.replace('/login');
    }
  }, [currentUser, isLoading, router]);

  // Show loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
