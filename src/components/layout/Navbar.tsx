'use client';

import * as React from 'react';
import Link from 'next/link';
import { Stethoscope, UserCircle, LogIn, UserPlus, LogOut, Loader2, MailWarning, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/config';

export function Navbar() {
  const { currentUser, firebaseUser, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isResendingEmail, setIsResendingEmail] = React.useState(false);

  const isEmailVerified = Boolean(firebaseUser?.email_confirmed_at);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch {
      toast({
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
        variant: 'destructive',
      });
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!firebaseUser?.email) {
      toast({
        title: 'Error',
        description: 'You must be logged in to resend a verification email.',
        variant: 'destructive',
      });
      return;
    }

    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: firebaseUser.email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Verification Email Sent',
        description: 'A new verification email has been sent to your address. Please check your inbox (and spam folder).',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Resend Email',
        description: error.message || 'An error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block text-foreground">EMS Competency Tracker</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : currentUser && firebaseUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">User Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {currentUser.fullName || firebaseUser.email}
                    {currentUser.role && <span className="block text-xs text-muted-foreground font-normal">{currentUser.role}</span>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isEmailVerified && (
                    <>
                      <DropdownMenuItem className="text-yellow-600 focus:bg-yellow-100 focus:text-yellow-700" disabled>
                        <MailWarning className="mr-2 h-4 w-4" /> Email not verified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleResendVerificationEmail} disabled={isResendingEmail}>
                        {isResendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4" />}
                        Resend Verification
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      {!isLoading && currentUser && firebaseUser && !isEmailVerified && (
        <div className="container px-4 sm:px-6 lg:px-8 py-2">
          <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700 [&>svg]:text-yellow-600">
            <MailWarning className="h-4 w-4" />
            <AlertTitle>Verify Your Email Address</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              Please check your inbox for a verification email. If you didn't receive it, you can resend it.
              <Button variant="link" onClick={handleResendVerificationEmail} disabled={isResendingEmail} className="mt-2 sm:mt-0 sm:ml-4 text-yellow-700 hover:text-yellow-800 px-0">
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
