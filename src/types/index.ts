// src/types/index.ts
export type TimestampValue = Date | string | null;

export interface PatientCareFormData {
  // Patient Assessment Tab - Call Information
  teamLeaderIndicator?: boolean;
  preceptorName?: string;
  teamSize?: number;
  responseMode?: string; 
  patientDisposition?: string; 
  transportModeFromScene?: string; 

  // Patient Assessment Tab - Patient Details / Demographics
  patientInterview?: boolean;
  patientExam?: boolean;
  age?: number;
  ageUnit?: 'Years' | 'Months' | 'Days' | 'N/A';
  sex?: 'Male' | 'Female' | 'Other' | 'Unknown' | 'N/A';
  ethnicity?: string; 
  
  // Patient Assessment Tab - History & Complaints
  complaints?: string[]; 

  // Patient Assessment Tab - Clinical Assessment
  patientAlertOriented?: string; 
  gcsEyes?: string; 
  gcsVerbal?: string; 
  gcsMotor?: string; 
  gcsTotal?: number;
  pupilsEqual?: 'N/A' | 'Yes' | 'No';
  pupilsRound?: 'N/A' | 'Yes' | 'No';
  pupilsReactive?: 'N/A' | 'Yes' | 'No';
  skinCondition?: string[];
  lungSounds?: string[];
  airwayAssessmentNotes?: string;
  airwayManagementRequired?: boolean;
  airwayManagementOutcome?: "did not manage" | "successfully managed" | "did not successfully manage" | "N/A";
  
  // Patient Assessment Tab - Specific Assessments
  cSpineCleared?: boolean;
  cSpineClearanceNotes?: string;
  anteNatalExamPerformed?: boolean;
  anteNatalFindings?: string;
  postNatalExamPerformed?: boolean;
  postNatalFindings?: string;

  // Primary Impression
  primaryImpressionCondition?: string; 
  primaryImpressionCardiacArrestWitnessedBy?: string; 
  primaryImpressionCardiacArrestReturnOfPulse?: string; 
  primaryImpressionTraumaMechanism?: string[]; 
  primaryImpressionTraumaCause?: string; 
  primaryImpressionTraumaIntent?: string; 
  primaryPatientCriticality?: string; 

  // Secondary Impression
  secondaryImpressionCondition?: string;
  secondaryImpressionCardiacArrestWitnessedBy?: string;
  secondaryImpressionCardiacArrestReturnOfPulse?: string;
  secondaryImpressionTraumaMechanism?: string[];
  secondaryImpressionTraumaCause?: string;
  secondaryImpressionTraumaIntent?: string;
  secondaryPatientCriticality?: string;

  // Vitals & Interventions Tab
  vitals?: VitalSignEntry[];
  airwayProcedures?: AirwayProcedureEntry[];
  breathingSupportProcedures?: BreathingSupportEntry[];
  cardiacProcedures?: CardiacProcedureEntry[];
  vascularAccessProcedures?: VascularAccessEntry[];
  traumaCareProcedures?: TraumaCareImmobilizationEntry[];
  obstetricsNeonatalProcedures?: ObstetricsNeonatalEntry[];
  otherInterventions?: OtherInterventionEntry[];
  medicationsAdministered?: MedicationEntry[];

  // Narrative Tab
  casePresentation?: string;
  patientAssessmentNarrative?: string;
  studentReflection?: string;
  instructorFeedback?: string; 

  // Metadata
  id?: string;
  shiftId: string; // Required - every encounter must be associated with a shift
  studentId: string; // Required - every encounter must be associated with a student
  encounterNumber?: number; // Sequential number within the shift
  isDraft?: boolean;
  isSubmitted?: boolean;
  submittedAt?: Date; // Client-side date for initial submission display
  submittedAtTimestamp?: TimestampValue;
  reviewStatus?: 'NotReviewed' | 'InProgress' | 'Reviewed';
  reviewedByInstructorId?: string;
  reviewedAtTimestamp?: TimestampValue;
  createdAt?: TimestampValue;
  updatedAt?: TimestampValue;
}

export interface VitalSignEntry {
  id: string;
  timestamp: string; 
  obtainedVitals?: boolean;
  
  // Cardiovascular
  bloodPressure?: string; 
  bloodPressureMethod?: 'Manual' | 'NIBP (Auto Cuff)' | 'Palpation' | 'Doppler' | 'Arterial Line' | 'N/A';
  heartRate?: number;
  pulseStrengthQuality?: 'Absent' | 'Irregular Strong' | 'Irregular Weak' | 'Regular Strong' | 'Regular Weak' | 'Thready' | 'Bounding' | 'N/A';
  orthostaticBpPerformed?: boolean;
  orthostaticLyingBpHr?: string;
  orthostaticStandingBpHr?: string;
  
  // Respiratory
  respirationsRate?: number;
  respirationsQuality?: 'Normal' | 'Shallow' | 'Deep' | 'Labored' | 'Gasping' | 'Kussmaul' | 'Cheyne-Stokes' | 'Apneic' | 'Other' | 'N/A';
  spo2?: number;
  endTidalCO2?: string; 
  
  // Neurological
  painScale?: number; 
  pupilLeftSize?: '1mm' | '2mm' | '3mm' | '4mm' | '5mm' | '6mm' | '7mm' | '8mm' | 'Pinpoint' | 'Midpoint' | 'Dilated' | 'N/A';
  pupilLeftReaction?: 'Brisk' | 'Sluggish' | 'Fixed' | 'N/A';
  pupilRightSize?: '1mm' | '2mm' | '3mm' | '4mm' | '5mm' | '6mm' | '7mm' | '8mm' | 'Pinpoint' | 'Midpoint' | 'Dilated' | 'N/A';
  pupilRightReaction?: 'Brisk' | 'Sluggish' | 'Fixed' | 'N/A';
  gcsSnapshotEyes?: string;
  gcsSnapshotVerbal?: string;
  gcsSnapshotMotor?: string;
  gcsSnapshotTotal?: number;

  // Other
  skinSnapshot?: string[]; 
  lungSoundsSnapshot?: string[]; 
  temperature?: number;
  temperatureRoute?: 'Oral' | 'Axillary' | 'Tympanic' | 'Rectal' | 'Oesophageal' | 'Skin' | 'Temporal Artery' | 'Forehead (Skin)' | 'Core (Other)' | 'N/A';
  bloodGlucoseLevel?: string; 
  bloodGlucoseMethod?: 'Glucometer' | 'Visual Strip' | 'Lab Value (Reported)' | 'N/A';
  isNeonatalForApgar?: boolean; 
  apgarScore?: string; 
}

export interface AirwayProcedureEntry {
  id: string;
  performedProcedure?: boolean;
  procedureName?: string;

  // Basic Airway Management
  manualAirwayManoeuvreSuccessful?: 'Yes' | 'No' | 'N/A';
  fingerSweepSuccessful?: 'Yes' | 'No' | 'N/A';
  obstructionClearedSuccessful?: 'Yes' | 'No' | 'N/A';
  opaSize?: string;
  opaSuccessful?: 'Yes' | 'No' | 'N/A';
  npaSize?: string;
  npaAttempts?: number;
  npaSuccessful?: 'Yes' | 'No' | 'N/A';

  // Suctioning
  suctionOropharynxNasopharynxClearAirway?: 'Yes' | 'No' | 'N/A';
  suctionEttTrachClearAirway?: 'Yes' | 'No' | 'N/A';
  suctionSgaClearAirway?: 'Yes' | 'No' | 'N/A';

  // Ventilation
  bvmRate?: number;
  bvmEstimatedTidalVolume?: number;
  bvmAdequateChestRise?: 'Yes' | 'No' | 'N/A';

  // Supraglottic Airways (SGA)
  sgaType?: 'Combitube' | 'I-gel' | 'KING LT' | 'LMA' | 'EOA/EGTA'; 
  sgaSize?: string;
  sgaAttempts?: number;
  sgaSuccessful?: 'Yes' | 'No' | 'N/A';
  sgaConfirmationMethod?: string;

  // Intubation
  intubationType?: 'Orotracheal' | 'Nasotracheal' | 'Digital ET'; 
  intubationTubeSize?: string;
  intubationDepthAtLipsTeeth?: number;
  intubationDepthAtNares?: number;
  intubationDigitalDepth?: number;
  intubationAttempts?: number;
  intubationSuccessful?: 'Yes' | 'No' | 'N/A';
  intubationCuffInflated?: 'Yes' | 'No' | 'N/A';
  intubationVALUsed?: boolean;
  intubationVALBladeTypeSize?: string;
  intubationBougieUsed?: boolean;
  
  // Advanced Airway Procedures
  rsiSuccessfulIntubationPostRSI?: 'Yes' | 'No' | 'N/A';
  cricDeviceTubeSize?: string;
  cricCustomSizeDescription?: string;
  cricAttempts?: number;
  cricSuccessful?: 'Yes' | 'No' | 'N/A';
  cricConfirmationMethod?: string;
  ttjvCatheterGauge?: string;
  ttjvOtherGauge?: string;
  ttjvSuccessful?: 'Yes' | 'No' | 'N/A';
  
  // Confirmation & Management 
  intubationConfirmationMethods?: string[]; 
  intubationCo2DetectorResult?: string; 
  intubationEtco2Value?: number; 
  intubationEsophagealBulbResult?: string; 

  // Extubation
  extubationReason?: string;
  extubationComplications?: 'Yes' | 'No' | 'N/A';
  extubationComplicationNotes?: string;

  // Tracheostomy Tube Change
  trachOldTubeSizeAndType?: string;
  trachNewTubeSizeAndType?: string;
  trachChangeSuccessful?: 'Yes' | 'No' | 'N/A';
}

export interface BreathingSupportEntry {
  id: string;
  performedProcedure?: boolean;
  procedureName?: string; 

  // Oxygen Administration
  nasalCannulaFlowRate?: number; 
  simpleMaskFlowRate?: number; 
  nonRebreatherMaskFlowRate?: number; 
  venturiMaskO2Percent?: string; 

  // Advanced Breathing Support
  nebulizerDuration?: number; 
  nebulizerDrivingGas?: 'Oxygen' | 'Air' | 'N/A';
  nebulizerFlowRate?: number; 

  cpapMaskSize?: string;
  cpapIpstPressure?: number; 
  cpapEpapPeep?: number; 
  cpapFiO2?: number; 
  cpapImprovedWOB?: 'Yes' | 'No' | 'N/A';

  manualNivDevicePeepValveSetting?: number; 

  mechVentMode?: string;
  mechVentFiO2?: number; 
  mechVentPeep?: number; 
  mechVentRespiratoryRate?: number; 
  mechVentTidalVolumeValue?: number;
  mechVentTidalVolumeUnit?: 'mL' | 'mL/kg' | 'N/A';
  mechVentInspiratoryTime?: number; 

  peepManualBvmLevel?: string; 
  peepManualBvmOtherValue?: number; 

  rescueBreathingRate?: number; 

  // Emergency Breathing Procedures
  chestDecompressionNeedleGauge?: string; 
  chestDecompressionOtherNeedleGauge?: string;
  chestDecompressionCatheterLength?: string; 
  chestDecompressionOtherCatheterLength?: string;
  chestDecompressionSite?: string; 
  chestDecompressionOtherSite?: string;
  chestDecompressionSide?: 'Left' | 'Right' | 'N/A';
  chestDecompressionAttempts?: number;
  chestDecompressionSuccessful?: 'Yes' | 'No' | 'N/A';

  chestTubeDrainageSystem?: 'Water Seal' | 'Suction' | 'N/A';
  chestTubeSuctionLevel?: number; 
  chestTubeOutputThisEncounter?: number; 
  chestTubeAirLeakPresent?: 'Yes' | 'No' | 'N/A';

  peakFlowPreTreatmentValue?: number; 
  peakFlowPostTreatmentValue?: number; 
}

export interface CardiacProcedureEntry {
  id: string;
  // Rhythm Assessment Section
  interpretedRhythm?: boolean;
  rhythm?: string; 
  rhythmAttributes?: string[]; 
  is12LeadECG?: boolean;
  ecgInterpretationSummary?: string; 
  stemi?: 'Yes' | 'No' | 'N/A'; 
  stemiLocation?: string; 

  // Cardiac Procedures Section
  performedProcedure?: boolean; 
  procedureName?: string; 

  // Conditional fields based on procedureName
  carotidSinusMassageSuccessful?: 'Yes' | 'No' | 'N/A';

  chestCompressionMethod?: 'Automated CPR Device' | 'Manual' | 'N/A';
  chestCompressionDeviceUsed?: string; 
  chestCompressionFractionGoalMet?: 'Yes' | 'No' | 'Not Monitored' | 'N/A';

  defibMethod?: 'Automated (AED)' | 'Manual' | 'N/A';
  defibNumberOfShocks?: number;
  defibEnergyLevels?: string; 
  defibRosc?: 'No ROSC' | 'Brief ROSC' | 'Sustained ROSC' | 'N/A';

  pacingMethod?: 'External/Transcutaneous' | 'Transvenous (existing)' | 'N/A';
  pacingRate?: number; 
  pacingCurrent?: number; 
  pacingCaptureAchieved?: 'Yes' | 'No' | 'N/A';
  pacingHemodynamicImprovement?: 'Yes' | 'No' | 'N/A';

  cardioversionAttempts?: number;
  cardioversionEnergyLevels?: string; 
  cardioversionRhythmConversion?: 'Yes' | 'No' | 'N/A';

  valsalvaSuccessful?: 'Yes' | 'No' | 'N/A';

  precordialThumpSuccessful?: 'Yes' | 'No' | 'N/A';
}


export interface VascularAccessEntry {
  id: string;
  performedProcedure?: boolean; 
  accessLocation?: string;
  accessSide?: 'Left' | 'Right' | 'Midline' | 'N/A';
  otherAccessLocation?: string;
  fluidType?: string;
  otherFluidType?: string;
  procedureType?: string; 

  // Conditional for "Blood Draw"
  bloodDrawNeedleGauge?: string;
  bloodDrawAttempts?: number;
  bloodDrawSuccessful?: 'Yes' | 'No' | 'N/A';

  // Conditional for "IO Insertion"
  ioNeedleSystem?: string;
  ioManualOtherSpecification?: string;
  ioAttempts?: number;
  ioSuccessful?: 'Yes' | 'No' | 'N/A'; 

  // Conditional for "IV Insertion" or "IV with blood draw"
  ivCatheterGauge?: string;
  ivAttempts?: number;
  ivSuccessful?: 'Yes' | 'No' | 'N/A'; 
  
  // Additional Options (Checkboxes)
  useOfManualPressureInfuser?: boolean;
  setupMonitorInfusionPump?: boolean;
  setupMonitorSyringeDriver?: boolean;
}

export interface TraumaCareImmobilizationEntry {
  id: string;
  performedProcedure?: boolean;
  procedureCategory?: string; 
  procedureName?: string; 

  // Spinal Immobilization
  cCollarSize?: string;
  cCollarOtherSize?: string;
  cCollarSuccessfulFit?: 'Yes' | 'No' | 'N/A';
  spinalImmobilizationSuccessfulApplication?: 'Yes' | 'No' | 'N/A'; 

  // Limb Immobilization
  limbBasicSplintType?: string; 
  limbSplintSuccessfulImmobilization?: 'Yes' | 'No' | 'N/A'; 
  limbTractionSplintType?: string;
  limbTractionSplintOtherType?: string;
  limbTractionSplintSuccessfulApplication?: 'Yes' | 'No' | 'N/A'; 

  // Hemorrhage Control
  hemorrhageDressingType?: string; 
  hemorrhageBleedingControlled?: 'Yes' | 'No' | 'N/A'; 
  tourniquetType?: string;
  tourniquetOtherType?: string;
  tourniquetLocation?: string;
  tourniquetTimeApplied?: string; 
  tourniquetNumberOnLimb?: number;
  tourniquetSuccessfulHemorrhageControl?: 'Yes' | 'No' | 'N/A';
  hemostaticAgentType?: string;
  hemostaticAgentOtherType?: string;
  hemostaticAgentSuccessfulHemorrhageControl?: 'Yes' | 'No' | 'N/A';
  pasgCompartmentsInflated?: string[]; 
  pasgPressureLeftLeg?: number;
  pasgPressureRightLeg?: number;
  pasgPressureAbdomen?: number;
  pasgBpResponse?: 'Yes' | 'No' | 'N/A';
  nonPasgBpResponse?: 'Yes' | 'No' | 'N/A';

  // Other Trauma Care
  pelvicDeviceType?: string;
  pelvicDeviceOtherType?: string;
  pelvicDeviceSuccessfulApplication?: 'Yes' | 'No' | 'N/A';
  impaledObjectStabilizationMethod?: string;
  extricationDuration?: number; 
  extricationMethodTools?: string;
}

export interface ObstetricsNeonatalEntry {
  id: string;
  performedProcedure?: boolean;
  procedureName?: string; 

  // Fields for Delivery Procedures
  timeOfDelivery?: string; 
  infantGender?: 'Male' | 'Female' | 'Indeterminate' | 'N/A';
  abnormalDeliveryComplicationType?: string; 

  // Fields for Obstetric Procedures
  prolapsedCordPulsationsMaintained?: 'Yes' | 'No' | 'N/A'; 
  uterineTonePostMassage?: 'Firm' | 'Boggy' | 'N/A'; 

  // Fields for Neonatal Procedures
  incubatorTemperatureSetting?: number; 
  incubatorTemperatureUnit?: '°C' | '°F' | 'N/A'; 

  // Shared "Delivery Details" 
  placentaDelivered?: 'Yes' | 'No' | 'N/A';
  timeOfPlacentaDelivery?: string; 
  placentaIntact?: 'Yes' | 'No' | 'Uncertain' | 'N/A'; 
  estimatedBloodLoss?: number; 
  deliveryComplications?: string; 
}


export interface OtherInterventionEntry {
  id: string;
  performedProcedure?: boolean;
  procedureCategory?: string; 
  procedureName?: string; 

  // Tubes and Catheters
  ngTubeSize?: string;
  ngOtherSize?: string;
  ngPlacementConfirmedBy?: string;
  ngSuccessfulInsertion?: 'Yes' | 'No' | 'N/A';

  urinaryCatheterSize?: string;
  urinaryCatheterOtherSize?: string;
  urinaryCatheterType?: string;
  urinaryCatheterBalloonVolume?: number;
  urinaryCatheterUrineReturn?: 'Yes' | 'No' | 'N/A';

  // Safety and Protection
  decontaminationMethod?: string;
  decontaminationAgent?: string;

  restraintType?: string;
  restraintOtherType?: string;
  restraintReason?: string;
  restraintNeurovascularChecks?: 'Yes' | 'No' | 'N/A';

  // Cardiac and Stroke Management
  thrombolyticScreenResult?: string;

  // Wound Management
  sutureNumber?: number;
  sutureMaterialSizeType?: string;
  sutureLocation?: string;

  morganLensEye?: 'Left' | 'Right' | 'Both' | 'N/A';
  morganLensIrrigatingFluid?: string;
  morganLensDuration?: number; 

  eyeIrrigationOtherMethodFluid?: string;
  eyeIrrigationOtherMethodVolume?: number; 
  eyeIrrigationOtherMethodDuration?: number; 

  // Advanced Procedures
  dopplerUltrasoundProbeType?: string;
  dopplerUltrasoundAreaScanned?: string;
  dopplerUltrasoundFindings?: string;

  pericardiocentesisNeedleGaugeLength?: string;
  pericardiocentesisFluidAmount?: number; 
  pericardiocentesisHemodynamicImprovement?: 'Yes' | 'No' | 'N/A';

  fieldAmputationMethod?: string;
  fieldAmputationTimeCompleted?: string; 

  icePackLocation?: string;

  ttmMethod?: string;
  ttmTargetTemperature?: number;
  ttmUnit?: '°C' | '°F' | 'N/A';

  abgSite?: string;
  abgAttempts?: number;
  abgSuccessful?: 'Yes' | 'No' | 'N/A';

  invasiveMonitoringDeviceType?: string;
}


export interface MedicationEntry {
  id: string;
  performedProcedure?: boolean;
  medicationName?: string; 
  otherMedicationName?: string; 
  dose?: number;
  unit?: string; 
  route?: string; 
  otherRoute?: string; 
  timeAdministered?: string; // ISO string for datetime-local
  responseToMedication?: string; 
}


export interface Skill { 
  id: string;
  name: string;
  category: string;
  attemptsRequired?: number;
  successfulAttempts?: number;
  verificationStatus?: 'Pending' | 'Verified' | 'Rejected';
  confidenceLevel?: 'Not Confident' | 'Developing' | 'Competent' | 'Proficient';
  lastPerformed?: Date;
}

export interface UserProfile {
  id: string; // Firebase Auth UID
  fullName: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Administrator';
  createdAt: TimestampValue;
  approved?: boolean; // For instructor/admin approval flow
  avatar?: string; // Optional avatar URL
}

export interface Shift {
  id: string; 
  title: string;
  date: string; // Store as ISO string YYYY-MM-DD for Firestore compatibility
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  type: 'Clinical' | 'Field' | 'Lab' | 'Other' | string;
  location: string;
  instructorId: string; 
  capacity: number;
  bookedCount: number; 
  notes?: string;
  reviewStatus?: 'Pending' | 'InProgress' | 'Completed';
  instructorNotes?: string;
  reviewedAt?: TimestampValue;
  createdAt: TimestampValue;
  updatedAt: TimestampValue;
}

export interface ShiftFeedback {
  id: string;
  shiftId: string;
  instructorId: string;
  studentId: string; // REQUIRED: Each feedback is for a specific student on a shift
  overallFeedback: string; // REQUIRED: Main feedback text for the student's shift performance
  performanceRating?: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  areasOfStrength?: string;
  areasForImprovement?: string;
  createdAt: TimestampValue;// Firestore server timestamp
  updatedAt: TimestampValue;// Firestore server timestamp
}

export type ShiftBookingStatus = 'Booked' | 'CancelledByStudent' | 'CancelledByInstructor' | 'Attended' | 'Reviewed' | 'NoShow' | 'PendingApproval';

export interface ShiftBooking {
  id: string; // Firestore document ID for the booking itself
  shiftId: string; // ID of the Shift document
  studentId: string; // UID of the student
  bookingTimestamp: TimestampValue;
  status: ShiftBookingStatus;
  updatedAt?: TimestampValue;
  // Optionally, cancellationReason, attendedTimestamp, etc.
}

export interface FirestoreShift {
  id: string;
  title: string;
  date: TimestampValue;
  startTime: TimestampValue;
  endTime: TimestampValue;
  type: string;
  location: string;
  capacity: number;
  notes: string;
  instructorId: string;
  bookedCount: number;
  createdAt: TimestampValue;// Firestore Timestamp
  updatedAt: TimestampValue;// Firestore Timestamp
}

export interface ClientShift {
  id: string;
  title: string;
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: string;
  location: string;
  capacity: number;
  notes: string;
  instructorId: string;
  bookedCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Utility function to transform timestamp-like values to ISO string
export function timestampToISO(timestamp: any): string {
  if (!timestamp) return '';
  
  // If it's already a string, return it
  if (typeof timestamp === 'string') return timestamp;
  
  // If it's an object with a toDate() function
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  // If it's a Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // If it's a number (timestamp)
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toISOString();
  }
  
  return '';
}

// Utility function to transform Firestore document to client-safe object
export function transformShiftToClient(shift: FirestoreShift): ClientShift {
  return {
    ...shift,
    date: timestampToISO(shift.date),
    startTime: timestampToISO(shift.startTime),
    endTime: timestampToISO(shift.endTime),
    createdAt: timestampToISO(shift.createdAt),
    updatedAt: timestampToISO(shift.updatedAt),
  };
}

// Utility function to transform array of Firestore documents
export function transformShiftsToClient(shifts: FirestoreShift[]): ClientShift[] {
  return shifts.map(transformShiftToClient);
}
