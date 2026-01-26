// src/components/forms/patient-care-form/OtherInterventionDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { OtherInterventionEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  yesNoOptions,
  yesNoNaOptions,
  otherInterventionCategoryOptions,
  tubesAndCathetersProcedureOptions,
  ngTubeSizeOptions,
  ngPlacementConfirmationOptions,
  urinaryCatheterSizeOptions,
  urinaryCatheterTypeOptions,
  safetyAndProtectionProcedureOptions,
  restraintTypeOptions,
  cardiacAndStrokeManagementProcedureOptions,
  thrombolyticScreenResultOptions,
  woundManagementProcedureOptions,
  morganLensEyeOptions,
  advancedProceduresOptions,
  dopplerProbeTypeOptions,
  ttmUnitOptions,
  abgSiteOptions,
} from './patient-care-form-constants';

interface OtherInterventionDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<OtherInterventionEntry>;
  onSave: (data: OtherInterventionEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<OtherInterventionEntry> = {
  id: undefined,
  performedProcedure: false,
  procedureCategory: "Tubes and Catheters", // Default to the first tab
  procedureName: "N/A",
  // Tubes and Catheters
  ngTubeSize: "N/A",
  ngOtherSize: '',
  ngPlacementConfirmedBy: "N/A",
  ngSuccessfulInsertion: "N/A",
  urinaryCatheterSize: "N/A",
  urinaryCatheterOtherSize: '',
  urinaryCatheterType: "N/A",
  urinaryCatheterBalloonVolume: undefined,
  urinaryCatheterUrineReturn: "N/A",
  // Safety and Protection
  decontaminationMethod: '',
  decontaminationAgent: '',
  restraintType: "N/A",
  restraintOtherType: '',
  restraintReason: '',
  restraintNeurovascularChecks: "N/A",
  // Cardiac and Stroke Management
  thrombolyticScreenResult: "N/A",
  // Wound Management
  sutureNumber: undefined,
  sutureMaterialSizeType: '',
  sutureLocation: '',
  morganLensEye: "N/A",
  morganLensIrrigatingFluid: '',
  morganLensDuration: undefined,
  eyeIrrigationOtherMethodFluid: '',
  eyeIrrigationOtherMethodVolume: undefined,
  eyeIrrigationOtherMethodDuration: undefined,
  // Advanced Procedures
  dopplerUltrasoundProbeType: "N/A",
  dopplerUltrasoundAreaScanned: '',
  dopplerUltrasoundFindings: '',
  pericardiocentesisNeedleGaugeLength: '',
  pericardiocentesisFluidAmount: undefined,
  pericardiocentesisHemodynamicImprovement: "N/A",
  fieldAmputationMethod: '',
  fieldAmputationTimeCompleted: '', // HH:MM
  icePackLocation: '',
  ttmMethod: '',
  ttmTargetTemperature: undefined,
  ttmUnit: "N/A",
  abgSite: "N/A",
  abgAttempts: undefined,
  abgSuccessful: "N/A",
  invasiveMonitoringDeviceType: '',
};

export function OtherInterventionDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: OtherInterventionDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<OtherInterventionEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const procedureCategory = watch('procedureCategory');
  const procedureName = watch('procedureName');

  // Specific watchers for conditional fields within procedures
  const ngTubeSize = watch('ngTubeSize');
  const urinaryCatheterSize = watch('urinaryCatheterSize');
  const urinaryCatheterType = watch('urinaryCatheterType');
  const restraintType = watch('restraintType');
  const morganLensSelected = procedureCategory === 'Wound Management' && procedureName === 'Morgan Lens Use';
  const ttmSelected = procedureCategory === 'Advanced Procedures' && procedureName === 'Targeted Temperature Management';

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: OtherInterventionEntry) => {
    const submissionData: OtherInterventionEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      // Ensure numeric fields are numbers or undefined
      urinaryCatheterBalloonVolume: data.urinaryCatheterBalloonVolume ? Number(data.urinaryCatheterBalloonVolume) : undefined,
      sutureNumber: data.sutureNumber ? Number(data.sutureNumber) : undefined,
      morganLensDuration: data.morganLensDuration ? Number(data.morganLensDuration) : undefined,
      eyeIrrigationOtherMethodVolume: data.eyeIrrigationOtherMethodVolume ? Number(data.eyeIrrigationOtherMethodVolume) : undefined,
      eyeIrrigationOtherMethodDuration: data.eyeIrrigationOtherMethodDuration ? Number(data.eyeIrrigationOtherMethodDuration) : undefined,
      pericardiocentesisFluidAmount: data.pericardiocentesisFluidAmount ? Number(data.pericardiocentesisFluidAmount) : undefined,
      ttmTargetTemperature: data.ttmTargetTemperature ? Number(data.ttmTargetTemperature) : undefined,
      abgAttempts: data.abgAttempts ? Number(data.abgAttempts) : undefined,
    };
    onSave(submissionData);
    setIsOpen(false);
  };

  const handleNumericInput = (field: any, value: string) => {
    if (value === '') {
      field.onChange(undefined);
    } else {
      const num = parseInt(value, 10);
      field.onChange(isNaN(num) ? undefined : num);
    }
  };
  
  const renderRadioGroup = (fieldName: keyof OtherInterventionEntry, options: {label: string, value: string}[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <RadioGroup onValueChange={field.onChange} value={field.value as string ?? 'N/A'} className="flex space-x-2 pt-1">
          {options.map(opt => (
            <div key={opt.value} className="flex items-center space-x-1">
              <RadioGroupItem value={opt.value} id={`${String(fieldName)}-${opt.value}`} />
              <Label htmlFor={`${String(fieldName)}-${opt.value}`} className="font-normal text-sm">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  );

  const renderSelect = (fieldName: keyof OtherInterventionEntry, placeholder: string, options: string[] | {label: string, value: string}[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value as string ?? (options[0] ? (typeof options[0] === 'string' ? options[0] : (options[0] as {value:string}).value) : 'N/A')} defaultValue={field.value as string}>
          <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
          <SelectContent>
            {options.map(opt => typeof opt === 'string' 
              ? <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              : <SelectItem key={(opt as {value:string}).value} value={(opt as {value:string}).value}>{(opt as {label:string}).label}</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    />
  );

  const getProcedureOptionsForCategory = (category: string | undefined) => {
    if (category === "Tubes and Catheters") return tubesAndCathetersProcedureOptions;
    if (category === "Safety and Protection") return safetyAndProtectionProcedureOptions;
    if (category === "Cardiac and Stroke Management") return cardiacAndStrokeManagementProcedureOptions;
    if (category === "Wound Management") return woundManagementProcedureOptions;
    if (category === "Advanced Procedures") return advancedProceduresOptions;
    return ["N/A"];
  };

  const dialogTitle = initialData?.id ? 'Edit Other Intervention' : 'Add Other Intervention';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && <DialogTrigger asChild onClick={() => setIsOpen(true)}>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitDialog)}>
            <ScrollArea className="max-h-[70vh] p-1 pr-4">
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-2">
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="otherIntPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="otherIntPerformedProcedure">I performed this treatment</Label>
                </div>
                
                <Tabs 
                  value={procedureCategory} 
                  onValueChange={(value) => {
                    setValue('procedureCategory', value);
                    setValue('procedureName', 'N/A'); // Reset specific procedure when category changes
                  }} 
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {otherInterventionCategoryOptions.filter(opt => opt.value !== 'N/A').map(cat => (
                       <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">{cat.label}</TabsTrigger>
                    ))}
                  </TabsList>

                  {otherInterventionCategoryOptions.filter(opt => opt.value !== 'N/A').map(cat => (
                    <TabsContent key={cat.value} value={cat.value} className="mt-4 space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor={`procedureName-${cat.value}`}>Procedure</Label>
                        {renderSelect('procedureName', 'Select Specific Procedure', getProcedureOptionsForCategory(procedureCategory))}
                      </div>
                      <Separator className="my-3"/>

                      {/* Conditional Fields based on procedureCategory AND procedureName */}
                      
                      {/* --- Tubes and Catheters --- */}
                      {procedureCategory === "Tubes and Catheters" && (
                        <>
                          {procedureName === "Naso/Orogastric Tube Insertion" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="ngTubeSize">Tube Size (Fr)</Label>{renderSelect('ngTubeSize', 'Select Size', ngTubeSizeOptions)}</div>
                              {ngTubeSize === 'Other' && <div className="space-y-1"><Label htmlFor="ngOtherSize">Other Size</Label><Controller name="ngOtherSize" control={control} render={({ field }) => <Input id="ngOtherSize" {...field} value={field.value ?? ''} />} /></div>}
                              <div className="space-y-1"><Label htmlFor="ngPlacementConfirmedBy">Placement Confirmed By</Label>{renderSelect('ngPlacementConfirmedBy', 'Select Confirmation', ngPlacementConfirmationOptions)}</div>
                              <div><Label>Successful Insertion</Label>{renderRadioGroup('ngSuccessfulInsertion', yesNoNaOptions)}</div>
                            </div>
                          )}
                          {procedureName === "Urinary Catheterization" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="urinaryCatheterSize">Catheter Size (Fr)</Label>{renderSelect('urinaryCatheterSize', 'Select Size', urinaryCatheterSizeOptions)}</div>
                              {urinaryCatheterSize === 'Other' && <div className="space-y-1"><Label htmlFor="urinaryCatheterOtherSize">Other Size</Label><Controller name="urinaryCatheterOtherSize" control={control} render={({ field }) => <Input id="urinaryCatheterOtherSize" {...field} value={field.value ?? ''} />} /></div>}
                              <div className="space-y-1"><Label htmlFor="urinaryCatheterType">Type</Label>{renderSelect('urinaryCatheterType', 'Select Type', urinaryCatheterTypeOptions)}</div>
                              {urinaryCatheterType === 'Foley' && <div className="space-y-1"><Label htmlFor="urinaryCatheterBalloonVolume">Balloon Inflated Volume (mL)</Label><Controller name="urinaryCatheterBalloonVolume" control={control} render={({ field }) => <Input id="urinaryCatheterBalloonVolume" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                              <div><Label>Urine Return</Label>{renderRadioGroup('urinaryCatheterUrineReturn', yesNoNaOptions)}</div>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Safety and Protection --- */}
                      {procedureCategory === "Safety and Protection" && (
                        <>
                          {procedureName === "Decontamination" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="decontaminationMethod">Method</Label><Controller name="decontaminationMethod" control={control} render={({ field }) => <Input id="decontaminationMethod" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="decontaminationAgent">Agent (if applicable)</Label><Controller name="decontaminationAgent" control={control} render={({ field }) => <Input id="decontaminationAgent" {...field} value={field.value ?? ''} />} /></div>
                            </div>
                          )}
                          {procedureName === "Physical Restraints Applied" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="restraintType">Type</Label>{renderSelect('restraintType', 'Select Type', restraintTypeOptions)}</div>
                              {restraintType === 'Other' && <div className="space-y-1"><Label htmlFor="restraintOtherType">Other Type</Label><Controller name="restraintOtherType" control={control} render={({ field }) => <Input id="restraintOtherType" {...field} value={field.value ?? ''} />} /></div>}
                              <div className="space-y-1"><Label htmlFor="restraintReason">Reason</Label><Controller name="restraintReason" control={control} render={({ field }) => <Textarea id="restraintReason" {...field} value={field.value ?? ''} />} /></div>
                              <div><Label>Neurovascular Checks Performed</Label>{renderRadioGroup('restraintNeurovascularChecks', yesNoNaOptions)}</div>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Cardiac and Stroke Management --- */}
                      {procedureCategory === "Cardiac and Stroke Management" && (
                        <>
                          {procedureName === "Thrombolytic Screen Performed" && (
                            <div className="space-y-1 pl-4 border-l-2">
                              <Label htmlFor="thrombolyticScreenResult">Result</Label>{renderSelect('thrombolyticScreenResult', 'Select Result', thrombolyticScreenResultOptions)}
                            </div>
                          )}
                          {procedureName === "Thrombolysis Administered" && (
                            <div className="pl-4 border-l-2">
                              <p className="text-sm text-muted-foreground">Note: Medication details should be recorded in Medication section.</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Wound Management --- */}
                      {procedureCategory === "Wound Management" && (
                        <>
                          {procedureName === "Suturing" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="sutureNumber">Number of Sutures</Label><Controller name="sutureNumber" control={control} render={({ field }) => <Input id="sutureNumber" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div className="space-y-1"><Label htmlFor="sutureMaterialSizeType">Suture Material Size/Type</Label><Controller name="sutureMaterialSizeType" control={control} render={({ field }) => <Input id="sutureMaterialSizeType" placeholder="e.g., 4-0 Nylon" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="sutureLocation">Location</Label><Controller name="sutureLocation" control={control} render={({ field }) => <Input id="sutureLocation" {...field} value={field.value ?? ''} />} /></div>
                            </div>
                          )}
                          {procedureName === "Morgan Lens Use" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="morganLensEye">Eye</Label>{renderSelect('morganLensEye', 'Select Eye', morganLensEyeOptions)}</div>
                              <div className="space-y-1"><Label htmlFor="morganLensIrrigatingFluid">Irrigating Fluid</Label><Controller name="morganLensIrrigatingFluid" control={control} render={({ field }) => <Input id="morganLensIrrigatingFluid" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="morganLensDuration">Duration (minutes)</Label><Controller name="morganLensDuration" control={control} render={({ field }) => <Input id="morganLensDuration" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                            </div>
                          )}
                          {procedureName === "Eye Irrigation (Other Method)" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="eyeIrrigationOtherMethodFluid">Irrigating Fluid</Label><Controller name="eyeIrrigationOtherMethodFluid" control={control} render={({ field }) => <Input id="eyeIrrigationOtherMethodFluid" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="eyeIrrigationOtherMethodVolume">Volume (mL)</Label><Controller name="eyeIrrigationOtherMethodVolume" control={control} render={({ field }) => <Input id="eyeIrrigationOtherMethodVolume" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div className="space-y-1"><Label htmlFor="eyeIrrigationOtherMethodDuration">Duration (minutes)</Label><Controller name="eyeIrrigationOtherMethodDuration" control={control} render={({ field }) => <Input id="eyeIrrigationOtherMethodDuration" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Advanced Procedures --- */}
                      {procedureCategory === "Advanced Procedures" && (
                        <>
                          {procedureName === "Use of Doppler/Ultrasound" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="dopplerUltrasoundProbeType">Probe Type</Label>{renderSelect('dopplerUltrasoundProbeType', 'Select Probe Type', dopplerProbeTypeOptions)}</div>
                              <div className="space-y-1"><Label htmlFor="dopplerUltrasoundAreaScanned">Area Scanned</Label><Controller name="dopplerUltrasoundAreaScanned" control={control} render={({ field }) => <Input id="dopplerUltrasoundAreaScanned" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="dopplerUltrasoundFindings">Findings</Label><Controller name="dopplerUltrasoundFindings" control={control} render={({ field }) => <Textarea id="dopplerUltrasoundFindings" {...field} value={field.value ?? ''} />} /></div>
                            </div>
                          )}
                          {procedureName === "Pericardiocentesis" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="pericardiocentesisNeedleGaugeLength">Needle Gauge/Length</Label><Controller name="pericardiocentesisNeedleGaugeLength" control={control} render={({ field }) => <Input id="pericardiocentesisNeedleGaugeLength" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="pericardiocentesisFluidAmount">Amount of Fluid Aspirated (mL)</Label><Controller name="pericardiocentesisFluidAmount" control={control} render={({ field }) => <Input id="pericardiocentesisFluidAmount" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div><Label>Hemodynamic Improvement</Label>{renderRadioGroup('pericardiocentesisHemodynamicImprovement', yesNoNaOptions)}</div>
                            </div>
                          )}
                          {procedureName === "Field Amputation" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="fieldAmputationMethod">Method</Label><Controller name="fieldAmputationMethod" control={control} render={({ field }) => <Input id="fieldAmputationMethod" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="fieldAmputationTimeCompleted">Time Completed (HH:MM)</Label><Controller name="fieldAmputationTimeCompleted" control={control} render={({ field }) => <Input id="fieldAmputationTimeCompleted" type="time" {...field} value={field.value ?? ''} />} /></div>
                            </div>
                          )}
                          {procedureName === "Ice Pack Application" && (
                            <div className="space-y-1 pl-4 border-l-2">
                              <Label htmlFor="icePackLocation">Location</Label><Controller name="icePackLocation" control={control} render={({ field }) => <Input id="icePackLocation" {...field} value={field.value ?? ''} />} />
                            </div>
                          )}
                          {procedureName === "Targeted Temperature Management" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="ttmMethod">Method</Label><Controller name="ttmMethod" control={control} render={({ field }) => <Input id="ttmMethod" placeholder="e.g., Cold Saline Infusion" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="ttmTargetTemperature">Target Temperature</Label><Controller name="ttmTargetTemperature" control={control} render={({ field }) => <Input id="ttmTargetTemperature" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div className="space-y-1"><Label>Unit</Label>{renderRadioGroup('ttmUnit', ttmUnitOptions)}</div>
                            </div>
                          )}
                          {procedureName === "Arterial Blood Gas Sampling" && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="abgSite">Site</Label>{renderSelect('abgSite', 'Select Site', abgSiteOptions)}</div>
                              <div className="space-y-1"><Label htmlFor="abgAttempts">Number of Attempts</Label><Controller name="abgAttempts" control={control} render={({ field }) => <Input id="abgAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div><Label>Successful</Label>{renderRadioGroup('abgSuccessful', yesNoNaOptions)}</div>
                            </div>
                          )}
                          {procedureName === "Invasive Hemodynamic Monitoring" && (
                            <div className="space-y-1 pl-4 border-l-2">
                              <Label htmlFor="invasiveMonitoringDeviceType">Device Type</Label><Controller name="invasiveMonitoringDeviceType" control={control} render={({ field }) => <Input id="invasiveMonitoringDeviceType" placeholder="e.g., Arterial Line" {...field} value={field.value ?? ''} />} />
                            </div>
                          )}
                        </>
                      )}

                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Intervention</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
