'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Calendar, MapPin, Clock, Users, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getShiftById } from '@/actions/shiftActions';
import { getStudentsForShift } from '@/actions/bookingActions';
import { saveShiftFeedback, getAllShiftFeedbacks } from '@/actions/shiftFeedbackActions';
import type { Shift, ShiftFeedback } from '@/types';
import { format, parseISO } from 'date-fns';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { useToast } from '@/hooks/use-toast';

interface StudentWithEncounters {
  id: string;
  fullName: string;
  email: string;
  encounterCount: number;
  draftCount: number;
  bookingStatus: 'Booked' | 'Attended' | 'Reviewed';
}

function InstructorShiftDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const shiftId = params?.shiftId as string;

  const [shift, setShift] = React.useState<Shift | null>(null);
  const [students, setStudents] = React.useState<StudentWithEncounters[]>([]);
  const [studentFeedbacks, setStudentFeedbacks] = React.useState<Map<string, ShiftFeedback>>(new Map());
  const [isLoading, setIsLoading] = React.useState(true);
  const [savingStudentId, setSavingStudentId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Form data per student
  const [formData, setFormData] = React.useState<Map<string, {
    overallFeedback: string;
    performanceRating: string;
    areasOfStrength: string;
    areasForImprovement: string;
  }>>(new Map());

  React.useEffect(() => {
    async function fetchShiftDetails() {
      if (!shiftId || !currentUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch shift details
        const shiftResult = await getShiftById(shiftId);
        if (!shiftResult.success || !shiftResult.data) {
          throw new Error(shiftResult.error || 'Shift not found');
        }

        // Verify instructor owns this shift
        if (shiftResult.data.instructorId !== currentUser.id) {
          setError('You do not have permission to view this shift');
          setIsLoading(false);
          return;
        }

        setShift(shiftResult.data);

        // Fetch students booked for this shift
        const studentsResult = await getStudentsForShift(shiftId);
        if (studentsResult.success && studentsResult.data) {
          setStudents(studentsResult.data);

          // Fetch all existing feedbacks for this shift
          const feedbacksResult = await getAllShiftFeedbacks(shiftId, currentUser.id);
          if (feedbacksResult.success && feedbacksResult.data) {
            const feedbackMap = new Map<string, ShiftFeedback>();
            const formDataMap = new Map();
            
            feedbacksResult.data.forEach(feedback => {
              feedbackMap.set(feedback.studentId, feedback);
              formDataMap.set(feedback.studentId, {
                overallFeedback: feedback.overallFeedback || '',
                performanceRating: feedback.performanceRating || '',
                areasOfStrength: feedback.areasOfStrength || '',
                areasForImprovement: feedback.areasForImprovement || '',
              });
            });
            
            setStudentFeedbacks(feedbackMap);
            setFormData(formDataMap);
          }
        }
      } catch (err: any) {
        console.error('Error fetching shift details:', err);
        setError(err.message || 'Failed to load shift details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchShiftDetails();
  }, [shiftId, currentUser?.id]);

  const updateFormData = (studentId: string, field: string, value: string) => {
    setFormData(prev => {
      const newMap = new Map(prev);
      const currentData = newMap.get(studentId) || {
        overallFeedback: '',
        performanceRating: '',
        areasOfStrength: '',
        areasForImprovement: '',
      };
      newMap.set(studentId, { ...currentData, [field]: value });
      return newMap;
    });
  };

  const handleSaveFeedback = async (studentId: string) => {
    if (!shift || !currentUser?.id) return;

    const data = formData.get(studentId);
    if (!data || !data.overallFeedback.trim()) {
      toast({
        title: 'Missing Required Field',
        description: 'Please provide overall feedback',
        variant: 'destructive',
      });
      return;
    }

    setSavingStudentId(studentId);

    try {
      const feedbackData: Omit<ShiftFeedback, 'id' | 'createdAt' | 'updatedAt'> = {
        shiftId: shift.id,
        instructorId: currentUser.id,
        studentId: studentId,
        overallFeedback: data.overallFeedback.trim(),
        performanceRating: (data.performanceRating as 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement' | undefined) || undefined,
        areasOfStrength: data.areasOfStrength?.trim() || undefined,
        areasForImprovement: data.areasForImprovement?.trim() || undefined,
      };

      const existingFeedback = studentFeedbacks.get(studentId);
      const result = await saveShiftFeedback(feedbackData, existingFeedback?.id);

      if (result.success) {
        const studentName = students.find(s => s.id === studentId)?.fullName;
        toast({
          title: 'Feedback Saved',
          description: `Feedback for ${studentName} saved successfully`,
        });
        
        // Update local state with current timestamp
        if (result.data) {
          const feedbackWithTimestamp = {
            ...result.data,
            createdAt: existingFeedback?.createdAt || new Date(),
            updatedAt: new Date(),
          };
          setStudentFeedbacks(prev => new Map(prev).set(studentId, feedbackWithTimestamp));
        }
      } else {
        throw new Error(result.error || 'Failed to save feedback');
      }
    } catch (err: any) {
      console.error('Error saving feedback:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save feedback',
        variant: 'destructive',
      });
    } finally {
      setSavingStudentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading shift details...</p>
      </div>
    );
  }

  if (error || !shift) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Shift not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const shiftDate = parseISO(shift.date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">{shift.title}</h1>
        <p className="text-muted-foreground mt-2">Review student performance and provide feedback</p>
      </div>

      {/* Shift Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {format(shiftDate, 'EEEE, MMMM dd, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shift.startTime} - {shift.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{shift.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{shift.type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">
                  {shift.bookedCount} / {shift.capacity} students booked
                </p>
              </div>
            </div>
          </div>

          {shift.notes && (
            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Notes</p>
              <p className="text-sm text-muted-foreground">{shift.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Reviews & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Student Reviews & Feedback</CardTitle>
          <CardDescription>
            Provide individual feedback for each student's performance on this shift
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students have booked this shift yet</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {students.map((student) => {
                const feedback = studentFeedbacks.get(student.id);
                const hasReviewed = !!feedback;
                const data = formData.get(student.id) || {
                  overallFeedback: '',
                  performanceRating: '',
                  areasOfStrength: '',
                  areasForImprovement: '',
                };
                const isSaving = savingStudentId === student.id;

                return (
                  <AccordionItem 
                    key={student.id} 
                    value={student.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-base">{student.fullName}</p>
                            {student.bookingStatus === 'Attended' && !hasReviewed && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                                Submitted for Review
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-sm mt-1">
                            <FileText className="h-4 w-4 inline mr-1" />
                            {student.encounterCount} encounter{student.encounterCount !== 1 ? 's' : ''} submitted
                            {student.draftCount > 0 && (
                              <span className="text-muted-foreground">
                                {' '}• {student.draftCount} draft{student.draftCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          {hasReviewed ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          ) : student.bookingStatus === 'Attended' ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Awaiting Review
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Users className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="space-y-4">
                        {hasReviewed && (
                          <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                              Feedback saved on {format(
                                typeof feedback.createdAt === 'string'
                                  ? new Date(feedback.createdAt)
                                  : feedback.createdAt?.toDate?.() || new Date(feedback.createdAt),
                                'MMM dd, yyyy HH:mm'
                              )}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor={`feedback-${student.id}`}>
                            Overall Feedback <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id={`feedback-${student.id}`}
                            value={data.overallFeedback}
                            onChange={(e) => updateFormData(student.id, 'overallFeedback', e.target.value)}
                            placeholder={`Provide your feedback for ${student.fullName}'s performance on this shift...`}
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`rating-${student.id}`}>Performance Rating</Label>
                          <Select 
                            value={data.performanceRating} 
                            onValueChange={(value) => updateFormData(student.id, 'performanceRating', value)}
                          >
                            <SelectTrigger id={`rating-${student.id}`}>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                              <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`strengths-${student.id}`}>Areas of Strength</Label>
                          <Textarea
                            id={`strengths-${student.id}`}
                            value={data.areasOfStrength}
                            onChange={(e) => updateFormData(student.id, 'areasOfStrength', e.target.value)}
                            placeholder="What did this student do well?"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`improvement-${student.id}`}>Areas for Improvement</Label>
                          <Textarea
                            id={`improvement-${student.id}`}
                            value={data.areasForImprovement}
                            onChange={(e) => updateFormData(student.id, 'areasForImprovement', e.target.value)}
                            placeholder="What can this student work on?"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleSaveFeedback(student.id)}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save Feedback'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push(`/instructor/encounters?shiftId=${shift.id}&studentId=${student.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View {student.encounterCount} Encounter{student.encounterCount !== 1 ? 's' : ''}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function InstructorShiftDetailPage() {
  return (
    <RoleProtectedRoute allowedRoles={['Instructor', 'Administrator']}>
      <InstructorShiftDetailContent />
    </RoleProtectedRoute>
  );
}
