
'use client';

import * as React from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import type { PatientCareFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpressionSection } from './ImpressionSection';
import {
  responseModeOptions, // Updated
  dispositions,
  transportModes,
  ageUnitOptions, // New
  sexOptions, // New (replaces genders)
  ethnicities,
  alertOrientedOptions,
  complaintsOptions, // Updated
  gcsEyesOptions, // New
  gcsVerbalOptions, // New
  gcsMotorOptions, // New
  pupilStateOptions, // New
  skinConditionOptions, // New
  lungSoundsOptions, // New
} from './patient-care-form-constants';


interface PatientAssessmentTabProps {
  disabled?: boolean;
}

export function PatientAssessmentTab({ disabled = false }: PatientAssessmentTabProps) {
  const { control, watch, setValue } = useFormContext<PatientCareFormData>();
  const airwayManagementRequired = watch('airwayManagementRequired');

  // Watch GCS individual scores for auto-calculation
  const gcsEyes = useWatch({ control, name: 'gcsEyes' });
  const gcsVerbal = useWatch({ control, name: 'gcsVerbal' });
  const gcsMotor = useWatch({ control, name: 'gcsMotor' });

  React.useEffect(() => {
    const eyesScore = parseInt(gcsEyes || "0", 10);
    const verbalScore = parseInt(gcsVerbal || "0", 10);
    const motorScore = parseInt(gcsMotor || "0", 10);

    if (gcsEyes && gcsVerbal && gcsMotor) { // Ensure all are selected
        const total = eyesScore + verbalScore + motorScore;
        setValue('gcsTotal', total);
    } else {
        setValue('gcsTotal', undefined); // Or 0 if preferred when incomplete
    }
  }, [gcsEyes, gcsVerbal, gcsMotor, setValue]);


  return (
    <div className="space-y-6">
      {/* Card 1: Call Information */}
      <Card>
        <CardHeader>
          <CardTitle>Call Information</CardTitle>
          <CardDescription>Details about the emergency call and team.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="teamLeaderIndicator"
              control={control}
              render={({ field }) => <Checkbox id="teamLeaderIndicator" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="teamLeaderIndicator">I was the successful Team Leader</Label>
          </div>
          <div className="space-y-1">
            <Label htmlFor="preceptorName">Preceptor Name</Label>
            <Controller name="preceptorName" control={control} render={({ field }) => <Input id="preceptorName" {...field} value={field.value ?? ''} />} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="teamSize">Team Size</Label>
            <Controller 
              name="teamSize" 
              control={control} 
              render={({ field }) => (
                <Input 
                  id="teamSize" 
                  type="number" 
                  {...field} 
                  value={field.value ?? ''} 
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} 
                />
              )} 
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="responseMode">Response Mode</Label>
            <Controller
              name="responseMode"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select response mode" /></SelectTrigger>
                  <SelectContent>{responseModeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="patientDisposition">Patient Disposition</Label>
            <Controller
              name="patientDisposition"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select disposition" /></SelectTrigger>
                  <SelectContent>{dispositions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
          </div>
           <div className="space-y-1">
            <Label htmlFor="transportModeFromScene">Transport Mode From Scene</Label>
            <Controller
              name="transportModeFromScene"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select transport mode" /></SelectTrigger>
                  <SelectContent>{transportModes.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Patient Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
          <CardDescription>Basic patient information.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Controller 
                name="age" 
                control={control} 
                render={({ field }) => (
                  <Input 
                    id="age" 
                    type="number" 
                    {...field} 
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                  />
                )} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ageUnit">Age Unit</Label>
               <Controller name="ageUnit" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select age unit" /></SelectTrigger>
                  <SelectContent>{ageUnitOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sex">Sex</Label>
               <Controller name="sex" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select sex" /></SelectTrigger>
                  <SelectContent>{sexOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ethnicity">Ethnicity</Label>
               <Controller name="ethnicity" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select ethnicity" /></SelectTrigger>
                  <SelectContent>{ethnicities.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </div>
        </CardContent>
      </Card>

      {/* Card 3: History & Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>History & Complaints</CardTitle>
          <CardDescription>Patient history and reported complaints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Controller name="patientInterview" control={control} render={({ field }) => <Checkbox id="patientInterview" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="patientInterview">I performed the patient interview (patient history)</Label>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Complaints</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {complaintsOptions.map((complaint) => (
                <div key={complaint} className="flex items-center space-x-2">
                  <Controller
                    name="complaints"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Checkbox
                        id={`complaint-${complaint.replace(/[^a-zA-Z0-9]/g, '')}`}
                        checked={field.value?.includes(complaint)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, complaint]);
                          } else {
                            field.onChange(currentValues.filter((value) => value !== complaint));
                          }
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`complaint-${complaint.replace(/[^a-zA-Z0-9]/g, '')}`} className="font-normal">{complaint}</Label>
                </div>
              ))}
              </div>
            </div>
        </CardContent>
      </Card>
      
      {/* Card 4: Clinical Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Assessment</CardTitle>
          <CardDescription>Initial patient examination findings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller name="patientExam" control={control} render={({ field }) => <Checkbox id="patientExam" checked={field.value} onCheckedChange={field.onChange} />} />
            <Label htmlFor="patientExam">I performed the patient exam</Label>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Patient Alert and Oriented (AVPU)</Label>
            <Controller
              name="patientAlertOriented"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value} className="space-y-1">
                  {alertOrientedOptions.map((opt) => (
                     <div key={opt.value} className="flex items-center space-x-2">
                       <RadioGroupItem value={opt.value} id={`alertOpt${opt.value}`} />
                       <Label htmlFor={`alertOpt${opt.value}`} className="font-normal">{opt.label}</Label>
                     </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label>Glasgow Coma Scale (GCS)</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="gcsEyes">Eyes</Label>
                <Controller name="gcsEyes" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""} defaultValue={field.value}>
                    <SelectTrigger id="gcsEyes"><SelectValue placeholder="E" /></SelectTrigger>
                    <SelectContent>{gcsEyesOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gcsVerbal">Verbal</Label>
                <Controller name="gcsVerbal" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""} defaultValue={field.value}>
                    <SelectTrigger id="gcsVerbal"><SelectValue placeholder="V" /></SelectTrigger>
                    <SelectContent>{gcsVerbalOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gcsMotor">Motor</Label>
                <Controller name="gcsMotor" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""} defaultValue={field.value}>
                    <SelectTrigger id="gcsMotor"><SelectValue placeholder="M" /></SelectTrigger>
                    <SelectContent>{gcsMotorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                  </Select>)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gcsTotal">Total</Label>
                <Controller name="gcsTotal" control={control} render={({ field }) => <Input id="gcsTotal" value={field.value === undefined ? 'N/A' : String(field.value)} readOnly className="bg-muted" />} />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Pupils</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
              {[
                { name: "pupilsEqual" as const, label: "Equal" },
                { name: "pupilsRound" as const, label: "Round" },
                { name: "pupilsReactive" as const, label: "Reactive to Light" }
              ].map(pupilCheck => (
                <div key={pupilCheck.name} className="space-y-1">
                  <Label>{pupilCheck.label}</Label>
                  <Controller name={pupilCheck.name} control={control} render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value ?? "N/A"} defaultValue={field.value} className="flex space-x-4">
                      {pupilStateOptions.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.value} id={`${pupilCheck.name}${opt.value}`} />
                          <Label htmlFor={`${pupilCheck.name}${opt.value}`} className="font-normal">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Skin Assessment</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {skinConditionOptions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Controller name="skinCondition" control={control} defaultValue={[]} render={({ field }) => (
                    <Checkbox
                      id={`skin-${condition.replace(/[^a-zA-Z0-9]/g, '')}`}
                      checked={field.value?.includes(condition)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) { field.onChange([...currentValues, condition]); } 
                        else { field.onChange(currentValues.filter((value) => value !== condition)); }
                      }} /> )} />
                <Label htmlFor={`skin-${condition.replace(/[^a-zA-Z0-9]/g, '')}`} className="font-normal">{condition}</Label>
              </div> ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label>Lung Sounds Assessment</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {lungSoundsOptions.map((sound) => (
              <div key={sound} className="flex items-center space-x-2">
                <Controller name="lungSounds" control={control} defaultValue={[]} render={({ field }) => (
                  <Checkbox
                    id={`lung-${sound.replace(/[^a-zA-Z0-9]/g, '')}`}
                    checked={field.value?.includes(sound)}
                    onCheckedChange={(checked) => {
                      const currentValues = field.value || [];
                      if (checked) { field.onChange([...currentValues, sound]); }
                      else { field.onChange(currentValues.filter((value) => value !== sound)); }
                    }} /> )} />
                <Label htmlFor={`lung-${sound.replace(/[^a-zA-Z0-9]/g, '')}`} className="font-normal">{sound}</Label>
              </div> ))}
            </div>
          </div>
          
          <div className="space-y-1 pt-2">
            <Label htmlFor="airwayAssessmentNotes">Detailed Airway Assessment Notes</Label>
            <Controller name="airwayAssessmentNotes" control={control} render={({ field }) => <Textarea id="airwayAssessmentNotes" placeholder="Describe airway characteristics and findings..." {...field} value={field.value ?? ''} rows={3} />} />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Controller name="airwayManagementRequired" control={control} render={({ field }) => <Checkbox id="airwayManagementRequired" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="airwayManagementRequired">The patient required airway management</Label>
            </div>
            {airwayManagementRequired && (
              <Controller
                name="airwayManagementOutcome"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value} className="pl-6 space-y-1">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="did not manage" id="amOutcome1" /><Label htmlFor="amOutcome1" className="font-normal">but I did not manage the patient's airway</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="successfully managed" id="amOutcome2" /><Label htmlFor="amOutcome2" className="font-normal">and I successfully managed the patient's airway</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="did not successfully manage" id="amOutcome3" /><Label htmlFor="amOutcome3" className="font-normal">but I did not successfully manage the patient's airway</Label></div>
                  </RadioGroup>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 5: Specific Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Specific Assessments</CardTitle>
          <CardDescription>Targeted assessment details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* C-Spine Assessment */}
          <div className="space-y-2">
            <h4 className="font-medium text-md">C-Spine Assessment</h4>
            <div className="flex items-center space-x-2">
              <Controller name="cSpineCleared" control={control} render={({ field }) => <Checkbox id="cSpineCleared" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="cSpineCleared">C-Spine Cleared per Recognised Technique</Label>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cSpineClearanceNotes">Clearance Notes/Method</Label>
              <Controller name="cSpineClearanceNotes" control={control} render={({ field }) => <Textarea id="cSpineClearanceNotes" placeholder="Enter C-Spine clearance notes or method used..." {...field} value={field.value ?? ''} rows={2} />} />
            </div>
          </div>
          
          <Separator />

          {/* Obstetric Assessment */}
          <div className="space-y-2">
            <h4 className="font-medium text-md">Obstetric Assessment</h4>
            <div className="flex items-center space-x-2">
              <Controller name="anteNatalExamPerformed" control={control} render={({ field }) => <Checkbox id="anteNatalExamPerformed" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="anteNatalExamPerformed">Ante-natal Examination Performed</Label>
            </div>
            <div className="space-y-1">
              <Label htmlFor="anteNatalFindings">Ante-natal Findings</Label>
              <Controller name="anteNatalFindings" control={control} render={({ field }) => <Textarea id="anteNatalFindings" placeholder="Enter ante-natal findings..." {...field} value={field.value ?? ''} rows={2} />} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Controller name="postNatalExamPerformed" control={control} render={({ field }) => <Checkbox id="postNatalExamPerformed" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="postNatalExamPerformed">Post-natal Examination Performed</Label>
            </div>
            <div className="space-y-1">
              <Label htmlFor="postNatalFindings">Post-natal Findings</Label>
              <Controller name="postNatalFindings" control={control} render={({ field }) => <Textarea id="postNatalFindings" placeholder="Enter post-natal findings..." {...field} value={field.value ?? ''} rows={2} />} />
            </div>
          </div>
        </CardContent>
      </Card>
      

      <Separator />
      
      <Tabs defaultValue="primary-impression" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primary-impression">Primary Impression</TabsTrigger>
          <TabsTrigger value="secondary-impression">Secondary Impression</TabsTrigger>
        </TabsList>
        <TabsContent value="primary-impression" className="mt-0">
          <ImpressionSection prefix="primary" />
        </TabsContent>
        <TabsContent value="secondary-impression" className="mt-0">
          <ImpressionSection prefix="secondary" />
        </TabsContent>
      </Tabs>

    </div>
  );
}
