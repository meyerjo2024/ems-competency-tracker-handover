// src/app/(auth)/forgot-password/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailQuestion, KeyRound, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseAuth } from '@/lib/firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState(false);
  const [sentEmail, setSentEmail] = React.useState<string>('');
  const [canResend, setCanResend] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Mask email for display (e.g., test@example.com -> t***t@example.com)
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    const masked = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
    return `${masked}@${domain}`;
  };

  // Timer for resend cooldown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      return true; // Still return true for security (don't reveal if email exists)
    }
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    setMessageSent(false);
    
    const success = await sendResetEmail(data.email);
    
    if (success) {
      toast({
        title: 'Password Reset Email Sent',
        description: 'If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).',
      });
      setSentEmail(data.email);
      setMessageSent(true);
      setCanResend(false);
      setResendTimer(60); // 60 second cooldown
    }
    
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend || !sentEmail) return;
    
    setIsLoading(true);
    const success = await sendResetEmail(sentEmail);
    
    if (success) {
      toast({
        title: 'Email Resent',
        description: 'We\'ve sent another password reset link to your email.',
      });
      setCanResend(false);
      setResendTimer(60); // Reset cooldown
    }
    
    setIsLoading(false);
  };

  return (
    <Card className={`w-full max-w-md shadow-xl ${messageSent ? 'border-green-200 border-2' : ''}`}>
      <CardHeader className="space-y-1 text-center">
        {messageSent ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        ) : (
          <KeyRound className="mx-auto h-10 w-10 text-primary" />
        )}
        <CardTitle className="text-2xl font-bold">
          {messageSent ? 'Check Your Email!' : 'Forgot Password?'}
        </CardTitle>
        <CardDescription>
          {messageSent 
            ? "We've sent password reset instructions to your email address."
            : "No worries! Enter your email below and we'll send you a link to reset your password."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!messageSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MailQuestion className="mr-2 h-4 w-4" />
              )}
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-green-900">
                    Email sent to: <span className="font-mono">{maskEmail(sentEmail)}</span>
                  </p>
                  <p className="text-sm text-green-700">
                    Please check your inbox (and spam/junk folder) for the password reset link. The link will expire in 1 hour.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
              {resendTimer > 0 ? (
                <p className="text-xs text-muted-foreground">
                  You can resend in <span className="font-semibold">{resendTimer}</span> seconds
                </p>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Resend Email
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Link href="/login">
          <Button variant="link" className="text-sm">
            Back to Login
          </Button>
        </Link>
        {messageSent && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setMessageSent(false);
              setSentEmail('');
              setCanResend(false);
              setResendTimer(0);
            }}
            className="text-xs"
          >
            Try a different email
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
