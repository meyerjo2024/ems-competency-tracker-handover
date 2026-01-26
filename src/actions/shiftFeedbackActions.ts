// NOTE: These are NOT server actions - they run on the client to preserve auth context
// Server actions don't have access to Firebase Auth tokens

import type { ShiftFeedback } from '@/types';
import { firestore } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { updateBookingStatus } from './bookingActions';

/**
 * Submit shift-level feedback from instructor to student
 * This is REQUIRED feedback at the shift level (not optional like encounter-level feedback)
 */
export async function submitShiftFeedback(
  feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  
  // Validate required fields
  if (!feedbackData.shiftId || !feedbackData.instructorId || !feedbackData.studentId || !feedbackData.overallFeedback) {
    return { success: false, error: 'Shift ID, Instructor ID, Student ID, and Overall Feedback are required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    
    // Check if feedback already exists for this shift-student-instructor combination
    const q = query(
      feedbackCollection,
      where('shiftId', '==', feedbackData.shiftId),
      where('studentId', '==', feedbackData.studentId),
      where('instructorId', '==', feedbackData.instructorId)
    );
    
    const existingFeedback = await getDocs(q);
    
    if (!existingFeedback.empty) {
      // Update existing feedback
      const feedbackId = existingFeedback.docs[0].id;
      const feedbackRef = doc(firestore, 'shiftFeedback', feedbackId);
      
      await updateDoc(feedbackRef, {
        ...feedbackData,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Updated shift feedback:', feedbackId);
      return { 
        success: true, 
        data: { id: feedbackId, ...feedbackData } as ShiftFeedback 
      };
    } else {
      // Create new feedback
      const docRef = await addDoc(feedbackCollection, {
        ...feedbackData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('Created new shift feedback:', docRef.id);
      return { 
        success: true, 
        data: { id: docRef.id, ...feedbackData } as ShiftFeedback 
      };
    }
  } catch (error: any) {
    console.error('Error submitting shift feedback:', error);
    return { success: false, error: error.message || 'Failed to submit shift feedback.' };
  }
}

/**
 * Get ALL shift feedbacks for a specific student (across all shifts)
 * Used by students to view their feedback history
 */
export async function getAllFeedbacksForStudent(studentId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks: ShiftFeedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() } as ShiftFeedback);
    });
    
    console.log(`Retrieved ${feedbacks.length} shift feedbacks for student ${studentId}`);
    return { success: true, data: feedbacks };
  } catch (error: any) {
    console.error('Error retrieving shift feedback for student:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

/**
 * Get shift feedback for a specific shift and student
 */
export async function getShiftFeedbackForShiftAndStudent(
  shiftId: string, 
  studentId: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('shiftId', '==', shiftId),
      where('studentId', '==', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: true, data: undefined }; // No feedback yet
    }
    
    const feedbackDoc = querySnapshot.docs[0];
    const feedback = { id: feedbackDoc.id, ...feedbackDoc.data() } as ShiftFeedback;
    
    console.log(`Retrieved shift feedback for shift ${shiftId} and student ${studentId}`);
    return { success: true, data: feedback };
  } catch (error: any) {
    console.error('Error retrieving shift feedback:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

/**
 * Get all shift feedback submitted by a specific instructor
 */
export async function getShiftFeedbackByInstructor(instructorId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!instructorId) {
    return { success: false, error: 'Instructor ID is required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('instructorId', '==', instructorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks: ShiftFeedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() } as ShiftFeedback);
    });
    
    console.log(`Retrieved ${feedbacks.length} shift feedbacks by instructor ${instructorId}`);
    return { success: true, data: feedbacks };
  } catch (error: any) {
    console.error('Error retrieving shift feedback by instructor:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

/**
 * Get all shift feedback for a specific shift (all students)
 */
export async function getShiftFeedbackForShift(shiftId: string): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('shiftId', '==', shiftId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks: ShiftFeedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() } as ShiftFeedback);
    });
    
    console.log(`Retrieved ${feedbacks.length} shift feedbacks for shift ${shiftId}`);
    return { success: true, data: feedbacks };
  } catch (error: any) {
    console.error('Error retrieving shift feedback for shift:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

/**
 * Save shift-level feedback for a specific student
 * Each student on a shift gets individual feedback from the instructor
 */
export async function saveShiftFeedback(
  feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'>,
  feedbackId?: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  
  // Validate required fields
  if (!feedbackData.shiftId || !feedbackData.instructorId || !feedbackData.studentId) {
    return { success: false, error: 'Shift ID, Instructor ID, and Student ID are required.' };
  }

  if (!feedbackData.overallFeedback || !feedbackData.overallFeedback.trim()) {
    return { success: false, error: 'Overall feedback is required.' };
  }

  try {
    // Clean data: Remove undefined fields (Firestore doesn't accept undefined)
    const cleanedData = Object.fromEntries(
      Object.entries(feedbackData).filter(([_, value]) => value !== undefined)
    );

    const feedbackCollection = collection(firestore, 'shiftFeedback');
    
    if (feedbackId) {
      // Update existing feedback
      const feedbackRef = doc(firestore, 'shiftFeedback', feedbackId);
      await updateDoc(feedbackRef, {
        ...cleanedData,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Updated shift feedback:', feedbackId);
      
      // Mark booking as 'Reviewed' after feedback is saved
      await markShiftAsReviewed(feedbackData.shiftId, feedbackData.studentId);
      
      return { 
        success: true, 
        data: { id: feedbackId, ...feedbackData } as ShiftFeedback 
      };
    } else {
      // Check if feedback already exists for this shift-instructor-student combination
      const q = query(
        feedbackCollection,
        where('shiftId', '==', feedbackData.shiftId),
        where('instructorId', '==', feedbackData.instructorId),
        where('studentId', '==', feedbackData.studentId)
      );
      
      const existingFeedback = await getDocs(q);
      
      if (!existingFeedback.empty) {
        // Update existing feedback
        const existingId = existingFeedback.docs[0].id;
        const feedbackRef = doc(firestore, 'shiftFeedback', existingId);
        await updateDoc(feedbackRef, {
          ...cleanedData,
          updatedAt: serverTimestamp(),
        });
        
        console.log('Updated existing shift feedback:', existingId);
        
        // Mark booking as 'Reviewed' after feedback is saved
        await markShiftAsReviewed(feedbackData.shiftId, feedbackData.studentId);
        
        return { 
          success: true, 
          data: { id: existingId, ...feedbackData } as ShiftFeedback 
        };
      }
      
      // Create new feedback
      const docRef = await addDoc(feedbackCollection, {
        ...cleanedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('Created new shift feedback:', docRef.id);
      
      // Mark booking as 'Reviewed' after feedback is saved
      await markShiftAsReviewed(feedbackData.shiftId, feedbackData.studentId);
      
      return { 
        success: true, 
        data: { id: docRef.id, ...feedbackData } as ShiftFeedback 
      };
    }
  } catch (error: any) {
    console.error('Error saving shift feedback:', error);
    return { success: false, error: error.message || 'Failed to save shift feedback.' };
  }
}

/**
 * Helper function to mark a booking as 'Reviewed' after instructor provides feedback
 * This updates the booking status from 'Attended' to 'Reviewed'
 */
async function markShiftAsReviewed(shiftId: string, studentId: string): Promise<void> {
  try {
    // Find the booking for this shift and student
    const bookingsCollection = collection(firestore, 'shiftBookings');
    const q = query(
      bookingsCollection,
      where('shiftId', '==', shiftId),
      where('studentId', '==', studentId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const bookingDoc = querySnapshot.docs[0];
      const bookingId = bookingDoc.id;
      const bookingData = bookingDoc.data();

      // Only update if status is 'Attended' (prevent overwriting other statuses)
      if (bookingData.status === 'Attended') {
        await updateBookingStatus(bookingId, 'Reviewed');
        console.log(`Marked booking ${bookingId} as 'Reviewed'`);
      }
    }
  } catch (error) {
    console.error('Error marking shift as reviewed:', error);
    // Don't throw error - feedback was saved successfully, this is just a status update
  }
}

/**
 * Get shift feedback for a specific student
 */
export async function getShiftFeedbackForStudent(
  shiftId: string,
  instructorId: string,
  studentId: string
): Promise<{ success: boolean; data?: ShiftFeedback; error?: string }> {
  if (!shiftId || !instructorId || !studentId) {
    return { success: false, error: 'Shift ID, Instructor ID, and Student ID are required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('shiftId', '==', shiftId),
      where('instructorId', '==', instructorId),
      where('studentId', '==', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: true, data: undefined }; // No feedback yet
    }
    
    // Return the first match (should only be one per shift-instructor-student combination)
    const feedbackDoc = querySnapshot.docs[0];
    const feedback = { id: feedbackDoc.id, ...feedbackDoc.data() } as ShiftFeedback;
    
    console.log(`Retrieved shift feedback for shift ${shiftId}, student ${studentId}`);
    return { success: true, data: feedback };
  } catch (error: any) {
    console.error('Error retrieving shift feedback for student:', error);
    return { success: false, error: error.message || 'Failed to retrieve shift feedback.' };
  }
}

/**
 * Get all shift feedbacks for a shift (all students)
 * Used to check which students have been reviewed
 */
export async function getAllShiftFeedbacks(
  shiftId: string,
  instructorId: string
): Promise<{ success: boolean; data?: ShiftFeedback[]; error?: string }> {
  if (!shiftId || !instructorId) {
    return { success: false, error: 'Shift ID and Instructor ID are required.' };
  }

  try {
    const feedbackCollection = collection(firestore, 'shiftFeedback');
    const q = query(
      feedbackCollection,
      where('shiftId', '==', shiftId),
      where('instructorId', '==', instructorId)
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks: ShiftFeedback[] = [];
    
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() } as ShiftFeedback);
    });
    
    console.log(`Retrieved ${feedbacks.length} feedbacks for shift ${shiftId}`);
    return { success: true, data: feedbacks };
  } catch (error: any) {
    console.error('Error retrieving all shift feedbacks:', error);
    return { success: false, error: error.message || 'Failed to retrieve feedbacks.' };
  }
}

