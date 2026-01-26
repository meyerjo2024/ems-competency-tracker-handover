// src/components/auth/AccessDenied.tsx
'use client';

import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function AccessDenied() {
  const { currentUser } = useAuth();

  const dashboardPath = currentUser?.role === 'Student' 
    ? '/dashboard/student' 
    : currentUser?.role === 'Instructor'
    ? '/dashboard/instructor'
    : '/dashboard';

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <ShieldAlert className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-base mt-2">
              You don't have permission to view this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Restricted Area</AlertTitle>
              <AlertDescription>
                This page is restricted and requires specific permissions. 
                If you believe you should have access, please contact your administrator.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                You can return to your dashboard or explore other areas of the application.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href={dashboardPath}>
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/shifts">
                  View Shifts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

