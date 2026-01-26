// src/components/forms/patient-care-form/BreathingSupportDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { BreathingSupportEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  breathingSupportProcedureNameOptions,
  yesNoOptions,
  venturiMaskO2Options,
  cpapMaskSizeOptions,
  drivingGasOptions,
  mechVentModeOptions,
  tidalVolumeUnitOptions,
  peepLevelOptions,
  chestDecompressionNeedleGaugeOptions,
  chestDecompressionCatheterLengthOptions,
  chestDecompressionSiteOptions,
  leftRightOptions,
  chestTubeDrainageSystemOptions,
} from './patient-care-form-constants';

interface BreathingSupportDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<BreathingSupportEntry>;
  onSave: (data: BreathingSupportEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<BreathingSupportEntry> = {
  id: undefined,
  performedProcedure: false,
  procedureName: 'N/A',
  // Oxygen Administration
  nasalCannulaFlowRate: undefined,
  simpleMaskFlowRate: undefined,
  nonRebreatherMaskFlowRate: undefined,
  venturiMaskO2Percent: 'N/A',
  // Advanced Breathing Support
  nebulizerDuration: undefined,
  nebulizerDrivingGas: 'N/A',
  nebulizerFlowRate: undefined,
  cpapMaskSize: 'N/A',
  cpapIpstPressure: undefined,
  cpapEpapPeep: undefined,
  cpapFiO2: undefined,
  cpapImprovedWOB: 'N/A',
  manualNivDevicePeepValveSetting: undefined,
  mechVentMode: 'N/A',
  mechVentFiO2: undefined,
  mechVentPeep: undefined,
  mechVentRespiratoryRate: undefined,
  mechVentTidalVolumeValue: undefined,
  mechVentTidalVolumeUnit: 'N/A',
  mechVentInspiratoryTime: undefined,
  peepManualBvmLevel: 'N/A',
  peepManualBvmOtherValue: undefined,
  rescueBreathingRate: undefined,
  // Emergency Breathing Procedures
  chestDecompressionNeedleGauge: 'N/A',
  chestDecompressionOtherNeedleGauge: '',
  chestDecompressionCatheterLength: 'N/A',
  chestDecompressionOtherCatheterLength: '',
  chestDecompressionSite: 'N/A',
  chestDecompressionOtherSite: '',
  chestDecompressionSide: 'N/A',
  chestDecompressionAttempts: undefined,
  chestDecompressionSuccessful: 'N/A',
  chestTubeDrainageSystem: 'N/A',
  chestTubeSuctionLevel: undefined,
  chestTubeOutputThisEncounter: undefined,
  chestTubeAirLeakPresent: 'N/A',
  peakFlowPreTreatmentValue: undefined,
  peakFlowPostTreatmentValue: undefined,
};

export function BreathingSupportDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: BreathingSupportDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<BreathingSupportEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset } = methods;

  const procedureName = watch('procedureName');
  const venturiMaskSelected = procedureName === 'Venturi Mask';
  const nebulizerSelected = procedureName === 'Nebulizer Treatment';
  const cpapSelected = procedureName === 'CPAP/BiPAP (Non-Invasive Ventilation)';
  const manualNivSelected = procedureName === 'Manual NIV Device';
  const mechVentSelected = procedureName === 'Mechanical Ventilator Use';
  const peepManualBvmSelected = procedureName === 'PEEP Application (Manual with BVM)';
  const peepManualBvmLevel = watch('peepManualBvmLevel');
  const chestDecompressionSelected = procedureName === 'Chest Decompression (Needle Thoracentesis)';
  const chestDecompressionNeedleGauge = watch('chestDecompressionNeedleGauge');
  const chestDecompressionCatheterLength = watch('chestDecompressionCatheterLength');
  const chestDecompressionSite = watch('chestDecompressionSite');
  const chestTubeSelected = procedureName === 'Chest Tube Management';
  const chestTubeDrainageSystem = watch('chestTubeDrainageSystem');

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: BreathingSupportEntry) => {
    const submissionData: BreathingSupportEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      // Ensure numeric fields are numbers or undefined
      nasalCannulaFlowRate: data.nasalCannulaFlowRate ? Number(data.nasalCannulaFlowRate) : undefined,
      simpleMaskFlowRate: data.simpleMaskFlowRate ? Number(data.simpleMaskFlowRate) : undefined,
      nonRebreatherMaskFlowRate: data.nonRebreatherMaskFlowRate ? Number(data.nonRebreatherMaskFlowRate) : undefined,
      nebulizerDuration: data.nebulizerDuration ? Number(data.nebulizerDuration) : undefined,
      nebulizerFlowRate: data.nebulizerFlowRate ? Number(data.nebulizerFlowRate) : undefined,
      cpapIpstPressure: data.cpapIpstPressure ? Number(data.cpapIpstPressure) : undefined,
      cpapEpapPeep: data.cpapEpapPeep ? Number(data.cpapEpapPeep) : undefined,
      cpapFiO2: data.cpapFiO2 ? Number(data.cpapFiO2) : undefined,
      manualNivDevicePeepValveSetting: data.manualNivDevicePeepValveSetting ? Number(data.manualNivDevicePeepValveSetting) : undefined,
      mechVentFiO2: data.mechVentFiO2 ? Number(data.mechVentFiO2) : undefined,
      mechVentPeep: data.mechVentPeep ? Number(data.mechVentPeep) : undefined,
      mechVentRespiratoryRate: data.mechVentRespiratoryRate ? Number(data.mechVentRespiratoryRate) : undefined,
      mechVentTidalVolumeValue: data.mechVentTidalVolumeValue ? Number(data.mechVentTidalVolumeValue) : undefined,
      mechVentInspiratoryTime: data.mechVentInspiratoryTime ? Number(data.mechVentInspiratoryTime) : undefined,
      peepManualBvmOtherValue: data.peepManualBvmOtherValue ? Number(data.peepManualBvmOtherValue) : undefined,
      rescueBreathingRate: data.rescueBreathingRate ? Number(data.rescueBreathingRate) : undefined,
      chestDecompressionAttempts: data.chestDecompressionAttempts ? Number(data.chestDecompressionAttempts) : undefined,
      chestTubeSuctionLevel: data.chestTubeSuctionLevel ? Number(data.chestTubeSuctionLevel) : undefined,
      chestTubeOutputThisEncounter: data.chestTubeOutputThisEncounter ? Number(data.chestTubeOutputThisEncounter) : undefined,
      peakFlowPreTreatmentValue: data.peakFlowPreTreatmentValue ? Number(data.peakFlowPreTreatmentValue) : undefined,
      peakFlowPostTreatmentValue: data.peakFlowPostTreatmentValue ? Number(data.peakFlowPostTreatmentValue) : undefined,
    };
    onSave(submissionData);
    setIsOpen(false);
  };

  const handleNumericInput = (field: any, value: string) => {
    if (value === '') {
      field.onChange(undefined);
    } else {
      const num = parseFloat(value); // Use parseFloat for decimals
      field.onChange(isNaN(num) ? undefined : num);
    }
  };

  const renderRadioGroup = (fieldName: keyof BreathingSupportEntry, options: {label: string, value: string}[]) => (
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

  const renderSelect = (fieldName: keyof BreathingSupportEntry, placeholder: string, options: string[] | {label: string, value: string}[]) => (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value as string ?? (typeof options[0] === 'string' ? options[0] : (options[0] as {value:string}).value)} defaultValue={field.value as string}>
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

  const dialogTitle = initialData?.id ? 'Edit Breathing Support Procedure' : 'Add Breathing Support Procedure';

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
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="bsPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="bsPerformedProcedure">I performed this treatment</Label>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="bsProcedureName">Procedure</Label>
                  {renderSelect('procedureName', 'Select Procedure', breathingSupportProcedureNameOptions)}
                </div>
                
                <Separator className="my-4"/>

                {/* --- Oxygen Administration --- */}
                {procedureName === 'Nasal Cannula' && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary mt-2 pt-2">
                    <Label className="font-medium text-primary">Nasal Cannula Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="nasalCannulaFlowRate">Flow Rate (L/min)</Label>
                      <Controller name="nasalCannulaFlowRate" control={control} render={({ field }) => <Input id="nasalCannulaFlowRate" type="number" min="1" max="6" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                  </div>
                )}
                {procedureName === 'Simple Mask' && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary mt-2 pt-2">
                     <Label className="font-medium text-primary">Simple Mask Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="simpleMaskFlowRate">Flow Rate (L/min)</Label>
                      <Controller name="simpleMaskFlowRate" control={control} render={({ field }) => <Input id="simpleMaskFlowRate" type="number" min="6" max="12" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                  </div>
                )}
                {procedureName === 'Non-Rebreather Mask' && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary mt-2 pt-2">
                    <Label className="font-medium text-primary">Non-Rebreather Mask Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="nonRebreatherMaskFlowRate">Flow Rate (L/min)</Label>
                      <Controller name="nonRebreatherMaskFlowRate" control={control} render={({ field }) => <Input id="nonRebreatherMaskFlowRate" type="number" min="10" max="15" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                  </div>
                )}
                {venturiMaskSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary mt-2 pt-2">
                    <Label className="font-medium text-primary">Venturi Mask Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="venturiMaskO2Percent">% O2</Label>
                      {renderSelect('venturiMaskO2Percent', 'Select % O2', venturiMaskO2Options)}
                    </div>
                  </div>
                )}

                {/* --- Advanced Breathing Support --- */}
                {nebulizerSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                    <Label className="font-medium text-accent">Nebulizer Treatment Details</Label>
                    <p className="text-xs text-muted-foreground">Note: Medication logged separately in Medication section.</p>
                    <div className="space-y-1">
                      <Label htmlFor="nebulizerDuration">Duration (minutes)</Label>
                      <Controller name="nebulizerDuration" control={control} render={({ field }) => <Input id="nebulizerDuration" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div>
                      <Label>Driving Gas</Label>
                      {renderRadioGroup('nebulizerDrivingGas', drivingGasOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="nebulizerFlowRate">Flow Rate (L/min)</Label>
                      <Controller name="nebulizerFlowRate" control={control} render={({ field }) => <Input id="nebulizerFlowRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                  </div>
                )}
                {cpapSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                    <Label className="font-medium text-accent">CPAP/BiPAP Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="cpapMaskSize">Mask Size</Label>
                      {renderSelect('cpapMaskSize', 'Select Mask Size', cpapMaskSizeOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpapIpstPressure">IPAP/Pressure (cmH2O)</Label>
                      <Controller name="cpapIpstPressure" control={control} render={({ field }) => <Input id="cpapIpstPressure" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpapEpapPeep">EPAP/PEEP (cmH2O)</Label>
                      <Controller name="cpapEpapPeep" control={control} render={({ field }) => <Input id="cpapEpapPeep" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpapFiO2">FiO2 (%)</Label>
                      <Controller name="cpapFiO2" control={control} render={({ field }) => <Input id="cpapFiO2" type="number" min="21" max="100" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div>
                      <Label>Improved Work of Breathing/Sats</Label>
                      {renderRadioGroup('cpapImprovedWOB', yesNoOptions)}
                    </div>
                  </div>
                )}
                {manualNivSelected && (
                     <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                        <Label className="font-medium text-accent">Manual NIV Device Details</Label>
                        <div className="space-y-1">
                        <Label htmlFor="manualNivDevicePeepValveSetting">PEEP Valve Setting (cmH2O)</Label>
                        <Controller name="manualNivDevicePeepValveSetting" control={control} render={({ field }) => <Input id="manualNivDevicePeepValveSetting" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                        </div>
                    </div>
                )}
                {mechVentSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                    <Label className="font-medium text-accent">Mechanical Ventilator Use Details</Label>
                    <div className="space-y-1"><Label htmlFor="mechVentMode">Mode</Label>{renderSelect('mechVentMode', 'Select Mode', mechVentModeOptions)}</div>
                    <div className="space-y-1"><Label htmlFor="mechVentFiO2">FiO2 (%)</Label><Controller name="mechVentFiO2" control={control} render={({ field }) => <Input id="mechVentFiO2" type="number" min="21" max="100" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div className="space-y-1"><Label htmlFor="mechVentPeep">PEEP (cmH2O)</Label><Controller name="mechVentPeep" control={control} render={({ field }) => <Input id="mechVentPeep" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div className="space-y-1"><Label htmlFor="mechVentRespiratoryRate">Respiratory Rate (bpm)</Label><Controller name="mechVentRespiratoryRate" control={control} render={({ field }) => <Input id="mechVentRespiratoryRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div className="space-y-1"><Label>Tidal Volume</Label>
                        <div className="flex items-center space-x-2">
                            <Controller name="mechVentTidalVolumeValue" control={control} render={({ field }) => <Input type="number" placeholder="Value" className="w-1/2" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                            {renderRadioGroup('mechVentTidalVolumeUnit', tidalVolumeUnitOptions)}
                        </div>
                    </div>
                    <div className="space-y-1"><Label htmlFor="mechVentInspiratoryTime">Inspiratory Time (s)</Label><Controller name="mechVentInspiratoryTime" control={control} render={({ field }) => <Input id="mechVentInspiratoryTime" type="number" step="0.1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                  </div>
                )}
                {peepManualBvmSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                    <Label className="font-medium text-accent">PEEP Application (Manual with BVM) Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="peepManualBvmLevel">PEEP Level (cmH2O)</Label>
                      {renderSelect('peepManualBvmLevel', 'Select PEEP Level', peepLevelOptions)}
                    </div>
                    {peepManualBvmLevel === 'Other' && (
                      <div className="space-y-1 pl-6">
                        <Label htmlFor="peepManualBvmOtherValue">Other PEEP Value (cmH2O)</Label>
                        <Controller name="peepManualBvmOtherValue" control={control} render={({ field }) => <Input id="peepManualBvmOtherValue" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                      </div>
                    )}
                  </div>
                )}
                {procedureName === 'Rescue Breathing' && (
                    <div className="space-y-3 pl-4 border-l-2 border-accent mt-2 pt-2">
                        <Label className="font-medium text-accent">Rescue Breathing Details</Label>
                        <div className="space-y-1">
                        <Label htmlFor="rescueBreathingRate">Rate (breaths/min)</Label>
                        <Controller name="rescueBreathingRate" control={control} render={({ field }) => <Input id="rescueBreathingRate" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                        </div>
                    </div>
                )}
                 {procedureName === 'Impedance Threshold Device (ITD) Use' && (
                    <div className="pl-4 border-l-2 border-accent mt-2 pt-2">
                         <Label className="font-medium text-accent">Impedance Threshold Device (ITD) Use</Label>
                        <p className="text-sm text-muted-foreground">No additional specific fields required for ITD.</p>
                    </div>
                )}

                {/* --- Emergency Breathing Procedures --- */}
                {chestDecompressionSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-destructive mt-2 pt-2">
                    <Label className="font-medium text-destructive">Chest Decompression Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="chestDecompressionNeedleGauge">Needle Gauge</Label>
                      {renderSelect('chestDecompressionNeedleGauge', 'Select Gauge', chestDecompressionNeedleGaugeOptions)}
                    </div>
                    {chestDecompressionNeedleGauge === 'Other' && <div className="space-y-1 pl-6"><Label htmlFor="chestDecompressionOtherNeedleGauge">Other Needle Gauge</Label><Controller name="chestDecompressionOtherNeedleGauge" control={control} render={({ field }) => <Input id="chestDecompressionOtherNeedleGauge" {...field} value={field.value ?? ''} />} /></div>}
                    
                    <div className="space-y-1">
                      <Label htmlFor="chestDecompressionCatheterLength">Catheter Length</Label>
                      {renderSelect('chestDecompressionCatheterLength', 'Select Length', chestDecompressionCatheterLengthOptions)}
                    </div>
                    {chestDecompressionCatheterLength === 'Other' && <div className="space-y-1 pl-6"><Label htmlFor="chestDecompressionOtherCatheterLength">Other Catheter Length</Label><Controller name="chestDecompressionOtherCatheterLength" control={control} render={({ field }) => <Input id="chestDecompressionOtherCatheterLength" {...field} value={field.value ?? ''} />} /></div>}

                    <div className="space-y-1">
                      <Label htmlFor="chestDecompressionSite">Site</Label>
                      {renderSelect('chestDecompressionSite', 'Select Site', chestDecompressionSiteOptions)}
                    </div>
                    {chestDecompressionSite === 'Other' && <div className="space-y-1 pl-6"><Label htmlFor="chestDecompressionOtherSite">Other Site</Label><Controller name="chestDecompressionOtherSite" control={control} render={({ field }) => <Input id="chestDecompressionOtherSite" {...field} value={field.value ?? ''} />} /></div>}
                    
                    <div><Label>Side</Label>{renderRadioGroup('chestDecompressionSide', leftRightOptions)}</div>
                    <div className="space-y-1"><Label htmlFor="chestDecompressionAttempts">Number of Attempts</Label><Controller name="chestDecompressionAttempts" control={control} render={({ field }) => <Input id="chestDecompressionAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div><Label>Successful (Audible Rush of Air / Improved Vitals)</Label>{renderRadioGroup('chestDecompressionSuccessful', yesNoOptions)}</div>
                  </div>
                )}
                {chestTubeSelected && (
                  <div className="space-y-3 pl-4 border-l-2 border-destructive mt-2 pt-2">
                    <Label className="font-medium text-destructive">Chest Tube Management Details</Label>
                    <div><Label>Drainage System</Label>{renderRadioGroup('chestTubeDrainageSystem', chestTubeDrainageSystemOptions)}</div>
                    {chestTubeDrainageSystem === 'Suction' && <div className="space-y-1 pl-6"><Label htmlFor="chestTubeSuctionLevel">Suction Level (cmH2O)</Label><Controller name="chestTubeSuctionLevel" control={control} render={({ field }) => <Input id="chestTubeSuctionLevel" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                    <div className="space-y-1"><Label htmlFor="chestTubeOutputThisEncounter">Output This Encounter (mL)</Label><Controller name="chestTubeOutputThisEncounter" control={control} render={({ field }) => <Input id="chestTubeOutputThisEncounter" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div><Label>Air Leak Present</Label>{renderRadioGroup('chestTubeAirLeakPresent', yesNoOptions)}</div>
                  </div>
                )}
                {procedureName === 'Use of Peak-Flow Meter' && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary mt-2 pt-2">
                    <Label className="font-medium text-primary">Peak-Flow Meter Details</Label>
                    <div className="space-y-1"><Label htmlFor="peakFlowPreTreatmentValue">Pre-treatment Value (L/min)</Label><Controller name="peakFlowPreTreatmentValue" control={control} render={({ field }) => <Input id="peakFlowPreTreatmentValue" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div className="space-y-1"><Label htmlFor="peakFlowPostTreatmentValue">Post-treatment Value (L/min)</Label><Controller name="peakFlowPostTreatmentValue" control={control} render={({ field }) => <Input id="peakFlowPostTreatmentValue" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                  </div>
                )}

              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Breathing Support</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
