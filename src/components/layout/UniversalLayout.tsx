"use client";
import { Header } from './Header';
import { Footer } from './Footer';
import { usePathname } from 'next/navigation';

export function UniversalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define public pages (no header/footer)
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  
  // Center vertically for auth/landing, top-align for app pages
  const isCentered = isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Only show header on authenticated pages */}
      {!isPublicPage && <Header />}
      
      <main
        className={`flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-8
          ${isCentered ? 'justify-center min-h-[70vh]' : ''}`}
      >
        {children}
      </main>
      
      {/* Only show footer on authenticated pages */}
      {!isPublicPage && <Footer />}
    </div>
  );
} 