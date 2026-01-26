'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge} from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import type { Shift } from '@/types';
import { format, parseISO, isFuture, isToday } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getShiftBookingsForStudent } from '@/actions/bookingActions';
import { getShiftById } from '@/actions/shiftActions';

interface ShiftSelectorProps {
  onShiftSelected: (shiftId: string) => void;
}

export function ShiftSelector({ onShiftSelected }: ShiftSelectorProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [selectedShiftId, setSelectedShiftId] = React.useState<string | null>(null);
  const [bookedShifts, setBookedShifts] = React.useState<Shift[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch booked shifts for the student
  React.useEffect(() => {
    async function fetchBookedShifts() {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get shift bookings for student (returns ShiftBooking[] directly)
        const bookings = await getShiftBookingsForStudent(currentUser.id);
        
        if (!bookings || bookings.length === 0) {
          // No bookings found - this is not an error, just empty state
          setBookedShifts([]);
          setIsLoading(false);
          return;
        }

        // Fetch the actual shift objects for each booking
        const shiftPromises = bookings.map(booking => 
          getShiftById(booking.shiftId)
        );

        const shiftsResults = await Promise.all(shiftPromises);
        const fetchedShifts: Shift[] = [];

        for (const result of shiftsResults) {
          if (result.success && result.data) {
            fetchedShifts.push(result.data);
          }
        }

        setBookedShifts(fetchedShifts);
      } catch (err: any) {
        console.error('Error fetching booked shifts:', err);
        setError(err.message || 'Failed to load shifts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookedShifts();
  }, [currentUser?.id]);

  // Filter shifts to show only current and future shifts
  const availableShifts = React.useMemo(() => {
    return bookedShifts.filter(shift => {
      const shiftDate = parseISO(shift.date);
      return isToday(shiftDate) || isFuture(shiftDate);
    });
  }, [bookedShifts]);

  const handleSelectShift = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    onShiftSelected(shiftId);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Shifts</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading your shifts...</p>
        </CardContent>
      </Card>
    );
  }

  if (availableShifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Available Shifts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No booked shifts found</AlertTitle>
            <AlertDescription>
              You need to book a shift before you can log an encounter.
              Visit the shifts page to browse and book available shifts.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/shifts">
              Browse Available Shifts
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Shift for This Encounter</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which shift this patient encounter occurred during
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableShifts.map((shift) => {
          const shiftDate = parseISO(shift.date);
          const isSelected = selectedShiftId === shift.id;

          return (
            <Card
              key={shift.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary border-2 bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelectShift(shift.id)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{shift.title}</h3>
                      <Badge variant="outline" className="mt-1">
                        {shift.type}
                      </Badge>
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary">Selected</Badge>
                    )}
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(shiftDate, 'EEEE, MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{shift.location}</span>
                    </div>
                  </div>

                  {shift.notes && (
                    <p className="text-sm text-muted-foreground border-t pt-2">
                      {shift.notes}
                    </p>
                  )}

                  {isSelected && (
                    <Button className="w-full mt-2" onClick={() => handleSelectShift(shift.id)}>
                      Continue with This Shift
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Don't see the shift you're looking for?
          </p>
          <Button variant="outline" asChild>
            <Link href="/shifts">
              View All Shifts
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

