// src/components/forms/patient-care-form/VascularAccessDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { VascularAccessEntry } from '@/types';
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
  yesNoOptions,
  vascularAccessLocationOptions,
  vascularAccessSideOptions,
  vascularFluidTypeOptions,
  vascularProcedureTypeOptions,
  bloodDrawNeedleGaugeOptions,
  ioNeedleSystemOptions,
  ivCatheterGaugeOptions,
} from './patient-care-form-constants';

interface VascularAccessDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<VascularAccessEntry>;
  onSave: (data: VascularAccessEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<VascularAccessEntry> = {
  id: undefined,
  performedProcedure: false,
  accessLocation: 'N/A',
  accessSide: 'N/A',
  otherAccessLocation: '',
  fluidType: 'N/A',
  otherFluidType: '',
  procedureType: 'N/A',
  // Blood Draw
  bloodDrawNeedleGauge: 'N/A',
  bloodDrawAttempts: undefined,
  bloodDrawSuccessful: 'N/A',
  // IO Insertion
  ioNeedleSystem: 'N/A',
  ioManualOtherSpecification: '',
  ioAttempts: undefined,
  ioSuccessful: 'N/A',
  // IV Insertion / IV with blood draw
  ivCatheterGauge: 'N/A',
  ivAttempts: undefined,
  ivSuccessful: 'N/A',
  // Additional Options
  useOfManualPressureInfuser: false,
  setupMonitorInfusionPump: false,
  setupMonitorSyringeDriver: false,
};

export function VascularAccessDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: VascularAccessDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<VascularAccessEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const accessLocation = watch('accessLocation');
  const fluidType = watch('fluidType');
  const procedureType = watch('procedureType');
  const ioNeedleSystem = watch('ioNeedleSystem');

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: VascularAccessEntry) => {
    const submissionData: VascularAccessEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      bloodDrawAttempts: data.bloodDrawAttempts ? Number(data.bloodDrawAttempts) : undefined,
      ioAttempts: data.ioAttempts ? Number(data.ioAttempts) : undefined,
      ivAttempts: data.ivAttempts ? Number(data.ivAttempts) : undefined,
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

  const renderRadioGroup = (fieldName: keyof VascularAccessEntry, options: {label: string, value: string}[]) => (
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

  const renderSelect = (fieldName: keyof VascularAccessEntry, placeholder: string, options: string[] | {label: string, value: string}[]) => (
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
  
  const dialogTitle = initialData?.id ? 'Edit Vascular Access/IO Procedure' : 'Add Vascular Access/IO Procedure';

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
              <div className="space-y-6 py-4">
                
                <div className="flex items-center space-x-2">
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="vaPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="vaPerformedProcedure">I performed this treatment</Label>
                </div>

                <Separator />
                <h4 className="text-md font-medium text-primary">Access Site Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="accessLocation">Location</Label>
                    {renderSelect('accessLocation', 'Select Location', vascularAccessLocationOptions)}
                  </div>
                  {accessLocation === 'Other' && (
                    <div className="space-y-1">
                      <Label htmlFor="otherAccessLocation">Specify Other Location</Label>
                      <Controller name="otherAccessLocation" control={control} render={({ field }) => <Input id="otherAccessLocation" {...field} value={field.value ?? ''} />} />
                    </div>
                  )}
                  <div className="space-y-1">
                     <Label>Side</Label>
                     {renderRadioGroup('accessSide', vascularAccessSideOptions)}
                  </div>
                </div>

                <Separator />
                <h4 className="text-md font-medium text-primary">Fluid Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="fluidType">Fluid Type</Label>
                        {renderSelect('fluidType', 'Select Fluid Type', vascularFluidTypeOptions)}
                    </div>
                    {fluidType === 'Other' && (
                        <div className="space-y-1">
                            <Label htmlFor="otherFluidType">Specify Other Fluid</Label>
                            <Controller name="otherFluidType" control={control} render={({ field }) => <Input id="otherFluidType" {...field} value={field.value ?? ''} />} />
                        </div>
                    )}
                </div>
                
                <Separator />
                <h4 className="text-md font-medium text-primary">Procedure Details</h4>
                <div className="space-y-1">
                  <Label htmlFor="procedureType">Procedure Type</Label>
                  {renderSelect('procedureType', 'Select Procedure Type', vascularProcedureTypeOptions)}
                </div>

                {/* Conditional Fields by Procedure Type */}
                {procedureType === 'Blood Draw' && (
                  <div className="pl-4 border-l-2 border-accent mt-2 pt-2 space-y-3">
                    <Label className="font-medium text-accent">Blood Draw Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="bloodDrawNeedleGauge">Needle Gauge</Label>
                      {renderSelect('bloodDrawNeedleGauge', 'Select Gauge', bloodDrawNeedleGaugeOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bloodDrawAttempts">Number of Attempts</Label>
                      <Controller name="bloodDrawAttempts" control={control} render={({ field }) => <Input id="bloodDrawAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div><Label>Successful</Label>{renderRadioGroup('bloodDrawSuccessful', yesNoOptions)}</div>
                  </div>
                )}

                {procedureType === 'IO Insertion' && (
                  <div className="pl-4 border-l-2 border-accent mt-2 pt-2 space-y-3">
                    <Label className="font-medium text-accent">IO Insertion Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="ioNeedleSystem">IO Needle Size/System</Label>
                      {renderSelect('ioNeedleSystem', 'Select System/Size', ioNeedleSystemOptions)}
                    </div>
                    {(ioNeedleSystem === 'Manual IO Needle (Specify)' || ioNeedleSystem === 'Other') && (
                      <div className="space-y-1">
                        <Label htmlFor="ioManualOtherSpecification">Specify Manual/Other System</Label>
                        <Controller name="ioManualOtherSpecification" control={control} render={({ field }) => <Input id="ioManualOtherSpecification" {...field} value={field.value ?? ''} />} />
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label htmlFor="ioAttempts">Number of Attempts</Label>
                      <Controller name="ioAttempts" control={control} render={({ field }) => <Input id="ioAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div><Label>Successful (Flush/Aspiration Confirmed)</Label>{renderRadioGroup('ioSuccessful', yesNoOptions)}</div>
                  </div>
                )}

                {(procedureType === 'IV Insertion' || procedureType === 'IV with blood draw') && (
                  <div className="pl-4 border-l-2 border-accent mt-2 pt-2 space-y-3">
                    <Label className="font-medium text-accent">{procedureType} Details</Label>
                    <div className="space-y-1">
                      <Label htmlFor="ivCatheterGauge">Catheter Gauge</Label>
                      {renderSelect('ivCatheterGauge', 'Select Gauge', ivCatheterGaugeOptions)}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ivAttempts">Number of Attempts</Label>
                      <Controller name="ivAttempts" control={control} render={({ field }) => <Input id="ivAttempts" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div><Label>Successful (Flashback & Flush Confirmed)</Label>{renderRadioGroup('ivSuccessful', yesNoOptions)}</div>
                  </div>
                )}
                
                {['Central line (existing)', 'Discontinue venous access', 'Existing catheter (used)', 'Swan Ganz maintenance (existing)'].includes(procedureType ?? '') && (
                     <div className="pl-4 border-l-2 border-accent mt-2 pt-2 space-y-3">
                        <Label className="font-medium text-accent">{procedureType} Details</Label>
                        <p className="text-sm text-muted-foreground">
                            {procedureType === 'Discontinue venous access' && "Note: Record removal details if applicable."}
                            {(procedureType === 'Central line (existing)' || procedureType === 'Existing catheter (used)' || procedureType === 'Swan Ganz maintenance (existing)') && "Note: Document assessment and management of existing line."}
                        </p>
                        {/* Potentially add a generic notes field here if needed for these types */}
                    </div>
                )}


                <Separator />
                <h4 className="text-md font-medium text-primary">Additional Options</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Controller name="useOfManualPressureInfuser" control={control} render={({ field }) => <Checkbox id="useOfManualPressureInfuser" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="useOfManualPressureInfuser" className="font-normal">Use of Manual Pressure Infuser</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller name="setupMonitorInfusionPump" control={control} render={({ field }) => <Checkbox id="setupMonitorInfusionPump" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="setupMonitorInfusionPump" className="font-normal">Setup/Monitor Infusion Pump</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller name="setupMonitorSyringeDriver" control={control} render={({ field }) => <Checkbox id="setupMonitorSyringeDriver" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="setupMonitorSyringeDriver" className="font-normal">Setup/Monitor Syringe Driver</Label>
                    </div>
                </div>

              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Vascular Access</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

    