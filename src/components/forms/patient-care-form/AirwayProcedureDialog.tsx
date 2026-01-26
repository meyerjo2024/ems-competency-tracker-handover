// src/components/forms/patient-care-form/AirwayProcedureDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { AirwayProcedureEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  airwayProcedureNameOptions,
  yesNoOptions,
  opaSizeOptions,
  npaSizeOptions,
  sgaCombitubeSizeOptions,
  sgaIgelSizeOptions,
  sgaKingLTSizeOptions,
  sgaLmaSizeOptions,
  intubationTubeSizeOptions,
  cricDeviceTubeSizeOptions,
  ttjvCatheterGaugeOptions,
  intubationConfirmationCo2ResultOptions,
  intubationConfirmationEsophagealBulbResultOptions,
  intubationConfirmationMethodsCheckboxOptions,
} from './patient-care-form-constants';

interface AirwayProcedureDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<AirwayProcedureEntry>;
  onSave: (data: AirwayProcedureEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<AirwayProcedureEntry> = {
  id: undefined,
  performedProcedure: false,
  procedureName: 'N/A',
  // Basic
  manualAirwayManoeuvreSuccessful: 'N/A',
  fingerSweepSuccessful: 'N/A',
  obstructionClearedSuccessful: 'N/A',
  opaSize: 'N/A',
  opaSuccessful: 'N/A',
  npaSize: 'N/A',
  npaAttempts: undefined,
  npaSuccessful: 'N/A',
  // Suctioning
  suctionOropharynxNasopharynxClearAirway: 'N/A',
  suctionEttTrachClearAirway: 'N/A',
  suctionSgaClearAirway: 'N/A',
  // Ventilation
  bvmRate: undefined,
  bvmEstimatedTidalVolume: undefined,
  bvmAdequateChestRise: 'N/A',
  // SGA
  sgaType: undefined, // Will be inferred from procedureName
  sgaSize: 'N/A',
  sgaAttempts: undefined,
  sgaSuccessful: 'N/A',
  sgaConfirmationMethod: '',
  // Intubation
  intubationType: undefined, // Will be inferred
  intubationTubeSize: 'N/A',
  intubationDepthAtLipsTeeth: undefined,
  intubationDepthAtNares: undefined,
  intubationDigitalDepth: undefined,
  intubationAttempts: undefined,
  intubationSuccessful: 'N/A',
  intubationCuffInflated: 'N/A',
  intubationVALUsed: false,
  intubationVALBladeTypeSize: '',
  intubationBougieUsed: false,
  // Advanced
  rsiSuccessfulIntubationPostRSI: 'N/A',
  cricDeviceTubeSize: 'N/A',
  cricCustomSizeDescription: '',
  cricAttempts: undefined,
  cricSuccessful: 'N/A',
  cricConfirmationMethod: '',
  ttjvCatheterGauge: 'N/A',
  ttjvOtherGauge: '',
  ttjvSuccessful: 'N/A',
  // Confirmation
  intubationConfirmationMethods: [],
  intubationCo2DetectorResult: 'N/A',
  intubationEtco2Value: undefined,
  intubationEsophagealBulbResult: 'N/A',
  // Extubation
  extubationReason: '',
  extubationComplications: 'N/A',
  extubationComplicationNotes: '',
  // Trach Change
  trachOldTubeSizeAndType: '',
  trachNewTubeSizeAndType: '',
  trachChangeSuccessful: 'N/A',
};

export function AirwayProcedureDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: AirwayProcedureDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<AirwayProcedureEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const procedureName = watch('procedureName');
  const valUsed = watch('intubationVALUsed');
  const cricDeviceSize = watch('cricDeviceTubeSize');
  const ttjvGauge = watch('ttjvCatheterGauge');
  const confirmCo2 = watch('intubationConfirmationMethods')?.includes('co2Detector');
  const confirmBulb = watch('intubationConfirmationMethods')?.includes('esophagealBulb');
  const extubationComplications = watch('extubationComplications');

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: AirwayProcedureEntry) => {
    const submissionData = {
      ...data,
      id: initialData?.id || Date.now().toString(),
      // Ensure numeric fields are numbers or undefined
      npaAttempts: data.npaAttempts === undefined || isNaN(Number(data.npaAttempts)) ? undefined : Number(data.npaAttempts),
      bvmRate: data.bvmRate === undefined || isNaN(Number(data.bvmRate)) ? undefined : Number(data.bvmRate),
      bvmEstimatedTidalVolume: data.bvmEstimatedTidalVolume === undefined || isNaN(Number(data.bvmEstimatedTidalVolume)) ? undefined : Number(data.bvmEstimatedTidalVolume),
      sgaAttempts: data.sgaAttempts === undefined || isNaN(Number(data.sgaAttempts)) ? undefined : Number(data.sgaAttempts),
      intubationDepthAtLipsTeeth: data.intubationDepthAtLipsTeeth === undefined || isNaN(Number(data.intubationDepthAtLipsTeeth)) ? undefined : Number(data.intubationDepthAtLipsTeeth),
      intubationDepthAtNares: data.intubationDepthAtNares === undefined || isNaN(Number(data.intubationDepthAtNares)) ? undefined : Number(data.intubationDepthAtNares),
      intubationDigitalDepth: data.intubationDigitalDepth === undefined || isNaN(Number(data.intubationDigitalDepth)) ? undefined : Number(data.intubationDigitalDepth),
      intubationAttempts: data.intubationAttempts === undefined || isNaN(Number(data.intubationAttempts)) ? undefined : Number(data.intubationAttempts),
      cricAttempts: data.cricAttempts === undefined || isNaN(Number(data.cricAttempts)) ? undefined : Number(data.cricAttempts),
      intubationEtco2Value: data.intubationEtco2Value === undefined || isNaN(Number(data.intubationEtco2Value)) ? undefined : Number(data.intubationEtco2Value),
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

  const renderRadioGroup = (fieldName: keyof AirwayProcedureEntry, options: typeof yesNoOptions) => (
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

  const renderSelect = (fieldName: keyof AirwayProcedureEntry, placeholder: string, options: (string | {label: string, value: string})[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value as string ?? options[0]} defaultValue={field.value as string}>
          <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
          <SelectContent>
            {options.map(opt => typeof opt === 'string' 
              ? <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              : <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    />
  );

  const dialogTitle = initialData?.id ? 'Edit Airway Procedure' : 'Add Airway Procedure';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && <DialogTrigger asChild onClick={() => setIsOpen(true)}>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitDialog)}>
            <ScrollArea className="max-h-[70vh] p-1 pr-4">
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="performedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="performedProcedure">I performed this treatment</Label>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="procedureName">Procedure</Label>
                  {renderSelect('procedureName', 'Select Procedure', airwayProcedureNameOptions)}
                </div>

                {/* --- Basic Airway Management --- */}
                {procedureName === 'Manual Airway Manoeuvre' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Successful</Label>
                    {renderRadioGroup('manualAirwayManoeuvreSuccessful', yesNoOptions)}
                  </div>
                )}
                {procedureName === 'Finger Sweep' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Successful</Label>
                    {renderRadioGroup('fingerSweepSuccessful', yesNoOptions)}
                  </div>
                )}
                {procedureName === 'Obstruction Cleared (Heimlich or other)' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Successful</Label>
                    {renderRadioGroup('obstructionClearedSuccessful', yesNoOptions)}
                  </div>
                )}
                {procedureName === 'Oropharyngeal Airway (OPA)' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="opaSize">Size (mm)</Label>
                      {renderSelect('opaSize', 'Select OPA Size', opaSizeOptions)}
                    </div>
                    <div>
                      <Label>Successful</Label>
                      {renderRadioGroup('opaSuccessful', yesNoOptions)}
                    </div>
                  </div>
                )}
                {procedureName === 'Nasopharyngeal Airway (NPA)' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="npaSize">Size (Fr)</Label>
                      {renderSelect('npaSize', 'Select NPA Size', npaSizeOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="npaAttempts">Number of Attempts</Label>
                      <Controller name="npaAttempts" control={control} render={({ field }) => <Input id="npaAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div>
                      <Label>Successful</Label>
                      {renderRadioGroup('npaSuccessful', yesNoOptions)}
                    </div>
                  </div>
                )}

                {/* --- Suctioning --- */}
                {procedureName === 'Suctioning: Oropharynx/Nasopharynx' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Clear Airway Achieved</Label>
                    {renderRadioGroup('suctionOropharynxNasopharynxClearAirway', yesNoOptions)}
                  </div>
                )}
                {procedureName === 'Suctioning: ETT/Trach' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Clear Airway Achieved</Label>
                    {renderRadioGroup('suctionEttTrachClearAirway', yesNoOptions)}
                  </div>
                )}
                {procedureName === 'Suctioning: SGA' && (
                  <div className="space-y-2 pl-4 border-l-2 mt-2 pt-2">
                    <Label>Clear Airway Achieved</Label>
                    {renderRadioGroup('suctionSgaClearAirway', yesNoOptions)}
                  </div>
                )}
                
                {/* --- Ventilation --- */}
                {procedureName === 'Bag-valve-mask/tube Ventilation' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="bvmRate">Rate (bpm)</Label>
                      <Controller name="bvmRate" control={control} render={({ field }) => <Input id="bvmRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bvmEstimatedTidalVolume">Estimated Tidal Volume (mL)</Label>
                      <Controller name="bvmEstimatedTidalVolume" control={control} render={({ field }) => <Input id="bvmEstimatedTidalVolume" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div>
                      <Label>Adequate Chest Rise</Label>
                      {renderRadioGroup('bvmAdequateChestRise', yesNoOptions)}
                    </div>
                  </div>
                )}

                {/* --- Supraglottic Airways (SGA) --- */}
                {['Combitube', 'I-gel', 'KING LT', 'LMA', 'EOA/EGTA'].includes(procedureName || '') && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <Label className="font-medium text-primary">{procedureName}</Label>
                    {procedureName === 'Combitube' && <div className="space-y-1"><Label htmlFor="sgaSize">Size</Label>{renderSelect('sgaSize', 'Select Size', sgaCombitubeSizeOptions)}</div>}
                    {procedureName === 'I-gel' && <div className="space-y-1"><Label htmlFor="sgaSize">Size</Label>{renderSelect('sgaSize', 'Select Size', sgaIgelSizeOptions)}</div>}
                    {procedureName === 'KING LT' && <div className="space-y-1"><Label htmlFor="sgaSize">Size</Label>{renderSelect('sgaSize', 'Select Size', sgaKingLTSizeOptions)}</div>}
                    {procedureName === 'LMA' && <div className="space-y-1"><Label htmlFor="sgaSize">Size</Label>{renderSelect('sgaSize', 'Select Size', sgaLmaSizeOptions)}</div>}
                    {/* EOA/EGTA might not have standard dropdown sizes, handled by text input for confirmation method if needed */}
                    
                    <div className="space-y-1">
                      <Label htmlFor="sgaAttempts">Number of Attempts</Label>
                      <Controller name="sgaAttempts" control={control} render={({ field }) => <Input id="sgaAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div>
                      <Label>Successful</Label>
                      {renderRadioGroup('sgaSuccessful', yesNoOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sgaConfirmationMethod">Confirmation Method</Label>
                      <Controller name="sgaConfirmationMethod" control={control} render={({ field }) => <Input id="sgaConfirmationMethod" {...field} value={field.value ?? ''} />} />
                    </div>
                  </div>
                )}

                {/* --- Intubation --- */}
                {['Orotracheal Intubation', 'Nasotracheal Intubation', 'Digital ET Intubation'].includes(procedureName || '') && (
                   <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <Label className="font-medium text-primary">{procedureName}</Label>
                    <div className="space-y-1">
                      <Label htmlFor="intubationTubeSize">Tube Size (mm ETT)</Label>
                      {renderSelect('intubationTubeSize', 'Select Tube Size', intubationTubeSizeOptions)}
                    </div>
                    {procedureName === 'Orotracheal Intubation' && <div className="space-y-1"><Label htmlFor="intubationDepthAtLipsTeeth">Depth at Lips/Teeth (cm)</Label><Controller name="intubationDepthAtLipsTeeth" control={control} render={({ field }) => <Input id="intubationDepthAtLipsTeeth" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                    {procedureName === 'Nasotracheal Intubation' && <div className="space-y-1"><Label htmlFor="intubationDepthAtNares">Depth at Nares (cm)</Label><Controller name="intubationDepthAtNares" control={control} render={({ field }) => <Input id="intubationDepthAtNares" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                    {procedureName === 'Digital ET Intubation' && <div className="space-y-1"><Label htmlFor="intubationDigitalDepth">Depth (cm)</Label><Controller name="intubationDigitalDepth" control={control} render={({ field }) => <Input id="intubationDigitalDepth" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                    
                    <div className="space-y-1">
                      <Label htmlFor="intubationAttempts">Number of Attempts</Label>
                      <Controller name="intubationAttempts" control={control} render={({ field }) => <Input id="intubationAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div><Label>Successful</Label>{renderRadioGroup('intubationSuccessful', yesNoOptions)}</div>
                    <div><Label>Cuff Inflated</Label>{renderRadioGroup('intubationCuffInflated', yesNoOptions)}</div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller name="intubationVALUsed" control={control} render={({ field }) => <Checkbox id="intubationVALUsed" checked={field.value} onCheckedChange={field.onChange} />} />
                      <Label htmlFor="intubationVALUsed">VAL Used</Label>
                    </div>
                    {valUsed && <div className="space-y-1 pl-6"><Label htmlFor="intubationVALBladeTypeSize">Blade Type/Size</Label><Controller name="intubationVALBladeTypeSize" control={control} render={({ field }) => <Input id="intubationVALBladeTypeSize" {...field} value={field.value ?? ''} />} /></div>}
                    
                    <div className="flex items-center space-x-2">
                      <Controller name="intubationBougieUsed" control={control} render={({ field }) => <Checkbox id="intubationBougieUsed" checked={field.value} onCheckedChange={field.onChange} />} />
                      <Label htmlFor="intubationBougieUsed">Bougie Used</Label>
                    </div>
                    
                    {/* Intubation Confirmation Methods - shown if any intubation type is successful */}
                    {watch('intubationSuccessful') === 'Yes' && (
                      <div className="pt-2 mt-2 border-t">
                        <Label className="font-medium">Intubation Confirmation Methods</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                          {intubationConfirmationMethodsCheckboxOptions.map(opt => (
                            <div key={opt.id} className="flex items-center space-x-2">
                              <Controller
                                name="intubationConfirmationMethods"
                                control={control}
                                defaultValue={[]}
                                render={({ field: checkboxField }) => (
                                  <Checkbox
                                    id={`confirm-${opt.id}`}
                                    checked={checkboxField.value?.includes(opt.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = checkboxField.value || [];
                                      if (checked) { checkboxField.onChange([...currentValues, opt.id]); } 
                                      else { checkboxField.onChange(currentValues.filter((value) => value !== opt.id)); }
                                    }}
                                  />
                                )}
                              />
                              <Label htmlFor={`confirm-${opt.id}`} className="font-normal text-sm">{opt.label}</Label>
                            </div>
                          ))}
                        </div>
                        {confirmCo2 && (
                          <div className="pl-6 mt-1 space-y-1">
                            <Label htmlFor="intubationCo2DetectorResult">CO2 Detector Result</Label>
                            {renderSelect('intubationCo2DetectorResult', 'Select Result', intubationConfirmationCo2ResultOptions)}
                             <div className="flex items-center space-x-2">
                                <Controller name="intubationEtco2Value" control={control} render={({ field }) => <Input type="number" placeholder="ETCO2 Value (if waveform)" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} className="w-1/2 text-sm" />} />
                                <Label className="text-sm text-muted-foreground">mmHg (if waveform)</Label>
                             </div>
                          </div>
                        )}
                        {confirmBulb && (
                          <div className="pl-6 mt-1 space-y-1">
                            <Label htmlFor="intubationEsophagealBulbResult">Esophageal Bulb Device Result</Label>
                            {renderSelect('intubationEsophagealBulbResult', 'Select Result', intubationConfirmationEsophagealBulbResultOptions)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* --- Advanced Airway Procedures --- */}
                {procedureName === 'Rapid Sequence Induction (RSI)' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                     <p className="text-sm text-muted-foreground">Note: Medications logged separately in Medication section.</p>
                    <div><Label>Successful Intubation Post-RSI</Label>{renderRadioGroup('rsiSuccessfulIntubationPostRSI', yesNoOptions)}</div>
                  </div>
                )}
                {procedureName === 'Cricothyrotomy' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="cricDeviceTubeSize">Device/Tube Size</Label>
                      {renderSelect('cricDeviceTubeSize', 'Select Device/Size', cricDeviceTubeSizeOptions)}
                    </div>
                    {(cricDeviceSize?.includes('Commercial Kit') || cricDeviceSize?.includes('Needle Cric')) && (
                      <div className="space-y-1 pl-6">
                        <Label htmlFor="cricCustomSizeDescription">Specify Details</Label>
                        <Controller name="cricCustomSizeDescription" control={control} render={({ field }) => <Input id="cricCustomSizeDescription" {...field} value={field.value ?? ''} />} />
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label htmlFor="cricAttempts">Number of Attempts</Label>
                      <Controller name="cricAttempts" control={control} render={({ field }) => <Input id="cricAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div><Label>Successful</Label>{renderRadioGroup('cricSuccessful', yesNoOptions)}</div>
                    <div className="space-y-1">
                      <Label htmlFor="cricConfirmationMethod">Confirmation Method</Label>
                      <Controller name="cricConfirmationMethod" control={control} render={({ field }) => <Input id="cricConfirmationMethod" {...field} value={field.value ?? ''} />} />
                    </div>
                  </div>
                )}
                {procedureName === 'Transtracheal Jet Ventilation' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="ttjvCatheterGauge">Catheter Gauge</Label>
                      {renderSelect('ttjvCatheterGauge', 'Select Gauge', ttjvCatheterGaugeOptions)}
                    </div>
                    {ttjvGauge === 'Other (specify below)' && (
                       <div className="space-y-1 pl-6">
                        <Label htmlFor="ttjvOtherGauge">Specify Other Gauge</Label>
                        <Controller name="ttjvOtherGauge" control={control} render={({ field }) => <Input id="ttjvOtherGauge" {...field} value={field.value ?? ''} />} />
                      </div>
                    )}
                    <div><Label>Successful</Label>{renderRadioGroup('ttjvSuccessful', yesNoOptions)}</div>
                  </div>
                )}

                {/* --- Extubation --- */}
                {procedureName === 'Extubation' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="extubationReason">Reason for Extubation</Label>
                      <Controller name="extubationReason" control={control} render={({ field }) => <Textarea id="extubationReason" {...field} value={field.value ?? ''} rows={2} />} />
                    </div>
                    <div><Label>Complications</Label>{renderRadioGroup('extubationComplications', yesNoOptions)}</div>
                    {extubationComplications === 'Yes' && (
                      <div className="space-y-1 pl-6">
                        <Label htmlFor="extubationComplicationNotes">Complication Notes</Label>
                        <Controller name="extubationComplicationNotes" control={control} render={({ field }) => <Textarea id="extubationComplicationNotes" {...field} value={field.value ?? ''} rows={2} />} />
                      </div>
                    )}
                  </div>
                )}
                
                {/* --- Tracheostomy Tube Change --- */}
                {procedureName === 'Tracheostomy Tube Change' && (
                  <div className="space-y-3 pl-4 border-l-2 mt-2 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="trachOldTubeSizeAndType">Old Tube Size/Type</Label>
                      <Controller name="trachOldTubeSizeAndType" control={control} render={({ field }) => <Input id="trachOldTubeSizeAndType" {...field} value={field.value ?? ''} />} />
                    </div>
                     <div className="space-y-1">
                      <Label htmlFor="trachNewTubeSizeAndType">New Tube Size/Type</Label>
                      <Controller name="trachNewTubeSizeAndType" control={control} render={({ field }) => <Input id="trachNewTubeSizeAndType" {...field} value={field.value ?? ''} />} />
                    </div>
                    <div><Label>Successful</Label>{renderRadioGroup('trachChangeSuccessful', yesNoOptions)}</div>
                  </div>
                )}

              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Airway Procedure</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

    