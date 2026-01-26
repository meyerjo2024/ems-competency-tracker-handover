// src/components/forms/patient-care-form/ImpressionSection.tsx
'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { PatientCareFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input'; // For "Other" text fields if needed
import {
  medicalConditionsOptions,
  arrestWitnessedByOptions,
  returnOfPulseOptions,
  mechanismOfInjuryOptions,
  causeOfInjuryOptions,
  intentOfInjuryOptions,
  patientCriticalityOptions,
} from './patient-care-form-constants';

interface ImpressionSectionProps {
  prefix: 'primary' | 'secondary';
}

export function ImpressionSection({ prefix }: ImpressionSectionProps) {
  const { control } = useFormContext<PatientCareFormData>();

  const impressionConditionField = `${prefix}ImpressionCondition` as const;
  const selectedImpression = useWatch({ control, name: impressionConditionField });

  const isCardiacArrest = selectedImpression?.toLowerCase().includes('cardiac conditions (arrest)');
  const isTrauma = selectedImpression?.toLowerCase().includes('trauma');

  return (
    <Card>
      <CardHeader>
        {/* Title is handled by the TabTrigger in Parent */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impression Dropdown */}
        <div className="space-y-1">
          <Label htmlFor={`${prefix}ImpressionCondition`}>Impression</Label>
          <Controller
            name={impressionConditionField}
            control={control}
            defaultValue="N/A"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? "N/A"}>
                <SelectTrigger id={`${prefix}ImpressionCondition`}>
                  <SelectValue placeholder="Select medical condition" />
                </SelectTrigger>
                <SelectContent>
                  {medicalConditionsOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Conditional Fields for Cardiac Arrest */}
        {isCardiacArrest && (
          <div className="pl-4 border-l-2 border-primary space-y-4 py-2 mt-4">
            <p className="font-medium text-sm text-primary">Cardiac Arrest Details</p>
            <div className="space-y-1">
              <Label>Arrest Witnessed By</Label>
              <Controller
                name={`${prefix}ImpressionCardiacArrestWitnessedBy`}
                control={control}
                defaultValue="N/A"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value ?? "N/A"} className="mt-1 space-y-1">
                    {arrestWitnessedByOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${prefix}ArrestWitnessed${opt.value}`} />
                        <Label htmlFor={`${prefix}ArrestWitnessed${opt.value}`} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label>Return of Pulse</Label>
              <Controller
                name={`${prefix}ImpressionCardiacArrestReturnOfPulse`}
                control={control}
                defaultValue="N/A"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value ?? "N/A"} className="mt-1 space-y-1">
                    {returnOfPulseOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${prefix}ReturnPulse${opt.value}`} />
                        <Label htmlFor={`${prefix}ReturnPulse${opt.value}`} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        )}

        {/* Conditional Fields for Trauma */}
        {isTrauma && (
          <div className="pl-4 border-l-2 border-destructive space-y-4 py-2 mt-4">
            <p className="font-medium text-sm text-destructive">Trauma Details</p>
            <div className="space-y-1">
              <Label>Mechanism of Injury</Label>
              <Controller
                name={`${prefix}ImpressionTraumaMechanism`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2">
                    {mechanismOfInjuryOptions.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${prefix}Mechanism${opt.id}`}
                          checked={field.value?.includes(opt.label)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            if (checked) {
                              field.onChange([...currentValues, opt.label]);
                            } else {
                              field.onChange(currentValues.filter((val) => val !== opt.label));
                            }
                          }}
                        />
                        <Label htmlFor={`${prefix}Mechanism${opt.id}`} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${prefix}ImpressionTraumaCause`}>Cause of Injury</Label>
              <Controller
                name={`${prefix}ImpressionTraumaCause`}
                control={control}
                defaultValue="N/A"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? "N/A"}>
                    <SelectTrigger id={`${prefix}ImpressionTraumaCause`}>
                      <SelectValue placeholder="Select cause of injury" />
                    </SelectTrigger>
                    <SelectContent>
                      {causeOfInjuryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label>Intent of Injury</Label>
              <Controller
                name={`${prefix}ImpressionTraumaIntent`}
                control={control}
                defaultValue="N/A"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value ?? "N/A"} className="mt-1 space-y-1">
                    {intentOfInjuryOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${prefix}Intent${opt.value}`} />
                        <Label htmlFor={`${prefix}Intent${opt.value}`} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        )}

        {/* Patient Criticality */}
        <div className="space-y-1 pt-4">
          <Label>Patient Criticality</Label>
          <Controller
            name={`${prefix}PatientCriticality`}
            control={control}
            defaultValue="N/A"
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} value={field.value ?? "N/A"} className="mt-1 space-y-1">
                {patientCriticalityOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`${prefix}Criticality${opt.value}`} />
                    <Label htmlFor={`${prefix}Criticality${opt.value}`} className="font-normal">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
