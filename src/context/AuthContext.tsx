'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase/config';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import { toAppRole } from '@/lib/supabase/mappers';

interface AuthContextValue {
  currentUser: UserProfile | null;
  firebaseUser: SupabaseAuthUser | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  approved: boolean | null;
  created_at: string | null;
};

function mapUserProfile(authUser: SupabaseAuthUser, row: UserRow): UserProfile {
  return {
    id: authUser.id,
    email: row.email ?? authUser.email ?? '',
    fullName: row.full_name ?? authUser.user_metadata?.full_name ?? 'User',
    role: toAppRole(row.role),
    approved: row.approved ?? true,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<SupabaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  React.useEffect(() => {
    let mounted = true;

    const hydrateUser = async (authUser: SupabaseAuthUser | null) => {
      if (!mounted) return;

      setError(null);

      if (!authUser) {
        setFirebaseUser(null);
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      setFirebaseUser(authUser);

      const { data, error: profileError } = await supabase
        .from('users')
        .select('id, full_name, email, role, approved, created_at')
        .eq('id', authUser.id)
        .single<UserRow>();

      if (profileError || !data) {
        setError('User profile not found. Please contact support.');
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      const profile = mapUserProfile(authUser, data);

      if (profile.role === 'Instructor' && profile.approved !== true) {
        setError('Your instructor account is pending administrator approval. You will be notified once approved.');
        setCurrentUser(null);
        setFirebaseUser(null);
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      setCurrentUser(profile);
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      hydrateUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      hydrateUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = { currentUser, firebaseUser, isLoading, error, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
