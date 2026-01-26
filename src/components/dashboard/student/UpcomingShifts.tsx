// src/components/dashboard/student/UpcomingShifts.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, MapPin, User, Loader2 } from "lucide-react";
import type { PopulatedShiftBooking } from "@/app/(app)/dashboard/student/page";
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config';
import type { UserProfile } from '@/types';

interface UpcomingShiftsProps {
  bookedShifts: PopulatedShiftBooking[];
  isLoading: boolean;
  error: string | null;
}

export function UpcomingShifts({ bookedShifts, isLoading, error }: UpcomingShiftsProps) {
  const [instructorNames, setInstructorNames] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchInstructorNames() {
      const names: Record<string, string> = {};
      const uniqueInstructorIds = [...new Set(bookedShifts
        .filter(booking => booking.shiftDetails?.instructorId)
        .map(booking => booking.shiftDetails!.instructorId))];

      for (const instructorId of uniqueInstructorIds) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', instructorId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            names[instructorId] = userData.fullName;
          }
        } catch (error) {
          console.error(`Error fetching instructor name for ${instructorId}:`, error);
        }
      }
      setInstructorNames(names);
    }

    if (bookedShifts.length > 0) {
      fetchInstructorNames();
    }
  }, [bookedShifts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          Upcoming Shifts
        </CardTitle>
        <CardDescription>Your next scheduled shifts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p className="text-muted-foreground">Loading upcoming shifts...</p>
          </div>
        )}
        {!isLoading && error && (
          <p className="text-destructive text-sm text-center">Error: {error}</p>
        )}
        {!isLoading && !error && bookedShifts.length > 0 && bookedShifts.map((booking) => {
          const shift = booking.shiftDetails;
          if (!shift) return null;

          return (
            <div key={booking.id} className="p-3 border rounded-lg bg-muted/50">
              <p className="font-semibold text-foreground">
                {format(parseISO(shift.date), "EEE, MMM d, yyyy")} 
                <span className="font-normal text-muted-foreground"> ({shift.startTime} - {shift.endTime})</span>
              </p>
              <p className="text-sm text-foreground">{shift.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" /> {shift.location}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" /> {instructorNames[shift.instructorId] || 'Loading...'}
              </div>
            </div>
          );
        })}
        {!isLoading && !error && bookedShifts.length === 0 && (
          <p className="text-muted-foreground text-center">No upcoming shifts booked.</p>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link href="/shifts">View Full Calendar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
