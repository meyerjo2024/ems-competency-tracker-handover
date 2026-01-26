'use client';

import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEncounterById } from '@/actions/patientCareFormActions';
import { getShiftById } from '@/actions/shiftActions';
import { PatientCareForm } from '@/components/forms/patient-care-form/PatientCareForm';
import { InstructorFeedbackSection } from '@/components/encounters/InstructorFeedbackSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import type { PatientCareFormData, Shift } from '@/types';
import { format, parseISO } from 'date-fns';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

function InstructorEncounterReviewContent() {
  const { currentUser } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const encounterId = params.encounterId as string;
  const shiftId = searchParams.get('shiftId');
  
  const [encounter, setEncounter] = useState<PatientCareFormData | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to safely format dates (handles Firestore Timestamps)
  const formatDate = (date: any, formatStr: string = 'MMM dd, yyyy'): string => {
    if (!date) return 'Date unknown';
    
    try {
      const dateObj = typeof date === 'string'
        ? parseISO(date)
        : date?.toDate?.() 
          ? date.toDate()
          : new Date(date);
      
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };
  
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Instructor') {
      router.push('/dashboard');
      return;
    }
    
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch encounter
        const encounterResult = await getEncounterById(encounterId);
        if (!encounterResult.success || !encounterResult.data) {
          setError(encounterResult.error || 'Encounter not found');
          return;
        }
        setEncounter(encounterResult.data);
        
        // Fetch shift
        if (encounterResult.data.shiftId) {
          const shiftData = await getShiftById(encounterResult.data.shiftId);
          if (shiftData.success && shiftData.data) {
            setShift(shiftData.data);
          }
        }
        
      } catch (err: any) {
        console.error('Error fetching encounter:', err);
        setError(err.message || 'Failed to load encounter');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [encounterId, currentUser, router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading encounter...</p>
      </div>
    );
  }
  
  if (error || !encounter) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive font-semibold">{error || 'Encounter not found'}</p>
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shift
        </Button>
        
        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            Reviewing Encounter
          </h1>
          {shift && (
            <p className="text-muted-foreground">
              Shift: {shift.title} - {formatDate(shift.date, 'MMM dd, yyyy')}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Encounter ID: {encounter.id}
          </p>
          {encounter.primaryImpressionCondition && (
            <p className="text-sm text-muted-foreground">
              Primary Impression: {encounter.primaryImpressionCondition}
            </p>
          )}
        </div>
      </div>
      
      {/* Read-Only Form */}
      <PatientCareForm
        initialData={encounter}
        shiftId={encounter.shiftId}
        isViewMode={true}
      />
      
      {/* Instructor Feedback Section */}
      <InstructorFeedbackSection
        encounterId={encounterId}
        existingFeedback={encounter.instructorFeedback}
        reviewedByInstructorId={encounter.reviewedByInstructorId}
        reviewedAt={encounter.reviewedByInstructorId ? new Date() : undefined}
      />
    </div>
  );
}

export default function InstructorEncounterReviewPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Instructor', 'Administrator']}>
      <InstructorEncounterReviewContent />
    </RoleProtectedRoute>
  );
}

