// src/components/forms/patient-care-form/CardiacProcedureDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { CardiacProcedureEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as ShadSelectLabel } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added import
import {
  yesNoOptions,
  rhythmOptions,
  rhythmAttributeOptions,
  stemiLocationOptions,
  cardiacProcedureNameOptions,
  chestCompressionMethodOptions,
  yesNoNotMonitoredOptions,
  defibMethodOptions,
  roscOptions,
  pacingMethodOptions,
} from './patient-care-form-constants';

interface CardiacProcedureDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<CardiacProcedureEntry>;
  onSave: (data: CardiacProcedureEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<CardiacProcedureEntry> = {
  id: undefined,
  // Rhythm Assessment
  interpretedRhythm: false,
  rhythm: 'N/A',
  rhythmAttributes: [],
  is12LeadECG: false,
  ecgInterpretationSummary: '',
  stemi: 'N/A',
  stemiLocation: 'N/A',
  // Cardiac Procedures
  performedProcedure: false,
  procedureName: 'N/A',
  // Procedure specific defaults
  carotidSinusMassageSuccessful: 'N/A',
  chestCompressionMethod: 'N/A',
  chestCompressionDeviceUsed: '',
  chestCompressionFractionGoalMet: 'N/A',
  defibMethod: 'N/A',
  defibNumberOfShocks: undefined,
  defibEnergyLevels: '',
  defibRosc: 'N/A',
  pacingMethod: 'N/A',
  pacingRate: undefined,
  pacingCurrent: undefined,
  pacingCaptureAchieved: 'N/A',
  pacingHemodynamicImprovement: 'N/A',
  cardioversionAttempts: undefined,
  cardioversionEnergyLevels: '',
  cardioversionRhythmConversion: 'N/A',
  valsalvaSuccessful: 'N/A',
  precordialThumpSuccessful: 'N/A',
};

export function CardiacProcedureDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: CardiacProcedureDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<CardiacProcedureEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const is12LeadECG = watch('is12LeadECG');
  const stemi = watch('stemi');
  const procedureName = watch('procedureName');
  const chestCompressionMethod = watch('chestCompressionMethod');
  const defibMethod = watch('defibMethod'); 
  const pacingMethod = watch('pacingMethod'); 

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: CardiacProcedureEntry) => {
    const submissionData: CardiacProcedureEntry = {
      ...data,
      id: initialData?.id || Date.now().toString(),
      // Ensure numeric fields are numbers or undefined
      defibNumberOfShocks: data.defibNumberOfShocks === undefined || isNaN(Number(data.defibNumberOfShocks)) ? undefined : Number(data.defibNumberOfShocks),
      pacingRate: data.pacingRate === undefined || isNaN(Number(data.pacingRate)) ? undefined : Number(data.pacingRate),
      pacingCurrent: data.pacingCurrent === undefined || isNaN(Number(data.pacingCurrent)) ? undefined : Number(data.pacingCurrent),
      cardioversionAttempts: data.cardioversionAttempts === undefined || isNaN(Number(data.cardioversionAttempts)) ? undefined : Number(data.cardioversionAttempts),
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
  
  const renderRadioGroup = (fieldName: keyof CardiacProcedureEntry, options: {label: string, value: string}[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <RadioGroup onValueChange={field.onChange} value={String(field.value ?? 'N/A')} className="flex space-x-2 pt-1">
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

  const renderSelect = (fieldName: keyof CardiacProcedureEntry, placeholder: string, options: (string | {label: string, value: string})[], groupedOptions?: {group: string, options: {label:string, value:string}[]}[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={String(field.value ?? 'N/A')} defaultValue={String(field.value)}>
          <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
          <SelectContent>
            {groupedOptions ? (
              groupedOptions.map(group => (
                <SelectGroup key={group.group}>
                  <ShadSelectLabel>{group.group}</ShadSelectLabel>
                  {group.options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectGroup>
              ))
            ) : (
              options.map(opt => typeof opt === 'string' 
                ? <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                : <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}
    />
  );


  const dialogTitle = initialData?.id ? 'Edit Cardiac Event/Procedure' : 'Add Cardiac Event/Procedure';

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

                {/* --- Rhythm Assessment Section --- */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rhythm Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Controller name="interpretedRhythm" control={control} render={({ field }) => <Checkbox id="interpretedRhythm" checked={field.value} onCheckedChange={field.onChange} />} />
                      <Label htmlFor="interpretedRhythm">I interpreted this rhythm</Label>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rhythm">Rhythm</Label>
                      {renderSelect('rhythm', 'Select Rhythm', [], rhythmOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label>Rhythm Attributes</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {rhythmAttributeOptions.map(opt => (
                          <div key={opt.id} className="flex items-center space-x-2">
                            <Controller
                              name="rhythmAttributes"
                              control={control}
                              defaultValue={[]}
                              render={({ field: checkboxField }) => (
                                <Checkbox
                                  id={`rhythmAttr-${opt.id}`}
                                  checked={checkboxField.value?.includes(opt.label)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = checkboxField.value || [];
                                    if (checked) { checkboxField.onChange([...currentValues, opt.label]); } 
                                    else { checkboxField.onChange(currentValues.filter((value) => value !== opt.label)); }
                                  }}
                                />
                              )}
                            />
                            <Label htmlFor={`rhythmAttr-${opt.id}`} className="font-normal text-sm">{opt.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Controller name="is12LeadECG" control={control} render={({ field }) => <Checkbox id="is12LeadECG" checked={field.value} onCheckedChange={field.onChange} />} />
                      <Label htmlFor="is12LeadECG">12 Lead ECG Performed</Label>
                    </div>
                    {is12LeadECG && (
                      <div className="pl-6 space-y-3 border-l-2 mt-1 pt-2">
                        <div className="space-y-1">
                          <Label htmlFor="ecgInterpretationSummary">Interpretation Summary</Label>
                          <Controller name="ecgInterpretationSummary" control={control} render={({ field }) => <Textarea id="ecgInterpretationSummary" {...field} value={field.value ?? ''} rows={3}/>} />
                        </div>
                        <div>
                          <Label>STEMI</Label>
                          {renderRadioGroup('stemi', yesNoOptions.filter(opt => opt.value !== "N/A"))}
                        </div>
                        {stemi === 'Yes' && (
                          <div className="space-y-1 pl-6">
                            <Label htmlFor="stemiLocation">STEMI Location</Label>
                            {renderSelect('stemiLocation', 'Select STEMI Location', stemiLocationOptions)}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Separator/>

                {/* --- Cardiac Procedures Section --- */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cardiac Procedures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="cardiacPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                      <Label htmlFor="cardiacPerformedProcedure">I performed this procedure</Label>
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="procedureName">Procedure</Label>
                      {renderSelect('procedureName', 'Select Cardiac Procedure', cardiacProcedureNameOptions)}
                    </div>

                    {/* Conditional Fields for Specific Procedures */}
                    {procedureName === 'Carotid Sinus Massage' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-2">
                        <Label>Successful (Rhythm Change)</Label>
                        {renderRadioGroup('carotidSinusMassageSuccessful', yesNoOptions.filter(opt => opt.value !== "N/A"))}
                      </div>
                    )}

                    {procedureName === 'Chest Compressions' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-3">
                        <div><Label>Method</Label>{renderRadioGroup('chestCompressionMethod', chestCompressionMethodOptions.filter(opt => opt.value !== "N/A") as any)}</div>
                        {chestCompressionMethod === 'Automated CPR Device' && (
                          <div className="space-y-1 pl-6">
                            <Label htmlFor="chestCompressionDeviceUsed">Device Used</Label>
                            <Controller name="chestCompressionDeviceUsed" control={control} render={({ field }) => <Input id="chestCompressionDeviceUsed" {...field} value={field.value ?? ''} />} />
                          </div>
                        )}
                        <div><Label>Compression Fraction Goal Met</Label>{renderRadioGroup('chestCompressionFractionGoalMet', yesNoNotMonitoredOptions.filter(opt => opt.value !== "N/A") as any)}</div>
                      </div>
                    )}

                    {procedureName === 'Defibrillation' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-3">
                        <div><Label>Method</Label>{renderRadioGroup('defibMethod', defibMethodOptions.filter(opt => opt.value !== "N/A") as any)}</div>
                        <div className="space-y-1">
                          <Label htmlFor="defibNumberOfShocks">Number of Shocks</Label>
                          <Controller name="defibNumberOfShocks" control={control} render={({ field }) => <Input id="defibNumberOfShocks" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="defibEnergyLevels">Energy Levels (Joules, e.g., "200, 300, 360")</Label>
                          <Controller name="defibEnergyLevels" control={control} render={({ field }) => <Input id="defibEnergyLevels" {...field} value={field.value ?? ''} />} />
                        </div>
                        <div><Label>ROSC</Label>{renderSelect('defibRosc', 'Select ROSC Status', roscOptions.filter(opt => opt.value !== "N/A") as any)}</div>
                      </div>
                    )}

                    {procedureName === 'Pacing' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-3">
                        <div><Label>Method</Label>{renderRadioGroup('pacingMethod', pacingMethodOptions.filter(opt => opt.value !== "N/A") as any)}</div>
                        <div className="space-y-1"><Label htmlFor="pacingRate">Rate (ppm)</Label><Controller name="pacingRate" control={control} render={({ field }) => <Input id="pacingRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                        <div className="space-y-1"><Label htmlFor="pacingCurrent">Current (mA)</Label><Controller name="pacingCurrent" control={control} render={({ field }) => <Input id="pacingCurrent" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                        <div><Label>Capture Achieved</Label>{renderRadioGroup('pacingCaptureAchieved', yesNoOptions.filter(opt => opt.value !== "N/A"))}</div>
                        <div><Label>Hemodynamic Improvement</Label>{renderRadioGroup('pacingHemodynamicImprovement', yesNoOptions.filter(opt => opt.value !== "N/A"))}</div>
                      </div>
                    )}

                    {procedureName === 'Synchronized Cardioversion' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="cardioversionAttempts">Number of Attempts</Label>
                          <Controller name="cardioversionAttempts" control={control} render={({ field }) => <Input id="cardioversionAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="cardioversionEnergyLevels">Energy Levels (Joules, e.g., "50, 100, 150")</Label>
                          <Controller name="cardioversionEnergyLevels" control={control} render={({ field }) => <Input id="cardioversionEnergyLevels" {...field} value={field.value ?? ''} />} />
                        </div>
                        <div><Label>Rhythm Conversion</Label>{renderRadioGroup('cardioversionRhythmConversion', yesNoOptions.filter(opt => opt.value !== "N/A"))}</div>
                      </div>
                    )}

                    {procedureName === "Valsalva's Maneuver" && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-2">
                        <Label>Successful (Rhythm Change)</Label>
                        {renderRadioGroup('valsalvaSuccessful', yesNoOptions.filter(opt => opt.value !== "N/A"))}
                      </div>
                    )}

                    {procedureName === 'Precordial Thump' && (
                      <div className="pl-4 border-l-2 mt-2 pt-2 space-y-2">
                        <Label>Successful (Rhythm Change)</Label>
                        {renderRadioGroup('precordialThumpSuccessful', yesNoOptions.filter(opt => opt.value !== "N/A"))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Cardiac Event</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
