'use client';

import { useFormContext, Controller }
from 'react-hook-form';
import type { PatientCareFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';

interface NarrativeTabProps {
  onGenerateNarrative: (type: 'casePresentation' | 'patientAssessmentNarrative') => Promise<void>;
  isGenerating: boolean;
}

export function NarrativeTab({ onGenerateNarrative, isGenerating }: NarrativeTabProps) {
  const { control, formState: { errors } } = useFormContext<PatientCareFormData>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Case Presentation</CardTitle>
          <CardDescription>Summarize the patient's case. You can use AI to help draft this.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Controller
            name="casePresentation"
            control={control}
            render={({ field }) => <Textarea placeholder="Enter case presentation..." {...field} rows={6} />}
          />
          {errors.casePresentation && <p className="text-sm text-destructive">{errors.casePresentation.message}</p>}
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => onGenerateNarrative('casePresentation')}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Assessment Narrative</CardTitle>
          <CardDescription>Detailed narrative of the patient assessment. AI can assist here too.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Controller
            name="patientAssessmentNarrative"
            control={control}
            render={({ field }) => <Textarea placeholder="Enter patient assessment narrative..." {...field} rows={8} />}
          />
          {errors.patientAssessmentNarrative && <p className="text-sm text-destructive">{errors.patientAssessmentNarrative.message}</p>}
           <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => onGenerateNarrative('patientAssessmentNarrative')}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Reflection</CardTitle>
          <CardDescription>Your personal thoughts and learning points from this encounter.</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="studentReflection"
            control={control}
            render={({ field }) => <Textarea placeholder="Reflect on the encounter..." {...field} rows={5} />}
          />
          {errors.studentReflection && <p className="text-sm text-destructive">{errors.studentReflection.message}</p>}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Instructor Feedback</CardTitle>
          <CardDescription>Feedback from your instructor will appear here (read-only for students).</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="instructorFeedback"
            control={control}
            render={({ field }) => <Textarea placeholder="Awaiting instructor feedback..." {...field} rows={5} readOnly className="bg-background cursor-not-allowed" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
