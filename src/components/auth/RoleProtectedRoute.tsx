// src/components/auth/RoleProtectedRoute.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'Student' | 'Instructor' | 'Administrator'>;
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    const dashboardPath = currentUser?.role === 'Student' 
      ? '/dashboard/student' 
      : currentUser?.role === 'Instructor'
      ? '/dashboard/instructor'
      : '/dashboard';

    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              You do not have permission to view this page. This area is restricted to {allowedRoles.join(', ')} users only.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4">
            <Button asChild variant="default">
              <Link href={dashboardPath}>
                Go to My Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shifts">
                View Shifts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

