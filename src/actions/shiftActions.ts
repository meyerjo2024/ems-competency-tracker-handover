// src/actions/shiftActions.ts
// NOTE: These are NOT server actions - they run on the client to preserve auth context
// Server actions don't have access to Firebase Auth tokens

import { firestore } from '@/lib/firebase/config';
import type { Shift, FirestoreShift, ClientShift } from '@/types';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { transformShiftToClient, transformShiftsToClient } from '@/types';

interface CreateShiftInput extends Omit<Shift, 'id' | 'createdAt' | 'updatedAt' | 'instructorId' | 'bookedCount'> {}

interface UpdateShiftInput extends Partial<CreateShiftInput> {}

export async function createShift(
  shiftData: CreateShiftInput,
  instructorId: string
): Promise<{ success: boolean; shiftId?: string; error?: string }> {
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required.' };
  }

  try {
    const shiftToSave: Omit<FirestoreShift, 'id' | 'bookedCount'> = {
      ...shiftData,
      instructorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: shiftData.notes || '', // Ensure notes is always a string
    };

    const shiftsCollection = collection(firestore, 'shifts');
    const docRef = await addDoc(shiftsCollection, {
      ...shiftToSave,
      bookedCount: 0, // Initialize bookedCount
    });
    
    return { success: true, shiftId: docRef.id };
  } catch (error: any) {
    console.error('Error creating shift:', error.message);
    return { success: false, error: error.message || 'Failed to create shift.' };
  }
}

export async function updateShift(
  shiftId: string,
  shiftData: UpdateShiftInput,
  instructorId: string
): Promise<{ success: boolean; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required for update.' };
  }
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required for update authorization.' }
  }

  try {
    const shiftRef = doc(firestore, 'shifts', shiftId);
    // Note: Consider adding instructor ownership verification for enhanced security

    const dataToUpdate: Record<string, any> = {
      ...shiftData,
      updatedAt: serverTimestamp(),
    };

    // Handle date conversion if it exists
    if (shiftData.date) {
      const dateValue = shiftData.date as unknown;
      if (dateValue && typeof dateValue === 'object' && 'toISOString' in dateValue) {
        dataToUpdate.date = (dateValue as Date).toISOString().split('T')[0];
      } else if (typeof dateValue === 'string') {
        dataToUpdate.date = dateValue;
      }
    }

    // Ensure notes is always a string if it exists
    if ('notes' in shiftData) {
      dataToUpdate.notes = shiftData.notes || '';
    }

    await updateDoc(shiftRef, dataToUpdate);
    console.log("Shift updated with ID:", shiftId);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating shift in Firestore:', error);
    return { success: false, error: error.message || 'Failed to update shift.' };
  }
}

export async function deleteShift(shiftId: string): Promise<{ success: boolean; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required for deletion.' };
  }

  try {
    const shiftRef = doc(firestore, 'shifts', shiftId);
    await deleteDoc(shiftRef);
    console.log("Shift deleted with ID:", shiftId);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting shift from Firestore:', error);
    return { success: false, error: error.message || 'Failed to delete shift.' };
  }
}

export async function getAllAvailableShifts(): Promise<ClientShift[]> {
  try {
    const shiftsCollection = collection(firestore, 'shifts');
    const today = new Date().toISOString().split('T')[0];
    
    // Query for shifts that:
    // 1. Have not reached capacity (bookedCount < capacity)
    // 2. Are in the future or today
    const q = query(
      shiftsCollection,
      where("date", ">=", today)
    );
    
    const shiftsSnapshot = await getDocs(q);
    const shiftsList = shiftsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as FirestoreShift))
      .filter(shift => shift.bookedCount < shift.capacity); // Filter out fully booked shifts
    
    return transformShiftsToClient(shiftsList);
  } catch (error) {
    console.error("Error fetching all available shifts:", error);
    return [];
  }
}

export async function getShiftsForInstructor(instructorId: string): Promise<ClientShift[]> {
  if (!instructorId) {
    console.warn("getShiftsForInstructor called without instructorId");
    return [];
  }
  try {
    const shiftsCollection = collection(firestore, 'shifts');
    const q = query(shiftsCollection, where("instructorId", "==", instructorId));
    const shiftsSnapshot = await getDocs(q);
    const shiftsList = shiftsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as FirestoreShift));
    return transformShiftsToClient(shiftsList);
  } catch (error) {
    console.error(`Error fetching shifts for instructor ${instructorId}:`, error);
    return [];
  }
}

/**
 * Get a single shift by ID
 */
export async function getShiftById(shiftId: string): Promise<{ success: boolean; data?: Shift; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    const shiftRef = doc(firestore, 'shifts', shiftId);
    const shiftDoc = await getDoc(shiftRef);

    if (!shiftDoc.exists()) {
      return { success: false, error: 'Shift not found.' };
    }

    const firestoreShift: FirestoreShift = {
      id: shiftDoc.id,
      ...shiftDoc.data(),
    } as FirestoreShift;

    const clientShift = transformShiftToClient(firestoreShift);
    
    console.log(`Retrieved shift ${shiftId}:`, clientShift.title);
    return { success: true, data: clientShift };
  } catch (error: any) {
    console.error('Error retrieving shift by ID:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift.' };
  }
}
