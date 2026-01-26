'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, CheckCircle2, Info } from 'lucide-react';
import { submitEncounterFeedback } from '@/actions/patientCareFormActions';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

interface InstructorFeedbackSectionProps {
  encounterId: string;
  existingFeedback?: string;
  reviewedByInstructorId?: string;
  reviewedAt?: Date | string;
}

export function InstructorFeedbackSection({
  encounterId,
  existingFeedback,
  reviewedByInstructorId,
  reviewedAt,
}: InstructorFeedbackSectionProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState(existingFeedback || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
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
    setHasChanges(feedback !== (existingFeedback || ''));
  }, [feedback, existingFeedback]);

  async function handleSave() {
    if (!currentUser || !feedback.trim()) return;

    setIsSaving(true);

    try {
      const result = await submitEncounterFeedback(
        encounterId,
        currentUser.id,
        feedback.trim()
      );

      if (result.success) {
        toast({
          title: 'Feedback Saved',
          description: 'Your encounter feedback has been saved successfully',
        });
        setHasChanges(false);
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
      setIsSaving(false);
    }
  }

  const isReviewed = !!existingFeedback && !!reviewedByInstructorId;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Instructor Feedback (Optional)</CardTitle>
            <CardDescription>
              Provide specific feedback on this individual encounter
            </CardDescription>
          </div>
          {isReviewed && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Shift-level feedback is required and should be completed on the shift detail page.
            This encounter-specific feedback is optional and provides additional granular detail.
          </AlertDescription>
        </Alert>

        {/* Existing Review Info */}
        {isReviewed && reviewedAt && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Feedback saved on {formatDate(reviewedAt, 'MMM dd, yyyy HH:mm')}
            </AlertDescription>
          </Alert>
        )}

        {/* Feedback Textarea */}
        <div className="space-y-2">
          <label htmlFor="encounter-feedback" className="text-sm font-medium">
            Encounter Feedback
          </label>
          <Textarea
            id="encounter-feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide specific feedback on this encounter (e.g., assessment quality, intervention appropriateness, documentation completeness)..."
            rows={6}
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground">
            {feedback.length} characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || !feedback.trim() || !hasChanges}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Encounter Feedback
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

