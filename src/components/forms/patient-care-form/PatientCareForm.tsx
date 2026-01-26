// src/components/forms/patient-care-form/PatientCareForm.tsx
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { PatientCareFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientAssessmentTab } from './PatientAssessmentTab';
import { VitalsInterventionsTab } from './VitalsInterventionsTab';
import { NarrativeTab } from './NarrativeTab';
import { savePatientCareForm } from '@/actions/patientCareFormActions';
import { generateSuggestedNarrative, getExtractedSkills } from '@/actions/aiActions';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Loader2, Brain, Sparkles } from 'lucide-react';
import { formatISO, parseISO } from 'date-fns';

const defaultValues: Partial<PatientCareFormData> = {
  // Required fields (will be set dynamically)
  shiftId: '',
  studentId: '',
  
  // Call Information
  teamLeaderIndicator: false,
  preceptorName: '',
  teamSize: undefined,
  responseMode: "N/A",
  patientDisposition: "N/A",
  transportModeFromScene: "N/A",
  
  // Patient Demographics
  age: undefined,
  ageUnit: "N/A",
  sex: "N/A", 
  ethnicity: "N/A",

  // History & Complaints
  patientInterview: false,
  complaints: [],
  
  // Clinical Assessment
  patientExam: false,
  patientAlertOriented: "N/A",
  gcsEyes: "", 
  gcsVerbal: "",
  gcsMotor: "",
  gcsTotal: undefined,
  pupilsEqual: "N/A",
  pupilsRound: "N/A",
  pupilsReactive: "N/A",
  skinCondition: [],
  lungSounds: [],
  airwayAssessmentNotes: "",
  airwayManagementRequired: false,
  airwayManagementOutcome: "N/A",
  
  // Specific Assessments
  cSpineCleared: false,
  cSpineClearanceNotes: "",
  anteNatalExamPerformed: false,
  anteNatalFindings: "",
  postNatalExamPerformed: false,
  postNatalFindings: "",

  // Primary Impression Defaults
  primaryImpressionCondition: "N/A",
  primaryImpressionCardiacArrestWitnessedBy: "N/A",
  primaryImpressionCardiacArrestReturnOfPulse: "N/A",
  primaryImpressionTraumaMechanism: [], 
  primaryImpressionTraumaCause: "N/A",
  primaryImpressionTraumaIntent: "N/A",
  primaryPatientCriticality: "N/A",

  // Secondary Impression Defaults
  secondaryImpressionCondition: "N/A",
  secondaryImpressionCardiacArrestWitnessedBy: "N/A",
  secondaryImpressionCardiacArrestReturnOfPulse: "N/A",
  secondaryImpressionTraumaMechanism: [], 
  secondaryImpressionTraumaCause: "N/A",
  secondaryImpressionTraumaIntent: "N/A",
  secondaryPatientCriticality: "N/A",
  
  // Vitals & Interventions Tab Defaults
  vitals: [],
  airwayProcedures: [], 
  breathingSupportProcedures: [],
  cardiacProcedures: [],
  vascularAccessProcedures: [],
  traumaCareProcedures: [],
  obstetricsNeonatalProcedures: [],
  otherInterventions: [],
  medicationsAdministered: [],

  // Narrative Tab
  casePresentation: '',
  patientAssessmentNarrative: '',
  studentReflection: '',
  instructorFeedback: '', 
  isDraft: true,
};

interface PatientCareFormProps {
  initialData?: PatientCareFormData | null;
  shiftId?: string;
  isViewMode?: boolean;
}

export function PatientCareForm({ initialData, shiftId, isViewMode = false }: PatientCareFormProps) {
  const methods = useForm<PatientCareFormData>({ 
    defaultValues: initialData || defaultValues 
  });
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [extractedSkills, setExtractedSkills] = React.useState<string[] | undefined>(undefined);

  // Reset form when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  const onSubmit = async (data: PatientCareFormData, isDraft: boolean) => {
    setIsSubmitting(true);
    setExtractedSkills(undefined);
    // Ensure GCS total is a number or undefined
    const gcsEyesScore = parseInt(data.gcsEyes || "0", 10);
    const gcsVerbalScore = parseInt(data.gcsVerbal || "0", 10);
    const gcsMotorScore = parseInt(data.gcsMotor || "0", 10);

    const gcsTotal = (data.gcsEyes && data.gcsVerbal && data.gcsMotor && 
                      !isNaN(gcsEyesScore) && !isNaN(gcsVerbalScore) && !isNaN(gcsMotorScore))
      ? gcsEyesScore + gcsVerbalScore + gcsMotorScore
      : undefined;
      
    // Prepare form data with required fields
    const formDataToSave = { 
      ...data, 
      gcsTotal, 
      isDraft,
      studentId: currentUser?.id || '',
      shiftId: shiftId || data.shiftId || '', // Use prop first, then fall back to form data
    };

    // Validate required fields
    if (!formDataToSave.shiftId) {
      toast({
        title: 'Missing Shift Information',
        description: 'Please select a shift before submitting the encounter form.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (!formDataToSave.studentId) {
      toast({
        title: 'Authentication Error',
        description: 'Unable to identify student. Please log in again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await savePatientCareForm(formDataToSave);
      if (result.success) {
        toast({
          title: `Form ${isDraft ? 'Saved as Draft' : 'Submitted'}!`,
          description: `Patient care form has been successfully ${isDraft ? 'saved' : 'submitted'}.`,
          variant: isDraft ? "default" : "default", 
        });
        if (result.data?.id) {
          const baseData = isDraft ? result.data : defaultValues;
          let resetData: any = { ...baseData, ...result.data, isDraft }; 
          
           Object.keys(defaultValues).forEach(key => {
            const fieldKey = key as keyof Partial<PatientCareFormData>;
            if (resetData[fieldKey] === undefined || resetData[fieldKey] === null) {
               resetData[fieldKey] = defaultValues[fieldKey];
            }
            if (Array.isArray(defaultValues[fieldKey]) && resetData[fieldKey] === null) {
              resetData[fieldKey] = [];
            }
          });

          if (resetData.medicationsAdministered) {
            resetData.medicationsAdministered = resetData.medicationsAdministered.map((med: any) => ({
              ...med,
              timeAdministered: med.timeAdministered ? formatISO(parseISO(med.timeAdministered)).substring(0, 16) : undefined,
            }));
          }
           if (resetData.vitals) {
            resetData.vitals = resetData.vitals.map((vital: any) => ({
              ...vital,
              timestamp: vital.timestamp ? formatISO(parseISO(vital.timestamp)).substring(0, 16) : '',
            }));
          }
          if (resetData.traumaCareProcedures) {
            resetData.traumaCareProcedures = resetData.traumaCareProcedures.map((trauma: any) => ({
              ...trauma,
              tourniquetTimeApplied: trauma.tourniquetTimeApplied ? trauma.tourniquetTimeApplied : undefined, // Assuming HH:MM string
            }));
          }
          // Add similar formatting for obstetricsNeonatalProcedures time fields if any
          if (resetData.obstetricsNeonatalProcedures) {
            resetData.obstetricsNeonatalProcedures = resetData.obstetricsNeonatalProcedures.map((ob: any) => ({
                ...ob,
                timeOfDelivery: ob.timeOfDelivery ? ob.timeOfDelivery : undefined, // Already HH:MM string
                timeOfPlacentaDelivery: ob.timeOfPlacentaDelivery ? ob.timeOfPlacentaDelivery : undefined, // Already HH:MM string
            }));
          }


          methods.reset(resetData);

        } else { 
          methods.reset(defaultValues); 
        }
        if (result.skills && result.skills.length > 0) {
          setExtractedSkills(result.skills);
           toast({
            title: "Skills Extracted",
            description: `Found ${result.skills.length} skills: ${result.skills.join(', ')}`,
          });
        } else if (result.skills) { 
           setExtractedSkills([]);
           toast({
            title: "AI Skill Analysis Complete",
            description: "No specific skills were automatically identified from the narrative. You can log them manually if applicable.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${isDraft ? 'save' : 'submit'} form.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      console.error("Form submission error", error);
    }
    setIsSubmitting(false);
  };

  const handleGenerateNarrative = async (type: 'casePresentation' | 'patientAssessmentNarrative') => {
    setIsGenerating(true);
    const currentValues = methods.getValues();
    const gcsEyesScore = parseInt(currentValues.gcsEyes || "0", 10);
    const gcsVerbalScore = parseInt(currentValues.gcsVerbal || "0", 10);
    const gcsMotorScore = parseInt(currentValues.gcsMotor || "0", 10);
    const gcsSummary = (currentValues.gcsEyes && currentValues.gcsVerbal && currentValues.gcsMotor)
      ? `E${gcsEyesScore}V${gcsVerbalScore}M${gcsMotorScore} (Total: ${gcsEyesScore + gcsVerbalScore + gcsMotorScore})`
      : "N/A";

    const snapshot = {
      responseMode: currentValues.responseMode,
      patientDisposition: currentValues.patientDisposition,
      age: currentValues.age,
      gender: currentValues.sex, 
      complaints: currentValues.complaints,
      primaryImpressionCondition: currentValues.primaryImpressionCondition,
      secondaryImpressionCondition: currentValues.secondaryImpressionCondition,
      vitals: currentValues.vitals?.map(v => 
        `Time: ${v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : 'N/A'}, BP: ${v.bloodPressure || 'N/A'}, HR: ${v.heartRate || 'N/A'}, RR: ${v.respirationsRate || 'N/A'}, SpO2: ${v.spo2 || 'N/A'}%, GCS: ${v.gcsSnapshotTotal || 'N/A'}`
      ).join('; ') || "N/A",
      airwayProcedures: currentValues.airwayProcedures?.map(p => `${p.procedureName || 'Unknown Airway Procedure'} (Success: ${p.intubationSuccessful || p.sgaSuccessful || p.opaSuccessful || p.npaSuccessful || 'N/A'})`),
      breathingSupportProcedures: currentValues.breathingSupportProcedures?.map(b => `${b.procedureName || 'Unknown Breathing Support'} (Flow: ${b.nasalCannulaFlowRate || b.simpleMaskFlowRate || b.nonRebreatherMaskFlowRate || 'N/A'} L/min)`).join(', '),
      cardiacProcedures: currentValues.cardiacProcedures?.map(c => {
         let details = `${c.rhythm || 'Rhythm N/A'}`;
         if(c.procedureName && c.procedureName !== 'N/A') {
            details += ` | Procedure: ${c.procedureName}`;
            if(c.procedureName === 'Defibrillation') details += ` (Shocks: ${c.defibNumberOfShocks || 'N/A'}, ROSC: ${c.defibRosc || 'N/A'})`;
            else if (c.procedureName === 'Pacing') details += ` (Capture: ${c.pacingCaptureAchieved || 'N/A'})`;
         }
         return details;
      }).join('; ') || "N/A",
      medicationsAdministered: currentValues.medicationsAdministered?.map(m => `${m.medicationName || 'Unknown Med'} ${m.dose || ''}${m.unit || ''} via ${m.route || 'N/A'}`),
      gcsMainAssessment: gcsSummary,
    };

    const result = await generateSuggestedNarrative(snapshot as any); 
    if (result.suggestedNarrative) {
      methods.setValue(type, result.suggestedNarrative);
      toast({ title: "Narrative Suggested", description: `${type === 'casePresentation' ? 'Case presentation' : 'Patient assessment'} narrative has been populated.` });
    } else {
      toast({ title: "Error", description: result.error || "Failed to generate narrative.", variant: "destructive" });
    }
    setIsGenerating(false);
  };
  
  const handleExtractSkills = async () => {
    setIsGenerating(true);
    setExtractedSkills(undefined); 
    const casePresentation = methods.getValues("casePresentation") || "";
    const patientAssessment = methods.getValues("patientAssessmentNarrative") || "";
    
    const airwayProceduresSummary = (methods.getValues("airwayProcedures") || [])
      .map(p => `${p.procedureName} (Attempts: ${p.intubationAttempts || p.sgaAttempts || p.npaAttempts || p.cricAttempts || 'N/A'}, Success: ${p.intubationSuccessful || p.sgaSuccessful || p.npaSuccessful || p.cricSuccessful || 'N/A'})`)
      .join('. ');

    const breathingSupportSummary = (methods.getValues("breathingSupportProcedures") || [])
      .map(b => `${b.procedureName} (Flow: ${b.nasalCannulaFlowRate || b.simpleMaskFlowRate || b.nonRebreatherMaskFlowRate || 'N/A'} L/min, O2%: ${b.venturiMaskO2Percent || b.cpapFiO2 || b.mechVentFiO2 || 'N/A'})`)
      .join('. ');
      
    const cardiacProceduresSummary = (methods.getValues("cardiacProcedures") || [])
      .map(c => `${c.procedureName || c.rhythm || 'Cardiac Event'}`)
      .join('. ');
      
    const vascularAccessSummary = (methods.getValues("vascularAccessProcedures") || [])
      .map(va => `${va.procedureType} at ${va.accessLocation || 'N/A'} (${va.accessSide || 'N/A'})`)
      .join('. ');
      
    const traumaSummary = (methods.getValues("traumaCareProcedures") || [])
      .map(t => `${t.procedureCategory}: ${t.procedureName}`)
      .join('. ');

    const medicationsSummary = (methods.getValues("medicationsAdministered") || [])
      .map(m => `${m.medicationName} ${m.dose}${m.unit} via ${m.route}`)
      .join('. ');

    const narrative = `${casePresentation} ${patientAssessment} Interventions: ${airwayProceduresSummary} ${breathingSupportSummary} ${cardiacProceduresSummary} ${vascularAccessSummary} ${traumaSummary} ${medicationsSummary}`.trim();
    
    const result = await getExtractedSkills(narrative);
     if (result.skills && result.skills.length > 0) {
        setExtractedSkills(result.skills);
        toast({
          title: "Skills Extracted",
          description: `Found ${result.skills.length} skills: ${result.skills.join(', ')}`,
        });
      } else if (result.skills && result.skills.length === 0) {
        setExtractedSkills([]);
         toast({
          title: "No Specific Skills Extracted",
          description: "AI did not identify specific skills from the narrative. You can log them manually if applicable.",
        });
      }
      else {
        toast({ title: "Skill Extraction Failed", description: result.error || "Could not extract skills.", variant: "destructive" });
      }
    setIsGenerating(false);
  }


  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {isViewMode && (
          <div className="mb-6 p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Read-Only Mode
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  This encounter has been submitted and is in view-only mode. You cannot make changes to submitted encounters.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="patient-assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient-assessment">Patient Assessment</TabsTrigger>
            <TabsTrigger value="vitals-interventions">Vitals & Interventions</TabsTrigger>
            <TabsTrigger value="narrative">Narrative</TabsTrigger>
          </TabsList>
          <TabsContent value="patient-assessment" className="mt-6">
            <PatientAssessmentTab disabled={isViewMode} />
          </TabsContent>
          <TabsContent value="vitals-interventions" className="mt-6">
            <VitalsInterventionsTab />
          </TabsContent>
          <TabsContent value="narrative" className="mt-6">
            <NarrativeTab 
              onGenerateNarrative={handleGenerateNarrative}
              isGenerating={isGenerating}
            />
          </TabsContent>
        </Tabs>

        {extractedSkills && extractedSkills.length > 0 && (
          <div className="p-4 border rounded-md bg-muted">
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" /> AI Suggested Skills
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {extractedSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Note: These are suggestions. Please verify and add them manually to your skills log if accurate.</p>
          </div>
        )}
         {extractedSkills && extractedSkills.length === 0 && (
          <div className="p-4 border rounded-md bg-muted">
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" /> AI Skill Suggestion
            </h3>
            <p className="text-muted-foreground">AI analysis complete. No specific skills were automatically identified from the narrative. Please log skills manually if applicable.</p>
          </div>
        )}


        {!isViewMode && (
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleExtractSkills}
              disabled={isSubmitting || isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Extract Skills with AI
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => methods.handleSubmit((data) => onSubmit(data, true))()}
              disabled={isSubmitting || isGenerating}
              className="w-full sm:w-auto"
            >
              {isSubmitting && methods.getValues('isDraft') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save as Draft
            </Button>
            <Button 
              type="button" 
              onClick={() => methods.handleSubmit((data) => onSubmit(data, false))()}
              disabled={isSubmitting || isGenerating}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isSubmitting && !methods.getValues('isDraft') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Report
            </Button>
          </div>
        )}
        
        {isViewMode && (
          <div className="p-4 border rounded-md bg-muted text-center mt-8">
            <p className="text-muted-foreground">
              This encounter has been submitted and is in read-only mode.
            </p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
