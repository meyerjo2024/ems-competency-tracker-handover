'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { EncountersList } from '@/components/encounters/EncountersList';
import { getEncountersForStudent } from '@/actions/patientCareFormActions';
import { getShiftById } from '@/actions/shiftActions';
import type { PatientCareFormData, Shift } from '@/types';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function EncountersPage() {
  const { currentUser } = useAuth();
  const [encounters, setEncounters] = React.useState<PatientCareFormData[]>([]);
  const [shifts, setShifts] = React.useState<Map<string, Shift>>(new Map());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch encounters for the student
      const encountersResult = await getEncountersForStudent(currentUser.id);
      
      if (!encountersResult.success) {
        throw new Error(encountersResult.error || 'Failed to fetch encounters');
      }

      const encountersList = encountersResult.data || [];
      setEncounters(encountersList);

      // Fetch shifts for each encounter by their shiftId
      const shiftsMap = new Map<string, Shift>();
      const uniqueShiftIds = [...new Set(encountersList.map(e => e.shiftId).filter(Boolean))];
      
      // Fetch each shift individually
      await Promise.all(
        uniqueShiftIds.map(async (shiftId) => {
          if (shiftId) {
            const shiftResult = await getShiftById(shiftId);
            if (shiftResult.success && shiftResult.data) {
              shiftsMap.set(shiftId, shiftResult.data);
            }
          }
        })
      );
      
      setShifts(shiftsMap);
    } catch (err: any) {
      console.error('Error fetching encounters:', err);
      setError(err.message || 'An error occurred while loading encounters');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading encounters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Encounters</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Encounters</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your patient care encounters
        </p>
      </div>

      <EncountersList
        encounters={encounters}
        shifts={shifts}
        onRefresh={fetchData}
      />
    </div>
  );
}

