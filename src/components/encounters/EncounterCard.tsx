'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, Pencil, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import type { PatientCareFormData } from '@/types';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { deleteEncounter } from '@/actions/patientCareFormActions';
import { useToast } from '@/hooks/use-toast';

interface EncounterCardProps {
  encounter: PatientCareFormData;
  onDelete?: () => void;
}

export function EncounterCard({ encounter, onDelete }: EncounterCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isDraft = encounter.isDraft;
  const isSubmitted = !encounter.isDraft;

  // Format patient info for display
  const patientInfo = `${encounter.age || 'Unknown age'}yo ${encounter.sex || 'Unknown sex'}`;
  const chiefComplaint = encounter.complaints && encounter.complaints.length > 0
    ? encounter.complaints.join(', ')
    : 'No complaints documented';

  // Format submission date - handle Firestore Timestamp objects
  const getFormattedDate = (date: any): string => {
    if (!date) return 'Date unknown';
    
    try {
      let dateObj: Date;
      
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else if (date?.toDate) {
        // Firestore Timestamp
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        // Try to convert to Date
        dateObj = new Date(date);
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Date unknown';
      }
      
      return format(dateObj, 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Date unknown';
    }
  };

  const submittedDate = getFormattedDate(encounter.submittedAt || encounter.updatedAt || encounter.createdAt);

  const handleView = () => {
    router.push(`/patient-care-form?encounterId=${encounter.id}&mode=view`);
  };

  const handleEdit = () => {
    router.push(`/patient-care-form?encounterId=${encounter.id}&shiftId=${encounter.shiftId}`);
  };

  const handleDeleteConfirm = async () => {
    if (!encounter.id || !encounter.studentId) {
      toast({
        title: 'Error',
        description: 'Cannot delete encounter: missing required information.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEncounter(encounter.id, encounter.studentId);
      
      if (result.success) {
        toast({
          title: 'Encounter Deleted',
          description: 'Draft encounter has been successfully deleted.',
        });
        setShowDeleteDialog(false);
        if (onDelete) {
          onDelete();
        }
      } else {
        toast({
          title: 'Delete Failed',
          description: result.error || 'Failed to delete encounter.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the encounter.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">
                  {encounter.encounterNumber ? `Encounter #${encounter.encounterNumber}` : 'Encounter'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {isDraft && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    📝 Draft
                  </Badge>
                )}
                {isSubmitted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✅ Submitted
                  </Badge>
                )}
                {encounter.reviewStatus === 'Reviewed' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    👁️ Reviewed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Patient:</p>
            <p className="text-sm">{patientInfo}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chief Complaint:</p>
            <p className="text-sm line-clamp-2">{chiefComplaint}</p>
          </div>

          {encounter.primaryImpressionCondition && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Primary Impression:</p>
              <p className="text-sm">{encounter.primaryImpressionCondition}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">
              {isDraft ? 'Last saved:' : 'Submitted:'} {submittedDate}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            {isDraft && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isSubmitted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleView}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            )}
          </div>

          {/* Instructor Feedback Section */}
          {encounter.instructorFeedback && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Instructor Feedback</p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {encounter.instructorFeedback}
                  </p>
                  {encounter.instructorFeedback && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Reviewed
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft Encounter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this draft encounter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

