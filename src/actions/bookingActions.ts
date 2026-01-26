// src/actions/bookingActions.ts
// NOTE: These are NOT server actions - they run on the client to preserve auth context
// Server actions don't have access to Firebase Auth tokens

import { firestore } from '@/lib/firebase/config';
import type { Shift, ShiftBooking, ShiftBookingStatus } from '@/types';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export async function bookShift(
  shiftId: string,
  studentId: string
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required.' };
  }

  try {
    const bookingId = await runTransaction(firestore, async (transaction) => {
      const shiftRef = doc(firestore, 'shifts', shiftId);
      const shiftDoc = await transaction.get(shiftRef);

      if (!shiftDoc.exists()) {
        throw new Error('Shift not found.');
      }

      const shiftData = shiftDoc.data() as Shift;
      // Ensure bookedCount is treated as a number, defaulting to 0 if undefined or null
      const currentBookedCount = typeof shiftData.bookedCount === 'number' ? shiftData.bookedCount : 0;


      if (currentBookedCount >= shiftData.capacity) {
        throw new Error('Shift is already full.');
      }

      // Check if student is already booked for this shift
      const bookingsCollectionRef = collection(firestore, 'shiftBookings');
      const existingBookingQuery = query(
        bookingsCollectionRef,
        where('shiftId', '==', shiftId),
        where('studentId', '==', studentId),
        where('status', '==', 'Booked')
      );
      const existingBookingSnapshot = await getDocs(existingBookingQuery); 

      if (!existingBookingSnapshot.empty) {
          throw new Error('You are already booked for this shift.');
      }

      const newBookingRef = doc(collection(firestore, 'shiftBookings'));
      transaction.set(newBookingRef, {
        shiftId,
        studentId,
        bookingTimestamp: serverTimestamp(),
        status: 'Booked',
      });

      transaction.update(shiftRef, {
        bookedCount: currentBookedCount + 1,
      });

      return newBookingRef.id;
    });

    return { success: true, bookingId };
  } catch (error: any) {
    console.error('Error booking shift:', error);
    return { success: false, error: error.message || 'Failed to book shift.' };
  }
}

export async function cancelShiftBooking(
  bookingId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!bookingId || !studentId) {
    return { success: false, error: 'Booking ID and Student ID are required.' };
  }

  try {
    await runTransaction(firestore, async (transaction) => {
      const bookingRef = doc(firestore, 'shiftBookings', bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error('Booking not found.');
      }

      const bookingData = bookingDoc.data() as ShiftBooking;

      if (bookingData.studentId !== studentId) {
        throw new Error('You are not authorized to cancel this booking.');
      }

      if (bookingData.status !== 'Booked') {
        throw new Error('This booking cannot be cancelled or is already cancelled.');
      }

      transaction.update(bookingRef, {
        status: 'CancelledByStudent',
      });

      const shiftRef = doc(firestore, 'shifts', bookingData.shiftId);
      const shiftDoc = await transaction.get(shiftRef);
      if (shiftDoc.exists()) {
        // Ensure bookedCount is treated as a number, defaulting to 0
        const currentBookedCount = typeof shiftDoc.data()?.bookedCount === 'number' ? shiftDoc.data().bookedCount : 0;
        transaction.update(shiftRef, {
          bookedCount: Math.max(0, currentBookedCount - 1), 
        });
      } else {
        console.warn(`Shift document ${bookingData.shiftId} not found while trying to cancel booking ${bookingId}.`);
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling shift booking:', error);
    return { success: false, error: error.message || 'Failed to cancel booking.' };
  }
}

export async function getShiftBookingsForStudent(studentId: string): Promise<ShiftBooking[]> {
  if (!studentId) return [];
  try {
    const bookingsCollection = collection(firestore, 'shiftBookings');
    const q = query(bookingsCollection, where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            bookingTimestamp: data.bookingTimestamp instanceof Timestamp ? data.bookingTimestamp.toDate() : data.bookingTimestamp,
        } as ShiftBooking;
    });
    return bookings;
  } catch (error) {
    console.error(`Error fetching bookings for student ${studentId}:`, error);
    return [];
  }
}

interface StudentWithEncounters {
  id: string;
  fullName: string;
  email: string;
  encounterCount: number;
  draftCount: number;
  bookingStatus: 'Booked' | 'Attended' | 'Reviewed';
}

export async function getStudentsForShift(
  shiftId: string
): Promise<{ success: boolean; data?: StudentWithEncounters[]; error?: string }> {
  if (!shiftId) {
    return { success: false, error: 'Shift ID is required' };
  }

  try {
    // Get all bookings for this shift (Booked, Attended, and Reviewed)
    // We need to fetch all statuses because students may have submitted for review
    const bookingsCollection = collection(firestore, 'shiftBookings');
    
    // Firestore doesn't support OR in where clauses, so we query by shiftId only
    // and filter in memory (more efficient than 3 separate queries for small datasets)
    const q = query(
      bookingsCollection,
      where('shiftId', '==', shiftId)
    );
    const bookingsSnapshot = await getDocs(q);

    if (bookingsSnapshot.empty) {
      return { success: true, data: [] };
    }

    // Filter to only include active bookings (not cancelled)
    const activeBookings = bookingsSnapshot.docs.filter((doc) => {
      const status = doc.data().status;
      return status === 'Booked' || status === 'Attended' || status === 'Reviewed';
    });

    if (activeBookings.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch user details and encounter counts for each student
    const studentsPromises = activeBookings.map(async (bookingDoc) => {
      const booking = bookingDoc.data();
      const studentId = booking.studentId;

      // Fetch student profile
      const userRef = doc(firestore, 'users', studentId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();

      // Fetch encounter counts for this student in this shift
      const encountersCollection = collection(firestore, 'encounters');
      const encountersQuery = query(
        encountersCollection,
        where('shiftId', '==', shiftId),
        where('studentId', '==', studentId)
      );
      const encountersSnapshot = await getDocs(encountersQuery);

      let encounterCount = 0;
      let draftCount = 0;

      encountersSnapshot.docs.forEach((doc) => {
        const encounterData = doc.data();
        if (encounterData.isDraft) {
          draftCount++;
        } else {
          encounterCount++;
        }
      });

      return {
        id: studentId,
        fullName: userData.fullName || 'Unknown',
        email: userData.email || 'No email',
        encounterCount,
        draftCount,
        bookingStatus: booking.status as 'Booked' | 'Attended' | 'Reviewed',
      };
    });

    const students = (await Promise.all(studentsPromises)).filter(
      (student): student is StudentWithEncounters => student !== null
    );

    return { success: true, data: students };
  } catch (error: any) {
    console.error('Error fetching students for shift:', error);
    return { success: false, error: error.message || 'Failed to fetch students' };
  }
}

/**
 * Update booking status helper function
 * Used internally by submitShiftForReview and feedback submission
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: ShiftBookingStatus,
  studentId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!bookingId || !newStatus) {
    return { success: false, error: 'Booking ID and status are required' };
  }

  try {
    const bookingRef = doc(firestore, 'shiftBookings', bookingId);
    
    // Verify booking exists and ownership if studentId provided
    if (studentId) {
      const bookingDoc = await getDoc(bookingRef);
      if (!bookingDoc.exists()) {
        return { success: false, error: 'Booking not found' };
      }
      const bookingData = bookingDoc.data() as ShiftBooking;
      if (bookingData.studentId !== studentId) {
        return { success: false, error: 'You are not authorized to update this booking' };
      }
    }

    await updateDoc(bookingRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    console.log(`Booking ${bookingId} status updated to ${newStatus}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return { success: false, error: error.message || 'Failed to update booking status' };
  }
}

/**
 * Submit shift for review - Student action
 * Marks the shift as "Attended" indicating student has completed all encounters
 * and the shift is ready for instructor review
 */
export async function submitShiftForReview(
  shiftId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!shiftId || !studentId) {
    return { success: false, error: 'Shift ID and Student ID are required' };
  }

  try {
    // Find the booking for this student and shift
    const bookingsCollection = collection(firestore, 'shiftBookings');
    const q = query(
      bookingsCollection,
      where('shiftId', '==', shiftId),
      where('studentId', '==', studentId),
      where('status', '==', 'Booked')
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'No active booking found for this shift' };
    }

    // Should only be one booking per student per shift
    const bookingDoc = querySnapshot.docs[0];
    const bookingId = bookingDoc.id;

    // Update status to 'Attended' (ready for instructor review)
    const result = await updateBookingStatus(bookingId, 'Attended', studentId);
    
    if (result.success) {
      console.log(`Student ${studentId} submitted shift ${shiftId} for review`);
    }

    return result;
  } catch (error: any) {
    console.error('Error submitting shift for review:', error);
    return { success: false, error: error.message || 'Failed to submit shift for review' };
  }
}

/**
 * Get pending review count for instructor
 * Returns count of shifts with status 'Attended' (submitted by students, pending instructor feedback)
 */
export async function getPendingReviewsCount(instructorId: string): Promise<number> {
  if (!instructorId) return 0;

  try {
    // Get all shifts created by this instructor
    const shiftsCollection = collection(firestore, 'shifts');
    const shiftsQuery = query(shiftsCollection, where('instructorId', '==', instructorId));
    const shiftsSnapshot = await getDocs(shiftsQuery);

    if (shiftsSnapshot.empty) return 0;

    const shiftIds = shiftsSnapshot.docs.map((doc) => doc.id);

    // Count bookings with status 'Attended' for these shifts
    const bookingsCollection = collection(firestore, 'shiftBookings');
    let pendingCount = 0;

    // Firestore doesn't support 'in' queries with status AND shiftId, so we iterate
    for (const shiftId of shiftIds) {
      const bookingsQuery = query(
        bookingsCollection,
        where('shiftId', '==', shiftId),
        where('status', '==', 'Attended')
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      pendingCount += bookingsSnapshot.size;
    }

    return pendingCount;
  } catch (error) {
    console.error('Error fetching pending reviews count:', error);
    return 0;
  }
}

/**
 * Get bookings by status for a shift
 * Used by instructor to see which students have submitted for review
 */
export async function getBookingsByStatus(
  shiftId: string,
  status: ShiftBookingStatus
): Promise<ShiftBooking[]> {
  if (!shiftId) return [];

  try {
    const bookingsCollection = collection(firestore, 'shiftBookings');
    const q = query(
      bookingsCollection,
      where('shiftId', '==', shiftId),
      where('status', '==', status)
    );
    const querySnapshot = await getDocs(q);

    const bookings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        bookingTimestamp:
          data.bookingTimestamp instanceof Timestamp
            ? data.bookingTimestamp.toDate()
            : data.bookingTimestamp,
      } as ShiftBooking;
    });

    return bookings;
  } catch (error) {
    console.error(`Error fetching bookings with status ${status} for shift ${shiftId}:`, error);
    return [];
  }
}

/**
 * Check if a shift has any students who have submitted for review
 * Returns count of students with 'Attended' status
 */
export async function getShiftPendingReviewCount(shiftId: string): Promise<number> {
  if (!shiftId) return 0;

  try {
    const bookingsCollection = collection(firestore, 'shiftBookings');
    const q = query(
      bookingsCollection,
      where('shiftId', '==', shiftId),
      where('status', '==', 'Attended')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error(`Error fetching pending review count for shift ${shiftId}:`, error);
    return 0;
  }
}
