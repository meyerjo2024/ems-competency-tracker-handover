// src/components/forms/patient-care-form/ObstetricsNeonatalDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { ObstetricsNeonatalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as ShadSelectLabel } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  obstetricsNeonatalProcedureNameOptions,
  infantGenderOptions,
  fundalMassageUterineToneOptions,
  incubatorTemperatureUnitOptions,
  placentaIntactOptions,
  yesNoOptions,
  yesNoNaOptions,
} from './patient-care-form-constants';

interface ObstetricsNeonatalDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<ObstetricsNeonatalEntry>;
  onSave: (data: ObstetricsNeonatalEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<ObstetricsNeonatalEntry> = {
  id: undefined,
  performedProcedure: false,
  procedureName: "N/A",
  // Delivery Procedures
  timeOfDelivery: '', // HH:MM
  infantGender: "N/A",
  abnormalDeliveryComplicationType: '',
  // Obstetric Procedures
  prolapsedCordPulsationsMaintained: "N/A",
  uterineTonePostMassage: "N/A",
  // Neonatal Procedures
  incubatorTemperatureSetting: undefined,
  incubatorTemperatureUnit: "N/A",
  // Shared Delivery Details
  placentaDelivered: "N/A",
  timeOfPlacentaDelivery: '', // HH:MM
  placentaIntact: "N/A",
  estimatedBloodLoss: undefined,
  deliveryComplications: '',
};

export function ObstetricsNeonatalDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: ObstetricsNeonatalDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<ObstetricsNeonatalEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const procedureName = watch('procedureName');
  const placentaDelivered = watch('placentaDelivered');

  const isDeliveryProcedure = [
    "Normal Vaginal Delivery", 
    "Abnormal Vaginal Delivery (Non-Breech)", 
    "Breech Delivery"
  ].includes(procedureName || '');

  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: ObstetricsNeonatalEntry) => {
    const submissionData: ObstetricsNeonatalEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      incubatorTemperatureSetting: data.incubatorTemperatureSetting ? Number(data.incubatorTemperatureSetting) : undefined,
      estimatedBloodLoss: data.estimatedBloodLoss ? Number(data.estimatedBloodLoss) : undefined,
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

  const renderRadioGroup = (fieldName: keyof ObstetricsNeonatalEntry, options: {label: string, value: string}[]) => (
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

  const renderSelect = (fieldName: keyof ObstetricsNeonatalEntry, placeholder: string, options: (string | {label: string, value: string})[], groupedOptions?: {group: string, items: string[]}[]) => (
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
                  {group.items.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectGroup>
              ))
            ) : (
              options.map(opt => typeof opt === 'string' 
                ? <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                : <SelectItem key={(opt as {value:string}).value} value={(opt as {value:string}).value}>{(opt as {label:string}).label}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}
    />
  );

  const dialogTitle = initialData?.id ? 'Edit OB/Neonatal Care' : 'Add OB/Neonatal Care';

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
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="obPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="obPerformedProcedure">I performed this treatment</Label>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="procedureName">Procedure</Label>
                  {renderSelect('procedureName', 'Select Procedure', [], obstetricsNeonatalProcedureNameOptions)}
                </div>
                
                <Separator className="my-3"/>

                {/* --- Delivery Procedures --- */}
                {procedureName === "Normal Vaginal Delivery" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <div className="space-y-1"><Label htmlFor="timeOfDelivery">Time of Delivery (HH:MM)</Label><Controller name="timeOfDelivery" control={control} render={({ field }) => <Input id="timeOfDelivery" type="time" {...field} value={field.value ?? ''} />} /></div>
                    <div className="space-y-1"><Label htmlFor="infantGender">Infant Gender</Label>{renderSelect('infantGender', 'Select Gender', infantGenderOptions)}</div>
                    <p className="text-xs text-muted-foreground">Note: APGAR scores should be recorded in Vitals section.</p>
                  </div>
                )}
                {procedureName === "Abnormal Vaginal Delivery (Non-Breech)" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <div className="space-y-1"><Label htmlFor="timeOfDelivery">Time of Delivery (HH:MM)</Label><Controller name="timeOfDelivery" control={control} render={({ field }) => <Input id="timeOfDelivery" type="time" {...field} value={field.value ?? ''} />} /></div>
                    <div className="space-y-1"><Label htmlFor="infantGender">Infant Gender</Label>{renderSelect('infantGender', 'Select Gender', infantGenderOptions)}</div>
                    <div className="space-y-1"><Label htmlFor="abnormalDeliveryComplicationType">Complication Type</Label><Controller name="abnormalDeliveryComplicationType" control={control} render={({ field }) => <Input id="abnormalDeliveryComplicationType" placeholder="e.g., Shoulder dystocia" {...field} value={field.value ?? ''} />} /></div>
                    <p className="text-xs text-muted-foreground">Note: APGAR scores should be recorded in Vitals section.</p>
                  </div>
                )}
                {procedureName === "Breech Delivery" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <div className="space-y-1"><Label htmlFor="timeOfDelivery">Time of Delivery (HH:MM)</Label><Controller name="timeOfDelivery" control={control} render={({ field }) => <Input id="timeOfDelivery" type="time" {...field} value={field.value ?? ''} />} /></div>
                    <div className="space-y-1"><Label htmlFor="infantGender">Infant Gender</Label>{renderSelect('infantGender', 'Select Gender', infantGenderOptions)}</div>
                    <p className="text-xs text-muted-foreground">Note: APGAR scores should be recorded in Vitals section.</p>
                  </div>
                )}

                {/* --- Obstetric Procedures --- */}
                {procedureName === "Care of Prolapsed Umbilical Cord" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <Label>Successful (Cord Pulsations Maintained)</Label>
                    {renderRadioGroup('prolapsedCordPulsationsMaintained', yesNoOptions.filter(o => o.value !== 'N/A') as any)}
                  </div>
                )}
                {procedureName === "Fundal Massage" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <div className="space-y-1"><Label htmlFor="uterineTonePostMassage">Uterine Tone Post-Massage</Label>{renderSelect('uterineTonePostMassage', 'Select Tone', fundalMassageUterineToneOptions)}</div>
                  </div>
                )}

                {/* --- Neonatal Procedures --- */}
                {procedureName === "Neonatal Resuscitation Required" && (
                  <div className="space-y-2 pl-4 border-l-2 text-xs text-muted-foreground">
                    <p>Note: Additional Airway/Breathing interventions for neonate should be documented in their respective sections.</p>
                    <p>Note: APGAR scores should be recorded in Vitals section.</p>
                  </div>
                )}
                {procedureName === "Setup/Monitor Incubator" && (
                  <div className="space-y-3 pl-4 border-l-2">
                    <div className="space-y-1"><Label htmlFor="incubatorTemperatureSetting">Temperature Setting</Label><Controller name="incubatorTemperatureSetting" control={control} render={({ field }) => <Input id="incubatorTemperatureSetting" type="number" step="0.1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                    <div className="space-y-1"><Label>Unit</Label>{renderRadioGroup('incubatorTemperatureUnit', incubatorTemperatureUnitOptions)}</div>
                  </div>
                )}

                {/* --- Shared Delivery Details Section --- */}
                {isDeliveryProcedure && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <h4 className="font-medium text-primary">Delivery Details</h4>
                    <div className="space-y-1">
                      <Label>Placenta Delivered</Label>
                      {renderRadioGroup('placentaDelivered', yesNoNaOptions)}
                    </div>
                    {placentaDelivered === "Yes" && (
                      <div className="pl-4 border-l-2 space-y-3">
                        <div className="space-y-1"><Label htmlFor="timeOfPlacentaDelivery">Time of Placenta Delivery (HH:MM)</Label><Controller name="timeOfPlacentaDelivery" control={control} render={({ field }) => <Input id="timeOfPlacentaDelivery" type="time" {...field} value={field.value ?? ''} />} /></div>
                        <div className="space-y-1"><Label htmlFor="placentaIntact">Placenta Intact</Label>{renderSelect('placentaIntact', 'Select Status', placentaIntactOptions)}</div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label htmlFor="estimatedBloodLoss">Estimated Blood Loss (mL)</Label>
                      <Controller name="estimatedBloodLoss" control={control} render={({ field }) => <Input id="estimatedBloodLoss" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="deliveryComplications">Delivery Complications</Label>
                      <Controller name="deliveryComplications" control={control} render={({ field }) => <Textarea id="deliveryComplications" placeholder="Document any complications during delivery..." {...field} value={field.value ?? ''} rows={3} />} />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save OB/Neonatal Care</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
