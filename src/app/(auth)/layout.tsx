// src/app/(auth)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - EMS Competency Tracker',
  description: 'Login or Register for the EMS Competency Tracker.',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6 md:px-8 md:py-10">
      <div className="w-full max-w-7xl flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
