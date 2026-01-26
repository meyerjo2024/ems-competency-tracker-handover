// src/components/forms/patient-care-form/MedicationDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { MedicationEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel as ShadSelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  medicationNameOptions,
  medicationUnitOptions,
  medicationRouteOptions,
} from './patient-care-form-constants';
import { formatISO, parseISO } from 'date-fns';

interface MedicationDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<MedicationEntry>;
  onSave: (data: MedicationEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const getDefaultTimestamp = () => formatISO(new Date()).substring(0, 16); // YYYY-MM-DDTHH:mm

const defaultValues: Partial<MedicationEntry> = {
  id: undefined,
  performedProcedure: false,
  medicationName: "N/A",
  otherMedicationName: '',
  dose: undefined,
  unit: "N/A",
  route: "N/A",
  otherRoute: '',
  timeAdministered: getDefaultTimestamp(),
  responseToMedication: '',
};

export function MedicationDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: MedicationDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;
  
  const methods = useForm<MedicationEntry>({
    defaultValues: { 
      ...defaultValues, 
      ...initialData, 
      timeAdministered: initialData?.timeAdministered 
        ? formatISO(parseISO(initialData.timeAdministered)).substring(0, 16) 
        : getDefaultTimestamp(),
    }
  });
  const { control, handleSubmit, watch, reset } = methods;

  const selectedMedication = watch('medicationName');
  const selectedRoute = watch('route');

  React.useEffect(() => {
    if (isOpen) {
      reset({ 
        ...defaultValues, 
        ...initialData, 
        timeAdministered: initialData?.timeAdministered 
        ? formatISO(parseISO(initialData.timeAdministered)).substring(0, 16) 
        : getDefaultTimestamp(),
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: MedicationEntry) => {
    const submissionData: MedicationEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      timeAdministered: data.timeAdministered ? formatISO(new Date(data.timeAdministered)) : undefined,
      dose: data.dose ? Number(data.dose) : undefined,
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

  const dialogTitle = initialData?.id ? 'Edit Medication Administration' : 'Add Medication Administration';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && <DialogTrigger asChild onClick={() => setIsOpen(true)}>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitDialog)}>
            <ScrollArea className="max-h-[70vh] p-1 pr-4">
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="medPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="medPerformedProcedure">I administered this medication</Label>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="medicationName">Medication</Label>
                  <Controller
                    name="medicationName"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? "N/A"} defaultValue={field.value}>
                        <SelectTrigger id="medicationName"><SelectValue placeholder="Select medication" /></SelectTrigger>
                        <SelectContent>
                          {medicationNameOptions.map(group => (
                            <SelectGroup key={group.group}>
                              <ShadSelectLabel>{group.group}</ShadSelectLabel>
                              {group.items.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {selectedMedication === "Other (Specify)" && (
                  <div className="space-y-1 pl-4">
                    <Label htmlFor="otherMedicationName">Specify Other Medication</Label>
                    <Controller name="otherMedicationName" control={control} render={({ field }) => <Input id="otherMedicationName" {...field} value={field.value ?? ''} />} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="dose">Dose</Label>
                    <Controller name="dose" control={control} render={({ field }) => <Input id="dose" type="number" step="any" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="unit">Unit</Label>
                    <Controller
                      name="unit"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? "N/A"} defaultValue={field.value}>
                          <SelectTrigger id="unit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                          <SelectContent>{medicationUnitOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="route">Route</Label>
                  <Controller
                    name="route"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? "N/A"} defaultValue={field.value}>
                        <SelectTrigger id="route"><SelectValue placeholder="Select route" /></SelectTrigger>
                        <SelectContent>{medicationRouteOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {selectedRoute === "Other" && (
                  <div className="space-y-1 pl-4">
                    <Label htmlFor="otherRoute">Specify Other Route</Label>
                    <Controller name="otherRoute" control={control} render={({ field }) => <Input id="otherRoute" {...field} value={field.value ?? ''} />} />
                  </div>
                )}
                
                <div className="space-y-1">
                  <Label htmlFor="timeAdministered">Time Administered</Label>
                  <Controller 
                    name="timeAdministered" 
                    control={control} 
                    render={({ field }) => (
                      <Input 
                        id="timeAdministered" 
                        type="datetime-local" 
                        {...field} 
                        value={field.value || ''}
                       />
                    )} 
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="responseToMedication">Response to Medication</Label>
                  <Controller name="responseToMedication" control={control} render={({ field }) => <Textarea id="responseToMedication" placeholder="Document patient's response..." {...field} value={field.value ?? ''} rows={3} />} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Medication</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
