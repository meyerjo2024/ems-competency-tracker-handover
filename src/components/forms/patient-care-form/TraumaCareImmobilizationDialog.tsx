// src/components/forms/patient-care-form/TraumaCareImmobilizationDialog.tsx
'use client';

import * as React from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import type { TraumaCareImmobilizationEntry } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  yesNoOptions,
  traumaProcedureCategoryOptions,
  spinalImmobilizationProcedureOptions,
  cCollarSizeOptions,
  limbImmobilizationProcedureOptions,
  tractionSplintTypeOptions,
  hemorrhageControlProcedureOptions,
  tourniquetTypeOptions,
  hemostaticAgentTypeOptions,
  pasgCompartmentsOptions,
  otherTraumaCareProcedureOptions,
  pelvicDeviceTypeOptions,
} from './patient-care-form-constants';

interface TraumaCareImmobilizationDialogProps {
  triggerButton?: React.ReactNode;
  initialData?: Partial<TraumaCareImmobilizationEntry>;
  onSave: (data: TraumaCareImmobilizationEntry) => void;
  dialogOpen?: boolean;
  setDialogOpen?: (open: boolean) => void;
}

const defaultValues: Partial<TraumaCareImmobilizationEntry> = {
  id: undefined,
  performedProcedure: false,
  procedureCategory: 'N/A',
  procedureName: 'N/A',
  // Spinal
  cCollarSize: 'N/A',
  cCollarOtherSize: '',
  cCollarSuccessfulFit: 'N/A',
  spinalImmobilizationSuccessfulApplication: 'N/A',
  // Limb
  limbBasicSplintType: '',
  limbSplintSuccessfulImmobilization: 'N/A',
  limbTractionSplintType: 'N/A',
  limbTractionSplintOtherType: '',
  limbTractionSplintSuccessfulApplication: 'N/A',
  // Hemorrhage
  hemorrhageDressingType: '',
  hemorrhageBleedingControlled: 'N/A',
  tourniquetType: 'N/A',
  tourniquetOtherType: '',
  tourniquetLocation: '',
  tourniquetTimeApplied: '', // HH:MM
  tourniquetNumberOnLimb: undefined,
  tourniquetSuccessfulHemorrhageControl: 'N/A',
  hemostaticAgentType: 'N/A',
  hemostaticAgentOtherType: '',
  hemostaticAgentSuccessfulHemorrhageControl: 'N/A',
  pasgCompartmentsInflated: [],
  pasgPressureLeftLeg: undefined,
  pasgPressureRightLeg: undefined,
  pasgPressureAbdomen: undefined,
  pasgBpResponse: 'N/A',
  nonPasgBpResponse: 'N/A',
  // Other Trauma
  pelvicDeviceType: 'N/A',
  pelvicDeviceOtherType: '',
  pelvicDeviceSuccessfulApplication: 'N/A',
  impaledObjectStabilizationMethod: '',
  extricationDuration: undefined,
  extricationMethodTools: '',
};

export function TraumaCareImmobilizationDialog({
  triggerButton,
  initialData,
  onSave,
  dialogOpen: controlledDialogOpen,
  setDialogOpen: controlledSetDialogOpen,
}: TraumaCareImmobilizationDialogProps) {
  const [isInternalOpen, setIsInternalOpen] = React.useState(false);
  const isOpen = controlledDialogOpen !== undefined ? controlledDialogOpen : isInternalOpen;
  const setIsOpen = controlledSetDialogOpen !== undefined ? controlledSetDialogOpen : setIsInternalOpen;

  const methods = useForm<TraumaCareImmobilizationEntry>({ defaultValues: { ...defaultValues, ...initialData } });
  const { control, handleSubmit, watch, reset, setValue } = methods;

  const procedureCategory = watch('procedureCategory');
  const procedureName = watch('procedureName');

  // Specific watchers for conditional fields
  const cCollarSelected = procedureCategory === 'Spinal Immobilization' && procedureName === 'Cervical Collar (C-Collar)';
  const cCollarSize = watch('cCollarSize');
  const tractionSplintSelected = procedureCategory === 'Limb Immobilization' && procedureName === 'Traction Splint';
  const tractionSplintType = watch('limbTractionSplintType');
  const tourniquetSelected = procedureCategory === 'Hemorrhage Control' && procedureName === 'Tourniquet Application';
  const tourniquetType = watch('tourniquetType');
  const hemostaticAgentSelected = procedureCategory === 'Hemorrhage Control' && procedureName === 'Hemostatic Agent Use';
  const hemostaticAgentType = watch('hemostaticAgentType');
  const pasgSelected = procedureCategory === 'Hemorrhage Control' && procedureName === 'Pneumatic Anti-Shock Garment (PASG/MAST)';
  const pasgCompartments = watch('pasgCompartmentsInflated', []);
  const pelvicDeviceSelected = procedureCategory === 'Other Trauma Care' && procedureName === 'Pelvic Stabilisation Device Use';
  const pelvicDeviceType = watch('pelvicDeviceType');


  React.useEffect(() => {
    if (isOpen) {
      reset({ ...defaultValues, ...initialData });
    }
  }, [isOpen, initialData, reset]);

  const onSubmitDialog = (data: TraumaCareImmobilizationEntry) => {
    const submissionData: TraumaCareImmobilizationEntry = {
      ...data,
      id: data.id || Date.now().toString(),
      tourniquetNumberOnLimb: data.tourniquetNumberOnLimb ? Number(data.tourniquetNumberOnLimb) : undefined,
      pasgPressureLeftLeg: data.pasgPressureLeftLeg ? Number(data.pasgPressureLeftLeg) : undefined,
      pasgPressureRightLeg: data.pasgPressureRightLeg ? Number(data.pasgPressureRightLeg) : undefined,
      pasgPressureAbdomen: data.pasgPressureAbdomen ? Number(data.pasgPressureAbdomen) : undefined,
      extricationDuration: data.extricationDuration ? Number(data.extricationDuration) : undefined,
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
  
  const renderRadioGroup = (fieldName: keyof TraumaCareImmobilizationEntry, options: {label: string, value: string}[]) => (
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

  const renderSelect = (fieldName: keyof TraumaCareImmobilizationEntry, placeholder: string, options: string[] | {label: string, value: string}[]) => (
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

  const renderCategorySpecificProcedures = () => {
    let options: string[] = ['N/A'];
    if (procedureCategory === 'Spinal Immobilization') options = spinalImmobilizationProcedureOptions;
    else if (procedureCategory === 'Limb Immobilization') options = limbImmobilizationProcedureOptions;
    else if (procedureCategory === 'Hemorrhage Control') options = hemorrhageControlProcedureOptions;
    else if (procedureCategory === 'Other Trauma Care') options = otherTraumaCareProcedureOptions;
    
    return renderSelect('procedureName', 'Select Specific Procedure', options);
  };


  const dialogTitle = initialData?.id ? 'Edit Trauma Care / Immobilization' : 'Add Trauma Care / Immobilization';

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
                  <Controller name="performedProcedure" control={control} render={({ field }) => <Checkbox id="traumaPerformedProcedure" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="traumaPerformedProcedure">I performed this treatment</Label>
                </div>
                
                <Tabs 
                  value={procedureCategory} 
                  onValueChange={(value) => {
                    setValue('procedureCategory', value);
                    setValue('procedureName', 'N/A'); // Reset specific procedure when category changes
                  }} 
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    {traumaProcedureCategoryOptions.filter(opt => opt.value !== 'N/A').map(cat => (
                       <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Content for each category tab */}
                  {traumaProcedureCategoryOptions.filter(opt => opt.value !== 'N/A').map(cat => (
                    <TabsContent key={cat.value} value={cat.value} className="mt-4 space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor={`procedureName-${cat.value}`}>Procedure</Label>
                        {renderCategorySpecificProcedures()}
                      </div>
                      <Separator className="my-3"/>

                      {/* --- Spinal Immobilization Specific Fields --- */}
                      {procedureCategory === 'Spinal Immobilization' && (
                        <>
                          {procedureName === 'Cervical Collar (C-Collar)' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="cCollarSize">Size</Label>{renderSelect('cCollarSize', 'Select C-Collar Size', cCollarSizeOptions)}</div>
                              {cCollarSize === 'Other' && <div className="space-y-1"><Label htmlFor="cCollarOtherSize">Other Size</Label><Controller name="cCollarOtherSize" control={control} render={({ field }) => <Input id="cCollarOtherSize" {...field} value={field.value ?? ''} />} /></div>}
                              <div><Label>Successful Fit</Label>{renderRadioGroup('cCollarSuccessfulFit', yesNoOptions)}</div>
                            </div>
                          )}
                          {['Kendrick Extrication Device (KED)', 'Short Board', 'Long Board (LSP / Backboard)', 'Scoop Stretcher', 'Vacuum Mattress'].includes(procedureName ?? '') && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <Label>Successful Application</Label>{renderRadioGroup('spinalImmobilizationSuccessfulApplication', yesNoOptions)}
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Limb Immobilization Specific Fields --- */}
                      {procedureCategory === 'Limb Immobilization' && (
                        <>
                          {procedureName === 'Basic Splint (Sling/Swathe, Pillow, SAM Splint folded)' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="limbBasicSplintType">Type (e.g., Sling & Swathe)</Label><Controller name="limbBasicSplintType" control={control} render={({ field }) => <Input id="limbBasicSplintType" {...field} value={field.value ?? ''} />} /></div>
                              <div><Label>Successful Immobilization</Label>{renderRadioGroup('limbSplintSuccessfulImmobilization', yesNoOptions)}</div>
                            </div>
                          )}
                          {procedureName === 'Traction Splint' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="limbTractionSplintType">Type</Label>{renderSelect('limbTractionSplintType', 'Select Traction Splint Type', tractionSplintTypeOptions)}</div>
                              {tractionSplintType === 'Other' && <div className="space-y-1"><Label htmlFor="limbTractionSplintOtherType">Other Type</Label><Controller name="limbTractionSplintOtherType" control={control} render={({ field }) => <Input id="limbTractionSplintOtherType" {...field} value={field.value ?? ''} />} /></div>}
                              <div><Label>Successful Application (Alignment/Pain Relief)</Label>{renderRadioGroup('limbTractionSplintSuccessfulApplication', yesNoOptions)}</div>
                            </div>
                          )}
                          {['Vacuum Splint (Limb)', 'Air Splint', 'Rigid Splint (Board, SAM Splint rigid)'].includes(procedureName ?? '') && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <Label>Successful Immobilization</Label>{renderRadioGroup('limbSplintSuccessfulImmobilization', yesNoOptions)}
                            </div>
                          )}
                        </>
                      )}

                      {/* --- Hemorrhage Control Specific Fields --- */}
                      {procedureCategory === 'Hemorrhage Control' && (
                        <>
                          {procedureName === 'Wound Dressing / Bandaging' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="hemorrhageDressingType">Type of Dressing</Label><Controller name="hemorrhageDressingType" control={control} render={({ field }) => <Input id="hemorrhageDressingType" {...field} value={field.value ?? ''} />} /></div>
                              <div><Label>Bleeding Controlled</Label>{renderRadioGroup('hemorrhageBleedingControlled', yesNoOptions)}</div>
                            </div>
                          )}
                          {tourniquetSelected && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="tourniquetType">Type</Label>{renderSelect('tourniquetType', 'Select Tourniquet Type', tourniquetTypeOptions)}</div>
                              {tourniquetType === 'Other' && <div className="space-y-1"><Label htmlFor="tourniquetOtherType">Other Type</Label><Controller name="tourniquetOtherType" control={control} render={({ field }) => <Input id="tourniquetOtherType" {...field} value={field.value ?? ''} />} /></div>}
                              <div className="space-y-1"><Label htmlFor="tourniquetLocation">Location</Label><Controller name="tourniquetLocation" control={control} render={({ field }) => <Input id="tourniquetLocation" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="tourniquetTimeApplied">Time Applied (HH:MM)</Label><Controller name="tourniquetTimeApplied" control={control} render={({ field }) => <Input id="tourniquetTimeApplied" type="time" {...field} value={field.value ?? ''} />} /></div>
                              <div className="space-y-1"><Label htmlFor="tourniquetNumberOnLimb">Number of Tourniquets on Limb</Label><Controller name="tourniquetNumberOnLimb" control={control} render={({ field }) => <Input id="tourniquetNumberOnLimb" type="number" min="1" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div><Label>Successful Hemorrhage Control</Label>{renderRadioGroup('tourniquetSuccessfulHemorrhageControl', yesNoOptions)}</div>
                            </div>
                          )}
                          {hemostaticAgentSelected && (
                             <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="hemostaticAgentType">Type</Label>{renderSelect('hemostaticAgentType', 'Select Hemostatic Agent', hemostaticAgentTypeOptions)}</div>
                              {hemostaticAgentType === 'Other Granules/Gauze' && <div className="space-y-1"><Label htmlFor="hemostaticAgentOtherType">Other Type</Label><Controller name="hemostaticAgentOtherType" control={control} render={({ field }) => <Input id="hemostaticAgentOtherType" {...field} value={field.value ?? ''} />} /></div>}
                              <div><Label>Successful Hemorrhage Control</Label>{renderRadioGroup('hemostaticAgentSuccessfulHemorrhageControl', yesNoOptions)}</div>
                            </div>
                          )}
                          {pasgSelected && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <Label>Compartments Inflated</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {pasgCompartmentsOptions.map(opt => (
                                  <div key={opt.id} className="flex items-center space-x-2">
                                     <Controller
                                        name="pasgCompartmentsInflated"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field: checkboxField }) => (
                                          <Checkbox
                                            id={`pasg-${opt.id}`}
                                            checked={checkboxField.value?.includes(opt.id)}
                                            onCheckedChange={(checked) => {
                                              const currentValues = checkboxField.value || [];
                                              if (checked) { checkboxField.onChange([...currentValues, opt.id]); } 
                                              else { checkboxField.onChange(currentValues.filter((value) => value !== opt.id)); }
                                            }}
                                          />
                                        )}
                                      />
                                    <Label htmlFor={`pasg-${opt.id}`} className="font-normal">{opt.label}</Label>
                                  </div>
                                ))}
                              </div>
                              {pasgCompartments?.includes('Left Leg') && <div className="space-y-1"><Label htmlFor="pasgPressureLeftLeg">Left Leg Pressure (mmHg)</Label><Controller name="pasgPressureLeftLeg" control={control} render={({ field }) => <Input id="pasgPressureLeftLeg" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                              {pasgCompartments?.includes('Right Leg') && <div className="space-y-1"><Label htmlFor="pasgPressureRightLeg">Right Leg Pressure (mmHg)</Label><Controller name="pasgPressureRightLeg" control={control} render={({ field }) => <Input id="pasgPressureRightLeg" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                              {pasgCompartments?.includes('Abdomen') && <div className="space-y-1"><Label htmlFor="pasgPressureAbdomen">Abdomen Pressure (mmHg)</Label><Controller name="pasgPressureAbdomen" control={control} render={({ field }) => <Input id="pasgPressureAbdomen" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>}
                              <div><Label>BP Response</Label>{renderRadioGroup('pasgBpResponse', yesNoOptions)}</div>
                            </div>
                          )}
                          {procedureName === 'Non-Pneumatic Anti-Shock Garment Use' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <Label>BP Response</Label>{renderRadioGroup('nonPasgBpResponse', yesNoOptions)}
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* --- Other Trauma Care Specific Fields --- */}
                      {procedureCategory === 'Other Trauma Care' && (
                        <>
                          {pelvicDeviceSelected && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="pelvicDeviceType">Type</Label>{renderSelect('pelvicDeviceType', 'Select Pelvic Device Type', pelvicDeviceTypeOptions)}</div>
                              {pelvicDeviceType === 'Other' && <div className="space-y-1"><Label htmlFor="pelvicDeviceOtherType">Other Type</Label><Controller name="pelvicDeviceOtherType" control={control} render={({ field }) => <Input id="pelvicDeviceOtherType" {...field} value={field.value ?? ''} />} /></div>}
                              <div><Label>Successful Application</Label>{renderRadioGroup('pelvicDeviceSuccessfulApplication', yesNoOptions)}</div>
                            </div>
                          )}
                          {procedureName === 'Care of Impaled Objects' && (
                            <div className="space-y-1 pl-4 border-l-2">
                              <Label htmlFor="impaledObjectStabilizationMethod">Method of Stabilization</Label>
                              <Controller name="impaledObjectStabilizationMethod" control={control} render={({ field }) => <Input id="impaledObjectStabilizationMethod" {...field} value={field.value ?? ''} />} />
                            </div>
                          )}
                           {procedureName === 'Extrication Performed' && (
                            <div className="space-y-3 pl-4 border-l-2">
                              <div className="space-y-1"><Label htmlFor="extricationDuration">Duration (minutes)</Label><Controller name="extricationDuration" control={control} render={({ field }) => <Input id="extricationDuration" type="number" {...field} value={field.value ?? ''} onChange={e => handleNumericInput(field, e.target.value)} />} /></div>
                              <div className="space-y-1"><Label htmlFor="extricationMethodTools">Method/Tools Used</Label><Controller name="extricationMethodTools" control={control} render={({ field }) => <Textarea id="extricationMethodTools" {...field} value={field.value ?? ''} />} /></div>
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
              <Button type="submit">Save Trauma Care</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

    