'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { PatientCareForm } from '@/components/forms/patient-care-form/PatientCareForm';
import { ShiftSelector } from '@/components/encounters/ShiftSelector';
import { ShiftContextHeader } from '@/components/encounters/ShiftContextHeader';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { getShiftById } from '@/actions/shiftActions';
import { getEncounterById } from '@/actions/patientCareFormActions';
import type { Shift, PatientCareFormData } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

function PatientCareFormContent() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const shiftIdParam = searchParams?.get('shiftId');
  const encounterIdParam = searchParams?.get('encounterId');
  const modeParam = searchParams?.get('mode'); // 'view' for read-only

  const [selectedShift, setSelectedShift] = React.useState<Shift | null>(null);
  const [encounterData, setEncounterData] = React.useState<PatientCareFormData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch shift and/or encounter data based on URL params
  React.useEffect(() => {
    async function fetchData() {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let shiftIdToFetch: string | null = null;

        // If encounterIdParam is provided, fetch the encounter first
        if (encounterIdParam) {
          const encounterResult = await getEncounterById(encounterIdParam);
          
          if (!encounterResult.success || !encounterResult.data) {
            throw new Error(encounterResult.error || 'Encounter not found');
          }

          setEncounterData(encounterResult.data);
          shiftIdToFetch = encounterResult.data.shiftId; // Use the encounter's shiftId
        } else if (shiftIdParam) {
          // If shiftIdParam is provided directly, use it
          shiftIdToFetch = shiftIdParam;
        }

        // Fetch the shift if we have a shiftId
        if (shiftIdToFetch) {
          const shiftResult = await getShiftById(shiftIdToFetch);
          
          if (!shiftResult.success || !shiftResult.data) {
            throw new Error(shiftResult.error || 'Shift not found');
          }

          setSelectedShift(shiftResult.data);
        }
      } catch (err: any) {
        console.error('Error loading form data:', err);
        setError(err.message || 'Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentUser?.id, shiftIdParam, encounterIdParam]);

  const handleShiftSelected = (shiftId: string) => {
    // Navigate to the same page with shiftId param
    router.push(`/patient-care-form?shiftId=${shiftId}`);
  };

  const isViewMode = modeParam === 'view';
  const isEditMode = !!encounterIdParam && !isViewMode;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no shift is selected, show shift selector
  if (!selectedShift) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">New Patient Encounter</h1>
        </div>
        <p className="text-muted-foreground">
          First, select the shift during which this encounter occurred.
        </p>
        <ShiftSelector onShiftSelected={handleShiftSelected} />
      </div>
    );
  }

  // Show form with shift context
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">
          {isViewMode ? 'View Encounter' : isEditMode ? 'Edit Encounter' : 'New Patient Encounter'}
        </h1>
      </div>
      
      {!isViewMode && (
        <p className="text-muted-foreground">
          Complete the form below to log a patient encounter. Ensure all details are accurate and comprehensive.
          {!isEditMode && ' Use the AI tools to assist with narrative generation and skill identification.'}
        </p>
      )}

      {/* Shift Context Header */}
      <ShiftContextHeader shift={selectedShift} />

      {/* Patient Care Form */}
      <PatientCareForm
        initialData={encounterData}
        shiftId={selectedShift.id}
        isViewMode={isViewMode}
      />
    </div>
  );
}

export default function PatientCareFormPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Student']}>
      <PatientCareFormContent />
    </RoleProtectedRoute>
  );
}
