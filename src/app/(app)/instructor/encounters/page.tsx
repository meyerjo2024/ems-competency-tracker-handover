'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEncountersForShift } from '@/actions/patientCareFormActions';
import { getShiftById } from '@/actions/shiftActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { PatientCareFormData, Shift } from '@/types';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

function InstructorEncountersListContent() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const shiftId = searchParams.get('shiftId');
  const studentId = searchParams.get('studentId');
  
  const [encounters, setEncounters] = useState<PatientCareFormData[]>([]);
  const [shift, setShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to safely format dates (handles Firestore Timestamps)
  const formatDate = (date: any, formatStr: string = 'MMM dd, yyyy HH:mm'): string => {
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
    
    if (!shiftId || !studentId) {
      setError('Missing shift or student parameter');
      setIsLoading(false);
      return;
    }
    
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch encounters
        const encountersResult = await getEncountersForShift(shiftId!, studentId!);
        if (encountersResult.success && encountersResult.data) {
          setEncounters(encountersResult.data);
        } else {
          setError(encountersResult.error || 'Failed to fetch encounters');
        }
        
        // Fetch shift
        const shiftData = await getShiftById(shiftId!);
        if (shiftData.success && shiftData.data) {
          setShift(shiftData.data);
        }
        
      } catch (err: any) {
        console.error('Error fetching encounters:', err);
        setError(err.message || 'Failed to load encounters');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [shiftId, studentId, currentUser, router]);
  
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
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive font-semibold">{error}</p>
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
    <div className="container mx-auto py-8 max-w-4xl">
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
            Student Encounters
          </h1>
          {shift && (
            <p className="text-muted-foreground">
              Shift: {shift.title} - {formatDate(shift.date, 'MMM dd, yyyy')}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {encounters.length} encounter{encounters.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
      
      {/* Encounters List */}
      {encounters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No encounters found for this shift
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {encounters.map((encounter) => (
            <Card key={encounter.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {encounter.primaryImpressionCondition || 'Encounter'}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(encounter.createdAt, 'MMM dd, yyyy HH:mm')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {encounter.isDraft ? (
                      <Badge variant="outline">Draft</Badge>
                    ) : (
                      <Badge variant="default">Submitted</Badge>
                    )}
                    {encounter.instructorFeedback && (
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Reviewed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Age:</span> {encounter.age}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sex:</span> {encounter.sex}
                  </div>
                  {encounter.complaints && encounter.complaints.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Complaints:</span> {encounter.complaints.join(', ')}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => router.push(
                    `/instructor/encounters/${encounter.id}?shiftId=${shiftId}`
                  )}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review Encounter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InstructorEncountersListPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Instructor', 'Administrator']}>
      <InstructorEncountersListContent />
    </RoleProtectedRoute>
  );
}

