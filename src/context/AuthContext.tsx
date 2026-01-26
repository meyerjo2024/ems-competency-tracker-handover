// src/context/AuthContext.tsx
'use client';

import * as React from 'react';
import { firebaseAuth, firestore } from '@/lib/firebase/config';
import { onAuthStateChanged, type User as FirebaseAuthUser, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, type Timestamp } from 'firebase/firestore';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseAuthUser | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const signOut = async () => {
    await firebaseSignOut(firebaseAuth);
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      setIsLoading(true);
      setError(null);
      
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(firestore, "users", fbUser.uid);
        try {
          console.log(`AuthContext: Firebase user ${fbUser.uid} authenticated. Attempting to fetch profile from Firestore path: users/${fbUser.uid}`);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userProfileData = userDocSnap.data() as Omit<UserProfile, 'id' | 'email'> & { createdAt: Timestamp };
            console.log("AuthContext: User profile found:", userProfileData);
            
            // Check if the user is approved (for Instructors)
            // Block unapproved instructors from system access
            if (userProfileData.role === 'Instructor' && userProfileData.approved !== true) {
              console.log('AuthContext: Unapproved instructor detected. Blocking access.');
              setError('Your instructor account is pending administrator approval. You will be notified once approved.');
              setCurrentUser(null);
              setFirebaseUser(null);
              // Sign out the unapproved instructor
              await firebaseSignOut(firebaseAuth);
              setIsLoading(false);
              return;
            }
            
            setCurrentUser({
              id: fbUser.uid,
              email: fbUser.email!, 
              fullName: userProfileData.fullName,
              role: userProfileData.role,
              approved: userProfileData.approved,
              createdAt: userProfileData.createdAt, 
              // Avatar removed - using initials in Header component instead
            });
          } else {
            console.warn(`AuthContext: No user profile found in Firestore for UID: ${fbUser.uid}`);
            setError('User profile not found. Please contact support.');
            setCurrentUser(null);
          }
        } catch (error: any) {
          console.error(`AuthContext: Error fetching user profile from Firestore for UID ${fbUser.uid}:`, error);
          setError('Failed to load user profile. Please try again.');
          setCurrentUser(null);
        }
      } else {
        console.log("AuthContext: No Firebase user found (logged out).");
        setFirebaseUser(null);
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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
