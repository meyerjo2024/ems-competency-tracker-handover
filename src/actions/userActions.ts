// src/actions/userActions.ts
'use client';

import { firestore } from '@/lib/firebase/config';
import { collection, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/types';

/**
 * Update a user's approval status
 * Only admins should call this function (enforced by Firestore rules)
 */
export async function updateUserApproval(
  userId: string,
  approved: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { approved });

    console.log(`Updated user ${userId} approval status to: ${approved}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user approval:', error);
    return {
      success: false,
      error: error.message || 'Failed to update approval status',
    };
  }
}

/**
 * Get all users from Firestore
 * Returns users sorted by creation date (newest first)
 */
export async function getAllUsers(): Promise<{
  success: boolean;
  data?: UserProfile[];
  error?: string;
}> {
  try {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        fullName: data.fullName || '',
        email: data.email || '',
        role: data.role || 'Student',
        approved: data.approved ?? true, // Default to true if not set
        createdAt: data.createdAt,
      });
    });

    console.log(`Fetched ${users.length} users from Firestore`);
    return { success: true, data: users };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
    };
  }
}

