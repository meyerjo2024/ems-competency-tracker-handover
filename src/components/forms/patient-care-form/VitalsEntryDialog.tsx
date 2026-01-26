// src/components/forms/patient-care-form/VitalsEntryDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { VitalSignEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  gcsEyesOptions, gcsVerbalOptions, gcsMotorOptions,
  skinConditionOptions, lungSoundsOptions,
  pulseStrengthOptions, bloodPressureMethodOptions, pupilSizeOptions,
  pupilReactionOptions, respirationsQualityOptions, temperatureRouteOptions,
  bloodGlucoseMethodOptions
} from './patient-care-form-constants';
import { formatISO, parseISO } from 'date-fns';

interface VitalsEntryDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<VitalSignEntry>;
  onSave: (data: VitalSignEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const getDefaultTimestamp = () => formatISO(new Date()).substring(0, 16); // YYYY-MM-DDTHH:mm

const defaultValues: Partial<VitalSignEntry> = {
  timestamp: getDefaultTimestamp(),
  obtainedVitals: false,
  // Cardiovascular
  bloodPressure: '',
  bloodPressureMethod: 'N/A',
  heartRate: undefined,
  pulseStrengthQuality: 'N/A',
  orthostaticBpPerformed: false,
  orthostaticLyingBpHr: '',
  orthostaticStandingBpHr: '',
  // Respiratory
  respirationsRate: undefined,
  respirationsQuality: 'N/A',
  spo2: undefined,
  endTidalCO2: '',
  // Neurological
  painScale: undefined,
  pupilLeftSize: 'N/A',
  pupilLeftReaction: 'N/A',
  pupilRightSize: 'N/A',
  pupilRightReaction: 'N/A',
  gcsSnapshotEyes: '',
  gcsSnapshotVerbal: '',
  gcsSnapshotMotor: '',
  gcsSnapshotTotal: undefined,
  // Other
  skinSnapshot: [],
  lungSoundsSnapshot: [],
  temperature: undefined,
  temperatureRoute: 'N/A',
  bloodGlucoseLevel: '',
  bloodGlucoseMethod: 'N/A',
  isNeonatalForApgar: false,
  apgarScore: '',
};

export function VitalsEntryDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: VitalsEntryDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<VitalSignEntry>({
    defaultValues: { ...defaultValues, ...initialData, timestamp: initialData?.timestamp ? formatISO(parseISO(initialData.timestamp)).substring(0,16) : getDefaultTimestamp() },
  });

  const { control, handleSubmit, watch, setValue, reset } = methods;

  const gcsEyes = watch('gcsSnapshotEyes');
  const gcsVerbal = watch('gcsSnapshotVerbal');
  const gcsMotor = watch('gcsSnapshotMotor');
  const orthostaticPerformed = watch('orthostaticBpPerformed');
  const isNeonatal = watch('isNeonatalForApgar');


  React.useEffect(() => {
    const eyesScore = parseInt(gcsEyes || "0", 10);
    const verbalScore = parseInt(gcsVerbal || "0", 10);
    const motorScore = parseInt(gcsMotor || "0", 10);

    if (gcsEyes && gcsVerbal && gcsMotor) {
      setValue('gcsSnapshotTotal', eyesScore + verbalScore + motorScore);
    } else {
      setValue('gcsSnapshotTotal', undefined);
    }
  }, [gcsEyes, gcsVerbal, gcsMotor, setValue]);

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData, timestamp: initialData?.timestamp ? formatISO(parseISO(initialData.timestamp)).substring(0,16) : getDefaultTimestamp() });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: VitalSignEntry) => {
    const submissionData = {
      ...data,
      id: initialData?.id || Date.now().toString(), 
      timestamp: data.timestamp ? formatISO(new Date(data.timestamp)) : formatISO(new Date()),
      // Ensure numeric fields are numbers or undefined
      heartRate: data.heartRate === undefined || data.heartRate === null || isNaN(Number(data.heartRate)) ? undefined : Number(data.heartRate),
      respirationsRate: data.respirationsRate === undefined || data.respirationsRate === null || isNaN(Number(data.respirationsRate)) ? undefined : Number(data.respirationsRate),
      spo2: data.spo2 === undefined || data.spo2 === null || isNaN(Number(data.spo2)) ? undefined : Number(data.spo2),
      painScale: data.painScale === undefined || data.painScale === null || isNaN(Number(data.painScale)) ? undefined : Number(data.painScale),
      temperature: data.temperature === undefined || data.temperature === null || isNaN(Number(data.temperature)) ? undefined : Number(data.temperature),
    };
    onSave(submissionData);
    setIsOpen(false);
  };

  const dialogTitle = initialData?.id ? 'Edit Vital Signs Entry' : 'Add Vital Signs Entry';
  
  const handleNumericInput = (field: any, value: string) => {
    if (value === '') {
      field.onChange(undefined);
    } else {
      const num = parseInt(value, 10);
      field.onChange(isNaN(num) ? undefined : num);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && <DialogTrigger asChild onClick={() => setIsOpen(true)}>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[70vh] p-1 pr-5">
              <div className="space-y-6 py-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="timestamp">Timestamp</Label>
                    <Controller
                      name="timestamp"
                      control={control}
                      render={({ field }) => <Input id="timestamp" type="datetime-local" {...field} />}
                    />
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Controller
                      name="obtainedVitals"
                      control={control}
                      render={({ field }) => <Checkbox id="obtainedVitals" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                    <Label htmlFor="obtainedVitals">I obtained these vitals</Label>
                  </div>
                </div>
                
                <Separator />
                <h4 className="text-md font-medium text-primary pt-2">Cardiovascular</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="bloodPressure">Blood Pressure (e.g., 120/80)</Label>
                    <Controller name="bloodPressure" control={control} render={({ field }) => <Input id="bloodPressure" {...field} value={field.value ?? ''} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bloodPressureMethod">BP Method</Label>
                    <Controller name="bloodPressureMethod" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                        <SelectTrigger id="bloodPressureMethod"><SelectValue /></SelectTrigger>
                        <SelectContent>{bloodPressureMethodOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                      </Select>)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Controller name="heartRate" control={control} render={({ field }) => <Input id="heartRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pulseStrengthQuality">Pulse Strength/Quality</Label>
                    <Controller name="pulseStrengthQuality" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                        <SelectTrigger id="pulseStrengthQuality"><SelectValue /></SelectTrigger>
                        <SelectContent>{pulseStrengthOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                      </Select>)} 
                    />
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Controller name="orthostaticBpPerformed" control={control} render={({ field }) => <Checkbox id="orthostaticBpPerformed" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="orthostaticBpPerformed">Orthostatic BP Performed</Label>
                  </div>
                  {orthostaticPerformed && (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="orthostaticLyingBpHr">Lying BP / HR</Label>
                        <Controller name="orthostaticLyingBpHr" control={control} render={({ field }) => <Input id="orthostaticLyingBpHr" placeholder="e.g., 120/80 / 70" {...field} value={field.value ?? ''} />} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="orthostaticStandingBpHr">Standing BP / HR</Label>
                        <Controller name="orthostaticStandingBpHr" control={control} render={({ field }) => <Input id="orthostaticStandingBpHr" placeholder="e.g., 110/70 / 85" {...field} value={field.value ?? ''} />} />
                      </div>
                    </>
                  )}
                </div>

                <Separator />
                <h4 className="text-md font-medium text-primary pt-2">Respiratory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="respirationsRate">Respirations Rate (breaths/min)</Label>
                    <Controller name="respirationsRate" control={control} render={({ field }) => <Input id="respirationsRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="respirationsQuality">Respirations Quality</Label>
                    <Controller name="respirationsQuality" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                        <SelectTrigger id="respirationsQuality"><SelectValue /></SelectTrigger>
                        <SelectContent>{respirationsQualityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                      </Select>)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="spo2">SpO2 (%)</Label>
                    <Controller name="spo2" control={control} render={({ field }) => <Input id="spo2" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endTidalCO2">End Tidal CO2 (mmHg)</Label>
                    <Controller name="endTidalCO2" control={control} render={({ field }) => <Input id="endTidalCO2" {...field} value={field.value ?? ''} />} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Lung Sounds Snapshot</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                      {lungSoundsOptions.filter(opt => opt !== "N/A").map((sound) => ( // Exclude N/A from checkboxes
                        <div key={`lungSnap-${sound}`} className="flex items-center space-x-2">
                          <Controller name="lungSoundsSnapshot" control={control} defaultValue={[]} render={({ field: checkboxField }) => (
                            <Checkbox id={`lungSnap-${sound.replace(/[^a-zA-Z0-9]/g, '')}`}
                              checked={checkboxField.value?.includes(sound)}
                              onCheckedChange={(checked) => {
                                const currentValues = checkboxField.value || [];
                                if (checked) { checkboxField.onChange([...currentValues, sound]); } 
                                else { checkboxField.onChange(currentValues.filter((value) => value !== sound)); }
                              }} /> )} />
                          <Label htmlFor={`lungSnap-${sound.replace(/[^a-zA-Z0-9]/g, '')}`} className="font-normal">{sound}</Label>
                        </div> ))}
                    </div>
                  </div>
                </div>
                
                <Separator />
                <h4 className="text-md font-medium text-primary pt-2">Neurological</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="painScale">Pain Scale (0-10)</Label>
                      <Controller name="painScale" control={control} render={({ field }) => <Input id="painScale" type="number" min="0" max="10" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div> {/* Placeholder for layout */} </div>

                    <div className="space-y-1">
                      <Label htmlFor="pupilLeftSize">Pupil Left Size</Label>
                       <Controller name="pupilLeftSize" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="pupilLeftSize"><SelectValue /></SelectTrigger>
                          <SelectContent>{pupilSizeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pupilLeftReaction">Pupil Left Reaction</Label>
                      <Controller name="pupilLeftReaction" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="pupilLeftReaction"><SelectValue /></SelectTrigger>
                          <SelectContent>{pupilReactionOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="pupilRightSize">Pupil Right Size</Label>
                       <Controller name="pupilRightSize" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="pupilRightSize"><SelectValue /></SelectTrigger>
                          <SelectContent>{pupilSizeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pupilRightReaction">Pupil Right Reaction</Label>
                      <Controller name="pupilRightReaction" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="pupilRightReaction"><SelectValue /></SelectTrigger>
                          <SelectContent>{pupilReactionOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                    </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label>GCS Snapshot</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                      <Label htmlFor="gcsSnapshotEyes">Eyes</Label>
                      <Controller name="gcsSnapshotEyes" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? ""} >
                          <SelectTrigger id="gcsSnapshotEyes"><SelectValue placeholder="E" /></SelectTrigger>
                          <SelectContent>{gcsEyesOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>)} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="gcsSnapshotVerbal">Verbal</Label>
                      <Controller name="gcsSnapshotVerbal" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <SelectTrigger id="gcsSnapshotVerbal"><SelectValue placeholder="V" /></SelectTrigger>
                          <SelectContent>{gcsVerbalOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="gcsSnapshotMotor">Motor</Label>
                      <Controller name="gcsSnapshotMotor" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <SelectTrigger id="gcsSnapshotMotor"><SelectValue placeholder="M" /></SelectTrigger>
                          <SelectContent>{gcsMotorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="gcsSnapshotTotal">Total</Label>
                      <Controller name="gcsSnapshotTotal" control={control} render={({ field }) => <Input id="gcsSnapshotTotal" value={field.value === undefined ? 'N/A' : String(field.value)} readOnly className="bg-muted" />} />
                    </div>
                  </div>
                </div>

                <Separator />
                <h4 className="text-md font-medium text-primary pt-2">Other</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Controller name="temperature" control={control} render={({ field }) => <Input id="temperature" type="number" step="0.1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="temperatureRoute">Temperature Route</Label>
                     <Controller name="temperatureRoute" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="temperatureRoute"><SelectValue /></SelectTrigger>
                          <SelectContent>{temperatureRouteOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bloodGlucoseLevel">Blood Glucose Level</Label>
                    <Controller name="bloodGlucoseLevel" control={control} render={({ field }) => <Input id="bloodGlucoseLevel" placeholder="e.g., 5.5" {...field} value={field.value ?? ''} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bloodGlucoseMethod">BGL Method</Label>
                     <Controller name="bloodGlucoseMethod" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'N/A'}>
                          <SelectTrigger id="bloodGlucoseMethod"><SelectValue /></SelectTrigger>
                          <SelectContent>{bloodGlucoseMethodOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>)} />
                  </div>
                   <div className="flex items-center space-x-2 md:col-span-2">
                    <Controller name="isNeonatalForApgar" control={control} render={({ field }) => <Checkbox id="isNeonatalForApgar" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="isNeonatalForApgar">Is Patient Neonatal (for APGAR)?</Label>
                  </div>
                  {isNeonatal && (
                    <div className="space-y-1">
                      <Label htmlFor="apgarScore">APGAR Score</Label>
                      <Controller name="apgarScore" control={control} render={({ field }) => <Input id="apgarScore" placeholder="e.g., 9" {...field} value={field.value ?? ''} />} />
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Skin Snapshot</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                    {skinConditionOptions.filter(opt => opt !== "N/A").map((condition) => ( // Exclude N/A from checkboxes
                      <div key={`skinSnap-${condition}`} className="flex items-center space-x-2">
                        <Controller name="skinSnapshot" control={control} defaultValue={[]} render={({ field: checkboxField }) => (
                            <Checkbox id={`skinSnap-${condition.replace(/[^a-zA-Z0-9]/g, '')}`}
                              checked={checkboxField.value?.includes(condition)}
                              onCheckedChange={(checked) => {
                                const currentValues = checkboxField.value || [];
                                if (checked) { checkboxField.onChange([...currentValues, condition]); } 
                                else { checkboxField.onChange(currentValues.filter((value) => value !== condition)); }
                              }} /> )} />
                        <Label htmlFor={`skinSnap-${condition.replace(/[^a-zA-Z0-9]/g, '')}`} className="font-normal">{condition}</Label>
                      </div> ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Vital Set</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
