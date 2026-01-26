// src/app/(app)/profile/page.tsx
'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Mail, Briefcase, Edit3, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { firebaseAuth } from '@/lib/firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});

type PasswordChangeFormInputs = z.infer<typeof passwordChangeSchema>;

export default function ProfilePage() {
  const { currentUser, firebaseUser } = useAuth();
  const { toast } = useToast();
  const [isPasswordUpdating, setIsPasswordUpdating] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetPasswordForm,
  } = useForm<PasswordChangeFormInputs>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onPasswordChangeSubmit: SubmitHandler<PasswordChangeFormInputs> = async (data) => {
    if (!firebaseUser || !firebaseUser.email) {
      toast({ title: "Error", description: "User not found or email missing.", variant: "destructive" });
      return;
    }
    setIsPasswordUpdating(true);
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, data.currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await firebaseUpdatePassword(firebaseUser, data.newPassword);
      toast({ title: "Password Updated", description: "Your password has been successfully updated." });
      resetPasswordForm();
    } catch (error: any) {
      console.error("Password update error:", error);
      let errorMessage = "Failed to update password.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect current password.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The new password is too weak.";
      }
      toast({ title: "Password Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Mock user data for display if currentUser isn't loaded fully
  const userProfileDisplay = {
    name: currentUser?.fullName || firebaseUser?.displayName || "User Name",
    email: currentUser?.email || firebaseUser?.email || "user@example.com",
    role: currentUser?.role || "N/A",
    program: currentUser?.role === 'Student' ? "Paramedic Program" : (currentUser?.role ? currentUser.role : "N/A"),
    avatarUrl: firebaseUser?.photoURL || "https://placehold.co/100x100.png",
    initials: currentUser?.fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || firebaseUser?.email?.[0].toUpperCase() || "U",
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <UserCog className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      </div>
      <p className="text-muted-foreground">
        View and manage your personal information and account settings.
      </p>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>Your details within the EMS Competency Tracker.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="mt-2 sm:mt-0" disabled>
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Soon)
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfileDisplay.avatarUrl} alt={userProfileDisplay.name} data-ai-hint="profile person" />
              <AvatarFallback>{userProfileDisplay.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{userProfileDisplay.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="mr-2 h-4 w-4" /> {userProfileDisplay.email}
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Briefcase className="mr-2 h-4 w-4" /> {userProfileDisplay.role} - {userProfileDisplay.program}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={userProfileDisplay.name} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={userProfileDisplay.email} disabled />
            </div>
             <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={userProfileDisplay.role} disabled />
            </div>
             <div className="space-y-1">
              <Label htmlFor="program">Program/Affiliation</Label>
              <Input id="program" defaultValue={userProfileDisplay.program} disabled />
            </div>
          </div>

          <form onSubmit={handleSubmit(onPasswordChangeSubmit)}>
            <h3 className="text-lg font-medium text-foreground mb-2 mt-6">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  {...register("currentPassword")}
                  className={errors.currentPassword ? 'border-destructive' : ''}
                />
                {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  {...register("newPassword")}
                  className={errors.newPassword ? 'border-destructive' : ''}
                />
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input 
                  id="confirmNewPassword" 
                  type="password" 
                  {...register("confirmNewPassword")}
                  className={errors.confirmNewPassword ? 'border-destructive' : ''}
                />
                {errors.confirmNewPassword && <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>}
              </div>
            </div>
             <Button type="submit" className="mt-4 bg-primary hover:bg-primary/90" disabled={isPasswordUpdating}>
              {isPasswordUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
