// src/components/forms/patient-care-form/VitalsInterventionsTab.tsx
'use client';

import * as React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { PatientCareFormData, VitalSignEntry, AirwayProcedureEntry, CardiacProcedureEntry, VascularAccessEntry, OtherInterventionEntry, MedicationEntry, BreathingSupportEntry, TraumaCareImmobilizationEntry, ObstetricsNeonatalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, ListChecks, Activity, Wind, HeartPulse, Droplet, Syringe, ShieldQuestion, ChevronDown, ChevronUp, Zap, ShieldAlert, Baby } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Checkbox } from '@/components/ui/checkbox'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { VitalsEntryDialog } from './VitalsEntryDialog';
import { AirwayProcedureDialog } from './AirwayProcedureDialog';
import { BreathingSupportDialog } from './BreathingSupportDialog';
import { CardiacProcedureDialog } from './CardiacProcedureDialog';
import { VascularAccessDialog } from './VascularAccessDialog';
import { MedicationDialog } from './MedicationDialog';
import { TraumaCareImmobilizationDialog } from './TraumaCareImmobilizationDialog';
import { ObstetricsNeonatalDialog } from './ObstetricsNeonatalDialog';
import { OtherInterventionDialog } from './OtherInterventionDialog'; // New import
import { format, parseISO } from 'date-fns';

export function VitalsInterventionsTab() {
  const { control } = useFormContext<PatientCareFormData>();

  const [editingVital, setEditingVital] = React.useState<{index: number, data: VitalSignEntry} | null>(null);
  const [vitalsDialogOpen, setVitalsDialogOpen] = React.useState(false);

  const [editingAirway, setEditingAirway] = React.useState<{index: number, data: AirwayProcedureEntry} | null>(null);
  const [airwayDialogOpen, setAirwayDialogOpen] = React.useState(false);

  const [editingBreathingSupport, setEditingBreathingSupport] = React.useState<{index: number, data: BreathingSupportEntry} | null>(null);
  const [breathingSupportDialogOpen, setBreathingSupportDialogOpen] = React.useState(false);

  const [editingCardiac, setEditingCardiac] = React.useState<{index: number, data: CardiacProcedureEntry} | null>(null);
  const [cardiacDialogOpen, setCardiacDialogOpen] = React.useState(false);

  const [editingVascularAccess, setEditingVascularAccess] = React.useState<{index: number, data: VascularAccessEntry} | null>(null);
  const [vascularAccessDialogOpen, setVascularAccessDialogOpen] = React.useState(false);

  const [editingTraumaCare, setEditingTraumaCare] = React.useState<{index: number, data: TraumaCareImmobilizationEntry} | null>(null);
  const [traumaCareDialogOpen, setTraumaCareDialogOpen] = React.useState(false);

  const [editingObstetricsNeonatal, setEditingObstetricsNeonatal] = React.useState<{index: number, data: ObstetricsNeonatalEntry} | null>(null);
  const [obstetricsNeonatalDialogOpen, setObstetricsNeonatalDialogOpen] = React.useState(false);

  const [editingMedication, setEditingMedication] = React.useState<{index: number, data: MedicationEntry} | null>(null);
  const [medicationDialogOpen, setMedicationDialogOpen] = React.useState(false);

  const [editingOtherIntervention, setEditingOtherIntervention] = React.useState<{index: number, data: OtherInterventionEntry} | null>(null); // New state
  const [otherInterventionDialogOpen, setOtherInterventionDialogOpen] = React.useState(false); // New state

  const [expandedVital, setExpandedVital] = React.useState<string | null>(null);


  const { fields: vitalsFields, append: appendVital, update: updateVital, remove: removeVital } = useFieldArray({ control, name: "vitals" });
  const { fields: airwayFields, append: appendAirway, update: updateAirway, remove: removeAirway } = useFieldArray({ control, name: "airwayProcedures" });
  const { fields: breathingSupportFields, append: appendBreathingSupport, update: updateBreathingSupport, remove: removeBreathingSupport } = useFieldArray({ control, name: "breathingSupportProcedures" });
  const { fields: cardiacFields, append: appendCardiac, update: updateCardiac, remove: removeCardiac } = useFieldArray({ control, name: "cardiacProcedures" });
  const { fields: vascularAccessFields, append: appendVascularAccess, update: updateVascularAccess, remove: removeVascularAccess } = useFieldArray({ control, name: "vascularAccessProcedures" });
  const { fields: traumaCareFields, append: appendTraumaCare, update: updateTraumaCare, remove: removeTraumaCare } = useFieldArray({ control, name: "traumaCareProcedures" });
  const { fields: obstetricsNeonatalFields, append: appendObstetricsNeonatal, update: updateObstetricsNeonatal, remove: removeObstetricsNeonatal } = useFieldArray({ control, name: "obstetricsNeonatalProcedures" });
  const { fields: otherInterventionFields, append: appendOther, update: updateOther, remove: removeOther } = useFieldArray({ control, name: "otherInterventions" });
  const { fields: medicationFields, append: appendMed, update: updateMed, remove: removeMed } = useFieldArray({ control, name: "medicationsAdministered" });

  // Vitals Dialog Handlers
  const handleSaveVital = (data: VitalSignEntry) => {
    if (editingVital !== null) {
      updateVital(editingVital.index, data);
      setEditingVital(null);
    } else {
      appendVital(data);
    }
    setVitalsDialogOpen(false);
  };
  const openAddVitalsDialog = () => { setEditingVital(null); setVitalsDialogOpen(true); };
  const openEditVitalsDialog = (index: number, data: VitalSignEntry) => { setEditingVital({ index, data }); setVitalsDialogOpen(true); };

  // Airway Dialog Handlers
  const handleSaveAirway = (data: AirwayProcedureEntry) => {
    if (editingAirway !== null) {
      updateAirway(editingAirway.index, data);
      setEditingAirway(null);
    } else {
      appendAirway(data);
    }
    setAirwayDialogOpen(false);
  };
  const openAddAirwayDialog = () => { setEditingAirway(null); setAirwayDialogOpen(true); };
  const openEditAirwayDialog = (index: number, data: AirwayProcedureEntry) => { setEditingAirway({ index, data }); setAirwayDialogOpen(true); };

  // Breathing Support Dialog Handlers
  const handleSaveBreathingSupport = (data: BreathingSupportEntry) => {
    if (editingBreathingSupport !== null) {
      updateBreathingSupport(editingBreathingSupport.index, data);
      setEditingBreathingSupport(null);
    } else {
      appendBreathingSupport(data);
    }
    setBreathingSupportDialogOpen(false);
  };
  const openAddBreathingSupportDialog = () => { setEditingBreathingSupport(null); setBreathingSupportDialogOpen(true); };
  const openEditBreathingSupportDialog = (index: number, data: BreathingSupportEntry) => { setEditingBreathingSupport({ index, data }); setBreathingSupportDialogOpen(true); };

  // Cardiac Dialog Handlers
  const handleSaveCardiac = (data: CardiacProcedureEntry) => {
    if (editingCardiac !== null) {
      updateCardiac(editingCardiac.index, data);
      setEditingCardiac(null);
    } else {
      appendCardiac(data);
    }
    setCardiacDialogOpen(false);
  };
  const openAddCardiacDialog = () => { setEditingCardiac(null); setCardiacDialogOpen(true); };
  const openEditCardiacDialog = (index: number, data: CardiacProcedureEntry) => { setEditingCardiac({ index, data }); setCardiacDialogOpen(true); };

  // Vascular Access Dialog Handlers
  const handleSaveVascularAccess = (data: VascularAccessEntry) => {
    if (editingVascularAccess !== null) {
      updateVascularAccess(editingVascularAccess.index, data);
      setEditingVascularAccess(null);
    } else {
      appendVascularAccess(data);
    }
    setVascularAccessDialogOpen(false);
  };
  const openAddVascularAccessDialog = () => { setEditingVascularAccess(null); setVascularAccessDialogOpen(true); };
  const openEditVascularAccessDialog = (index: number, data: VascularAccessEntry) => { setEditingVascularAccess({ index, data }); setVascularAccessDialogOpen(true); };
  
  // Trauma Care & Immobilization Dialog Handlers
  const handleSaveTraumaCare = (data: TraumaCareImmobilizationEntry) => {
    if (editingTraumaCare !== null) {
      updateTraumaCare(editingTraumaCare.index, data);
      setEditingTraumaCare(null);
    } else {
      appendTraumaCare(data);
    }
    setTraumaCareDialogOpen(false);
  };
  const openAddTraumaCareDialog = () => { setEditingTraumaCare(null); setTraumaCareDialogOpen(true); };
  const openEditTraumaCareDialog = (index: number, data: TraumaCareImmobilizationEntry) => { setEditingTraumaCare({ index, data }); setTraumaCareDialogOpen(true); };

  // Obstetrics/Neonatal Dialog Handlers
  const handleSaveObstetricsNeonatal = (data: ObstetricsNeonatalEntry) => {
    if (editingObstetricsNeonatal !== null) {
      updateObstetricsNeonatal(editingObstetricsNeonatal.index, data);
      setEditingObstetricsNeonatal(null);
    } else {
      appendObstetricsNeonatal(data);
    }
    setObstetricsNeonatalDialogOpen(false);
  };
  const openAddObstetricsNeonatalDialog = () => { setEditingObstetricsNeonatal(null); setObstetricsNeonatalDialogOpen(true); };
  const openEditObstetricsNeonatalDialog = (index: number, data: ObstetricsNeonatalEntry) => { setEditingObstetricsNeonatal({ index, data }); setObstetricsNeonatalDialogOpen(true); };

  // Medication Dialog Handlers
  const handleSaveMedication = (data: MedicationEntry) => {
    if (editingMedication !== null) {
      updateMed(editingMedication.index, data);
      setEditingMedication(null);
    } else {
      appendMed(data);
    }
    setMedicationDialogOpen(false);
  };
  const openAddMedicationDialog = () => { setEditingMedication(null); setMedicationDialogOpen(true); };
  const openEditMedicationDialog = (index: number, data: MedicationEntry) => {
    const formattedData = {
      ...data,
      timeAdministered: data.timeAdministered ? data.timeAdministered.substring(0, 16) : undefined
    };
    setEditingMedication({ index, data: formattedData });
    setMedicationDialogOpen(true);
  };

  // Other Intervention Dialog Handlers (New)
  const handleSaveOtherIntervention = (data: OtherInterventionEntry) => {
    if (editingOtherIntervention !== null) {
      updateOther(editingOtherIntervention.index, data);
      setEditingOtherIntervention(null);
    } else {
      appendOther(data);
    }
    setOtherInterventionDialogOpen(false);
  };
  const openAddOtherInterventionDialog = () => { setEditingOtherIntervention(null); setOtherInterventionDialogOpen(true); };
  const openEditOtherInterventionDialog = (index: number, data: OtherInterventionEntry) => { setEditingOtherIntervention({ index, data }); setOtherInterventionDialogOpen(true); };


  const toggleExpandVital = (id: string) => {
    setExpandedVital(prev => (prev === id ? null : id));
  };

  const formatVitalTimestamp = (isoString: string | undefined) => {
    if (!isoString) return "N/A";
    try {
      return format(parseISO(isoString), "MMM d, yyyy HH:mm");
    } catch (e) {
      try {
        return format(new Date(isoString), "MMM d, yyyy HH:mm");
      } catch (e2) {
        return "Invalid Date";
      }
    }
  };

  const formatMedicationTime = (isoString: string | undefined) => {
    if (!isoString) return "N/A";
    try {
      const date = parseISO(isoString);
      if (isNaN(date.getTime())) {
         const directDate = new Date(isoString);
         if(isNaN(directDate.getTime())) return "Invalid Time";
         return format(directDate, "HH:mm");
      }
      return format(date, "HH:mm");
    } catch (e) {
      return "Invalid Time";
    }
  };

  const formatTimePicker = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    // Assuming timeString is already HH:MM
    return timeString;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Vitals &amp; Interventions</CardTitle>
          <CardDescription>Click buttons to open pop-ups for detailed data entry.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="outline" onClick={openAddVitalsDialog} className="w-full">
            <Activity className="mr-2 h-4 w-4" /> Add Vital Signs Set
          </Button>
          <VitalsEntryDialog
            initialData={editingVital?.data}
            onSave={handleSaveVital}
            dialogOpen={vitalsDialogOpen}
            setDialogOpen={setVitalsDialogOpen}
          />

          <Button variant="outline" onClick={openAddAirwayDialog} className="w-full">
            <Wind className="mr-2 h-4 w-4" /> Add Airway Procedure
          </Button>
          <AirwayProcedureDialog
            initialData={editingAirway?.data}
            onSave={handleSaveAirway}
            dialogOpen={airwayDialogOpen}
            setDialogOpen={setAirwayDialogOpen}
          />

          <Button variant="outline" onClick={openAddBreathingSupportDialog} className="w-full">
            <Zap className="mr-2 h-4 w-4" /> Add Breathing Support
          </Button>
          <BreathingSupportDialog
            initialData={editingBreathingSupport?.data}
            onSave={handleSaveBreathingSupport}
            dialogOpen={breathingSupportDialogOpen}
            setDialogOpen={setBreathingSupportDialogOpen}
          />

          <Button variant="outline" onClick={openAddCardiacDialog} className="w-full">
            <HeartPulse className="mr-2 h-4 w-4" /> Add Cardiac Event
          </Button>
          <CardiacProcedureDialog
            initialData={editingCardiac?.data}
            onSave={handleSaveCardiac}
            dialogOpen={cardiacDialogOpen}
            setDialogOpen={setCardiacDialogOpen}
          />

          <Button variant="outline" onClick={openAddVascularAccessDialog} className="w-full">
            <Droplet className="mr-2 h-4 w-4" /> Add Vascular Access/IO
          </Button>
          <VascularAccessDialog
            initialData={editingVascularAccess?.data}
            onSave={handleSaveVascularAccess}
            dialogOpen={vascularAccessDialogOpen}
            setDialogOpen={setVascularAccessDialogOpen}
          />
          
          <Button variant="outline" onClick={openAddTraumaCareDialog} className="w-full">
            <ShieldAlert className="mr-2 h-4 w-4" /> Add Trauma Care
          </Button>
          <TraumaCareImmobilizationDialog
            initialData={editingTraumaCare?.data}
            onSave={handleSaveTraumaCare}
            dialogOpen={traumaCareDialogOpen}
            setDialogOpen={setTraumaCareDialogOpen}
          />

          <Button variant="outline" onClick={openAddObstetricsNeonatalDialog} className="w-full">
            <Baby className="mr-2 h-4 w-4" /> Add OB/Neonatal Care
          </Button>
          <ObstetricsNeonatalDialog
            initialData={editingObstetricsNeonatal?.data}
            onSave={handleSaveObstetricsNeonatal}
            dialogOpen={obstetricsNeonatalDialogOpen}
            setDialogOpen={setObstetricsNeonatalDialogOpen}
          />

          <Button variant="outline" onClick={openAddMedicationDialog} className="w-full">
            <Syringe className="mr-2 h-4 w-4" /> Add Medication
          </Button>
          <MedicationDialog
            initialData={editingMedication?.data}
            onSave={handleSaveMedication}
            dialogOpen={medicationDialogOpen}
            setDialogOpen={setMedicationDialogOpen}
          />

          <Button variant="outline" onClick={openAddOtherInterventionDialog} className="w-full"> 
            <ShieldQuestion className="mr-2 h-4 w-4" /> Add Other Intervention
          </Button>
          <OtherInterventionDialog
            initialData={editingOtherIntervention?.data}
            onSave={handleSaveOtherIntervention}
            dialogOpen={otherInterventionDialogOpen}
            setDialogOpen={setOtherInterventionDialogOpen}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Intervention &amp; Vitals Summary</CardTitle>
          <CardDescription>Chronological list of all interventions and vital signs. Click to expand vitals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vitals Summary */}
          {vitalsFields.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Vital Signs</h3>
              {vitalsFields.map((item, index) => {
                const vital = item as VitalSignEntry;
                const isExpanded = expandedVital === vital.id;
                return (
                  <div key={vital.id} className="p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpandVital(vital.id)}>
                      <div className="flex-grow space-y-1">
                        <div className="text-sm">
                            <span className="font-medium">Time:</span> {formatVitalTimestamp(vital.timestamp)}
                            {vital.obtainedVitals && <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 border-blue-300">Obtained by me</Badge>}
                        </div>
                        <div className="text-sm">
                          {vital.bloodPressure && <span className="mr-2"><span className="font-medium">BP:</span> {vital.bloodPressure} {vital.bloodPressureMethod && vital.bloodPressureMethod !== 'N/A' ? `(${vital.bloodPressureMethod})` : ''}</span>}
                          {vital.heartRate !== undefined && <span className="mr-2"><span className="font-medium">HR:</span> {vital.heartRate}</span>}
                          {vital.pulseStrengthQuality && vital.pulseStrengthQuality !== 'N/A' && <span className="mr-2"><span className="font-medium">Pulse:</span> {vital.pulseStrengthQuality}</span>}
                        </div>
                        {!isExpanded && (vital.respirationsRate !== undefined || vital.spo2 !== undefined || vital.gcsSnapshotTotal !== undefined) && (
                           <div className="text-xs text-muted-foreground"> RR: {vital.respirationsRate ?? 'N/A'} | SpO2: {vital.spo2 ?? 'N/A'}% | GCS: {vital.gcsSnapshotTotal ?? 'N/A'} | ... click to see all</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditVitalsDialog(index, vital); }} aria-label="Edit Vitals Set"><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeVital(index); }} className="text-destructive hover:text-destructive/80" aria-label="Delete Vitals Set">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={isExpanded ? "Collapse" : "Expand"}>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t text-sm space-y-1">
                        {vital.orthostaticBpPerformed && (
                          <>
                            <div><span className="font-medium">Orthostatic Lying:</span> {vital.orthostaticLyingBpHr || 'N/A'}</div>
                            <div><span className="font-medium">Orthostatic Standing:</span> {vital.orthostaticStandingBpHr || 'N/A'}</div>
                          </>
                        )}
                        <div><span className="font-medium">Respirations:</span> {vital.respirationsRate ?? 'N/A'} breaths/min ({vital.respirationsQuality && vital.respirationsQuality !== 'N/A' ? vital.respirationsQuality : 'N/A'})</div>
                        <div><span className="font-medium">SpO2:</span> {vital.spo2 ?? 'N/A'}%</div>
                        {vital.endTidalCO2 && <div><span className="font-medium">ETCO2:</span> {vital.endTidalCO2} mmHg</div>}
                        {vital.temperature !== undefined && <div><span className="font-medium">Temp:</span> {vital.temperature}°C ({vital.temperatureRoute && vital.temperatureRoute !== 'N/A' ? vital.temperatureRoute : 'N/A'})</div>}
                        <div><span className="font-medium">Pain Scale:</span> {vital.painScale ?? 'N/A'} / 10</div>
                        {vital.bloodGlucoseLevel && <div><span className="font-medium">BGL:</span> {vital.bloodGlucoseLevel} ({vital.bloodGlucoseMethod && vital.bloodGlucoseMethod !== 'N/A' ? vital.bloodGlucoseMethod : 'N/A'})</div>}
                        <div><span className="font-medium">Pupils Left:</span> Size {vital.pupilLeftSize && vital.pupilLeftSize !== 'N/A' ? vital.pupilLeftSize : 'N/A'}, Reaction {vital.pupilLeftReaction && vital.pupilLeftReaction !== 'N/A' ? vital.pupilLeftReaction : 'N/A'}</div>
                        <div><span className="font-medium">Pupils Right:</span> Size {vital.pupilRightSize && vital.pupilRightSize !== 'N/A' ? vital.pupilRightSize : 'N/A'}, Reaction {vital.pupilRightReaction && vital.pupilRightReaction !== 'N/A' ? vital.pupilRightReaction : 'N/A'}</div>
                        {vital.gcsSnapshotTotal !== undefined && <div><span className="font-medium">GCS:</span> {vital.gcsSnapshotTotal} (E{vital.gcsSnapshotEyes || '_'}V{vital.gcsSnapshotVerbal || '_'}M{vital.gcsSnapshotMotor || '_'})</div>}
                        {vital.skinSnapshot && vital.skinSnapshot.length > 0 && <div><span className="font-medium">Skin:</span> {vital.skinSnapshot.join(', ')}</div>}
                        {vital.lungSoundsSnapshot && vital.lungSoundsSnapshot.length > 0 && <div><span className="font-medium">Lungs:</span> {vital.lungSoundsSnapshot.join(', ')}</div>}
                        {vital.isNeonatalForApgar && vital.apgarScore && <div><span className="font-medium">APGAR:</span> {vital.apgarScore}</div>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Airway Procedures Summary */}
          {airwayFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <Wind className="mr-2 h-5 w-5 text-primary" /> Airway Procedures
              </h3>
              {airwayFields.map((item, index) => {
                const airway = item as AirwayProcedureEntry;
                let successStatus = airway.intubationSuccessful || airway.sgaSuccessful || airway.opaSuccessful || airway.npaSuccessful || airway.cricSuccessful || airway.ttjvSuccessful || airway.manualAirwayManoeuvreSuccessful || airway.fingerSweepSuccessful || airway.obstructionClearedSuccessful || airway.rsiSuccessfulIntubationPostRSI || airway.extubationComplications === 'No' ? 'Successful' : airway.extubationComplications === 'Yes' ? 'Complications' : 'N/A';
                 if (airway.procedureName === 'Tracheostomy Tube Change') successStatus = airway.trachChangeSuccessful || 'N/A';
                 
                 let details = `Success: ${successStatus}`;
                 if (airway.opaSize && airway.opaSize !== 'N/A') details += ` | Size: ${airway.opaSize}mm`;
                 else if (airway.npaSize && airway.npaSize !== 'N/A') details += ` | Size: ${airway.npaSize}Fr, Attempts: ${airway.npaAttempts ?? 'N/A'}`;
                 else if (airway.intubationTubeSize && airway.intubationTubeSize !== 'N/A') details += ` | Tube: ${airway.intubationTubeSize}mm, Attempts: ${airway.intubationAttempts ?? 'N/A'}`;
                 else if (['Combitube', 'I-gel', 'KING LT', 'LMA', 'EOA/EGTA'].includes(airway.procedureName || '') && airway.sgaSize && airway.sgaSize !== 'N/A') details += ` | Size: ${airway.sgaSize}, Attempts: ${airway.sgaAttempts ?? 'N/A'}`;
                 else if (airway.cricDeviceTubeSize && airway.cricDeviceTubeSize !== 'N/A') details += ` | Device: ${airway.cricDeviceTubeSize}, Attempts: ${airway.cricAttempts ?? 'N/A'}`;


                return (
                  <div key={airway.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">{airway.procedureName || 'N/A'}</div>
                      {airway.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                      <div className="text-xs text-muted-foreground">
                        {details}
                      </div>
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditAirwayDialog(index, airway)} aria-label="Edit Airway Procedure"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeAirway(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Airway Procedure">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Breathing Support Summary */}
          {breathingSupportFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Breathing Support Procedures
              </h3>
              {breathingSupportFields.map((item, index) => {
                const breathing = item as BreathingSupportEntry;
                let detail = "";
                if (breathing.nasalCannulaFlowRate) detail += `NC Flow: ${breathing.nasalCannulaFlowRate} L/min`;
                else if (breathing.simpleMaskFlowRate) detail += `SM Flow: ${breathing.simpleMaskFlowRate} L/min`;
                else if (breathing.nonRebreatherMaskFlowRate) detail += `NRM Flow: ${breathing.nonRebreatherMaskFlowRate} L/min`;
                else if (breathing.venturiMaskO2Percent && breathing.venturiMaskO2Percent !== 'N/A') detail += `Venturi: ${breathing.venturiMaskO2Percent}`;
                else if (breathing.cpapFiO2) detail += `CPAP FiO2: ${breathing.cpapFiO2}% | PEEP: ${breathing.cpapEpapPeep ?? 'N/A'}cmH2O | Success: ${breathing.cpapImprovedWOB || 'N/A'}`;
                else if (breathing.mechVentMode && breathing.mechVentMode !== 'N/A') detail += `Vent Mode: ${breathing.mechVentMode} | FiO2: ${breathing.mechVentFiO2 ?? 'N/A'}%`;
                else if (breathing.procedureName === 'Chest Decompression (Needle Thoracentesis)') detail += `Site: ${breathing.chestDecompressionSite || 'N/A'} ${breathing.chestDecompressionSide || ''} | Success: ${breathing.chestDecompressionSuccessful || 'N/A'}`;


                return (
                  <div key={breathing.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">{breathing.procedureName || 'N/A'}</div>
                      {breathing.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                      {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditBreathingSupportDialog(index, breathing)} aria-label="Edit Breathing Support Procedure"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeBreathingSupport(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Breathing Support Procedure">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cardiac Procedures Summary */}
          {cardiacFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <HeartPulse className="mr-2 h-5 w-5 text-primary" /> Cardiac Events/Procedures
              </h3>
              {cardiacFields.map((item, index) => {
                const cardiac = item as CardiacProcedureEntry;
                let summaryText = `Rhythm: ${cardiac.rhythm || 'N/A'}`;
                if (cardiac.is12LeadECG) summaryText += ` | 12-Lead: Yes (STEMI: ${cardiac.stemi || 'N/A'})`;
                if (cardiac.procedureName && cardiac.procedureName !== 'N/A') {
                  summaryText += ` | Proc: ${cardiac.procedureName}`;
                  if (cardiac.procedureName === 'Defibrillation') summaryText += ` (#${cardiac.defibNumberOfShocks || 0}, ROSC: ${cardiac.defibRosc || 'N/A'})`;
                  else if (cardiac.procedureName === 'Pacing') summaryText += ` (Capture: ${cardiac.pacingCaptureAchieved || 'N/A'})`;
                  else if (cardiac.procedureName === 'Synchronized Cardioversion') summaryText += ` (Convert: ${cardiac.cardioversionRhythmConversion || 'N/A'})`;
                }

                return (
                  <div key={cardiac.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">
                        Cardiac Event
                        {cardiac.interpretedRhythm && <Badge variant="outline" className="text-xs ml-2 border-blue-500 text-blue-600">Rhythm Interpreted</Badge>}
                        {cardiac.procedureName && cardiac.procedureName !== 'N/A' && cardiac.performedProcedure && <Badge variant="outline" className="text-xs ml-2 border-green-500 text-green-600">Procedure Performed</Badge>}
                      </div>
                       <div className="text-xs text-muted-foreground">{summaryText}</div>
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditCardiacDialog(index, cardiac)} aria-label="Edit Cardiac Event/Procedure"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeCardiac(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Cardiac Event/Procedure">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vascular Access/IO Summary */}
          {vascularAccessFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <Droplet className="mr-2 h-5 w-5 text-primary" /> Vascular Access/IO
              </h3>
              {vascularAccessFields.map((item, index) => {
                const va = item as VascularAccessEntry;
                let details = `${va.procedureType || 'N/A'} at ${va.accessLocation || 'N/A'} (${va.accessSide || 'N/A'})`;
                if (va.procedureType === 'Blood Draw') details += ` | Gauge: ${va.bloodDrawNeedleGauge || 'N/A'}, Success: ${va.bloodDrawSuccessful || 'N/A'}`;
                else if (va.procedureType === 'IO Insertion') details += ` | System: ${va.ioNeedleSystem || 'N/A'}, Success: ${va.ioSuccessful || 'N/A'}`;
                else if (va.procedureType === 'IV Insertion' || va.procedureType === 'IV with blood draw') details += ` | Gauge: ${va.ivCatheterGauge || 'N/A'}, Success: ${va.ivSuccessful || 'N/A'}`;

                return (
                  <div key={va.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                       <div className="text-sm font-medium">{va.procedureType || 'Vascular Access'}</div>
                      {va.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                      <div className="text-xs text-muted-foreground">{details}</div>
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditVascularAccessDialog(index, va)} aria-label="Edit Vascular Access/IO"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeVascularAccess(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Vascular Access/IO">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Trauma Care & Immobilization Summary */}
          {traumaCareFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-primary" /> Trauma Care &amp; Immobilization
              </h3>
              {traumaCareFields.map((item, index) => {
                const trauma = item as TraumaCareImmobilizationEntry;
                let summaryText = `${trauma.procedureCategory || 'N/A'} - ${trauma.procedureName || 'N/A'}`;
                return (
                  <div key={trauma.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">{summaryText}</div>
                      {trauma.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditTraumaCareDialog(index, trauma)} aria-label="Edit Trauma Care"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTraumaCare(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Trauma Care">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Obstetrics/Neonatal Procedures Summary */}
          {obstetricsNeonatalFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <Baby className="mr-2 h-5 w-5 text-primary" /> Obstetrics/Neonatal Care
              </h3>
              {obstetricsNeonatalFields.map((item, index) => {
                const ob = item as ObstetricsNeonatalEntry;
                let summaryText = ob.procedureName || "OB/Neonatal Procedure";
                if (ob.procedureName?.includes("Delivery") && ob.timeOfDelivery) {
                  summaryText += ` at ${formatTimePicker(ob.timeOfDelivery)}`;
                }
                return (
                  <div key={ob.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">{summaryText}</div>
                      {ob.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                      {ob.estimatedBloodLoss && <div className="text-xs text-muted-foreground">EBL: {ob.estimatedBloodLoss}mL</div>}
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditObstetricsNeonatalDialog(index, ob)} aria-label="Edit OB/Neonatal Care"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeObstetricsNeonatal(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete OB/Neonatal Care">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* Medications Administered Summary */}
          {medicationFields.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <Syringe className="mr-2 h-5 w-5 text-primary" /> Medications Administered
              </h3>
              {medicationFields.map((item, index) => {
                const med = item as MedicationEntry;
                let medName = med.medicationName;
                if (med.medicationName === "Other (Specify)" && med.otherMedicationName) {
                  medName = med.otherMedicationName;
                }
                let routeDisplay = med.route;
                if (med.route === "Other" && med.otherRoute) {
                  routeDisplay = med.otherRoute;
                }
                const details = `${medName || 'N/A'} ${med.dose ?? ''}${med.unit || ''} via ${routeDisplay || 'N/A'} at ${formatMedicationTime(med.timeAdministered)}`;

                return (
                  <div key={med.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">
                        {medName || 'Medication N/A'}
                        {med.performedProcedure && <Badge variant="outline" className="text-xs ml-2 border-green-500 text-green-600">Administered by me</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{details}</div>
                      {med.responseToMedication && <div className="text-xs text-muted-foreground italic mt-0.5">Response: {med.responseToMedication}</div>}
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditMedicationDialog(index, med)} aria-label="Edit Medication"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeMed(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Medication">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* Other Intervention Summary (New) */}
          {otherInterventionFields.length > 0 && (
             <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center">
                <ShieldQuestion className="mr-2 h-5 w-5 text-primary" /> Other Interventions
              </h3>
              {otherInterventionFields.map((item, index) => {
                const other = item as OtherInterventionEntry;
                let summaryText = `${other.procedureCategory || 'Category N/A'} - ${other.procedureName || 'Procedure N/A'}`;
                return (
                  <div key={other.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <div className="flex-grow space-y-0.5">
                      <div className="text-sm font-medium">{summaryText}</div>
                      {other.performedProcedure && <Badge variant="outline" className="text-xs border-green-500 text-green-600">Performed by me</Badge>}
                    </div>
                    <div className="space-x-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditOtherInterventionDialog(index, other)} aria-label="Edit Other Intervention"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeOther(index)} className="text-destructive hover:text-destructive/80" aria-label="Delete Other Intervention">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {vitalsFields.length === 0 &&
           airwayFields.length === 0 &&
           breathingSupportFields.length === 0 &&
           cardiacFields.length === 0 &&
           vascularAccessFields.length === 0 &&
           traumaCareFields.length === 0 &&
           obstetricsNeonatalFields.length === 0 &&
           medicationFields.length === 0 &&
           otherInterventionFields.length === 0 && (
             <div className="text-muted-foreground text-center py-4">No vitals or interventions recorded yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
