// src/components/forms/patient-care-form/patient-care-form-constants.ts

export const medicalConditionsOptions = [
  "N/A",
  "Abdominal pain/problems",
  "Allergic Reaction/Anaphylaxis",
  "Altered Mental State",
  "Behavioral/Psychiatric",
  "Burns",
  "Cardiac conditions (Acute Coronary Syndrome)",
  "Cardiac conditions (Arrest)",
  "Cardiac conditions (Other)",
  "Diabetic symptoms (Hyperglycemia)",
  "Diabetic symptoms (Hypoglycemia)",
  "Electrocution/Lightning Strike",
  "Environmental (Heat Exposure)",
  "Environmental (Cold Exposure)",
  "GI Bleed",
  "Neurological (Seizure)",
  "Neurological (Stroke/CVA)",
  "Neurological (TIA)",
  "Neurological (Other)",
  "Obstetric/Gynaecology (Childbirth - Imminent)",
  "Obstetric/Gynaecology (Childbirth - Normal)",
  "Obstetric/Gynaecology (Ectopic Pregnancy)",
  "Obstetric/Gynaecology (Miscarriage)",
  "Obstetric/Gynaecology (Other)",
  "Overdose/Poisoning",
  "Pain Management",
  "Respiratory (Asthma)",
  "Respiratory (COPD)",
  "Respiratory (Distress - Other)",
  "Sepsis",
  "Shock (Cardiogenic)",
  "Shock (Hypovolemic)",
  "Shock (Neurogenic)",
  "Shock (Septic)",
  "Shock (Anaphylactic)",
  "Syncope/Near Syncope",
  "Trauma (Abdominal)",
  "Trauma (Chest)",
  "Trauma (Extremities)",
  "Trauma (Head)",
  "Trauma (Multisystems)",
  "Trauma (Neck/Spine)",
  "Trauma (Soft Tissue)",
  "Weakness/Malaise",
  "Other",
  "Unknown",
];

export const arrestWitnessedByOptions = [
  { value: "N/A", label: "N/A" },
  { value: "Healthcare provider", label: "Healthcare provider" },
  { value: "Lay person", label: "Lay person" },
  { value: "Unknown", label: "Unknown" },
];

export const returnOfPulseOptions = [
  { value: "N/A", label: "N/A" },
  { value: "Brief ROSC", label: "Brief ROSC" },
  { value: "Sustained ROSC", label: "Sustained ROSC" },
  { value: "No Return (Remained in Asystole/PEA)", label: "No Return (Remained in Asystole/PEA)" },
  { value: "Unknown", label: "Unknown" },
];

export const mechanismOfInjuryOptions = [
  { id: "blunt", label: "Blunt" },
  { id: "burn_thermal", label: "Burn (Thermal)" },
  { id: "burn_chemical", label: "Burn (Chemical)" },
  { id: "burn_electrical", label: "Burn (Electrical)" },
  { id: "penetrating_stab", label: "Penetrating (Stab)" },
  { id: "penetrating_gunshot", label: "Penetrating (Gunshot)" },
  { id: "crush", label: "Crush" },
  { id: "fall_height", label: "Fall (from height)" },
  { id: "fall_same_level", label: "Fall (same level)" },
  { id: "mvc_driver", label: "Motor Vehicle Collision (Driver)" },
  { id: "mvc_passenger", label: "Motor Vehicle Collision (Passenger)" },
  { id: "mvc_pedestrian", label: "Motor Vehicle Collision (Pedestrian)" },
  { id: "mvc_motorcyclist", label: "Motor Vehicle Collision (Motorcyclist)" },
  { id: "mvc_cyclist", label: "Motor Vehicle Collision (Cyclist)" },
  { id: "other", label: "Other" },
  { id: "unknown", label: "Unknown" },
];

export const causeOfInjuryOptions = [
  "N/A",
  "Motor vehicle accident",
  "Fall",
  "Assault (Physical)",
  "Assault (Sexual)",
  "Gunshot wound",
  "Stabbing",
  "Industrial accident",
  "Recreational accident",
  "Burns (Fire)",
  "Burns (Scald)",
  "Burns (Chemical)",
  "Burns (Electrical)",
  "Explosion",
  "Sports injury",
  "Animal bite/sting",
  "Drowning/Submersion",
  "Suffocation/Asphyxiation",
  "Other",
  "Unknown",
];

export const intentOfInjuryOptions = [
  { value: "N/A", label: "N/A" },
  { value: "Unintentional/Accidental", label: "Unintentional/Accidental" },
  { value: "Self-inflicted (Suicidal)", label: "Self-inflicted (Suicidal)" },
  { value: "Self-inflicted (Non-suicidal)", label: "Self-inflicted (Non-suicidal)" },
  { value: "Assault (Homicidal)", label: "Assault (Homicidal)" },
  { value: "Assault (Non-homicidal)", label: "Assault (Non-homicidal)" },
  { value: "Legal Intervention", label: "Legal Intervention" },
  { value: "Undetermined", label: "Undetermined" },
];

export const patientCriticalityOptions = [
  { value: "N/A", label: "N/A" },
  { value: "Green", label: "Green - not critical, ambulatory" },
  { value: "Yellow", label: "Yellow - illness/injuries not yet life-threatening" },
  { value: "Red", label: "Red - critical, life-threatening illness/injury" },
  { value: "Black", label: "Black - patient dead on arrival" },
];

export const responseModeOptions = [
  "N/A", 
  "Initial lights & sirens, downgraded to no lights or sirens", 
  "Initial no lights or sirens, upgraded to lights & sirens", 
  "Lights & sirens", 
  "No lights or sirens"
];
export const dispositions = ["N/A", "Cancelled", "Dead at scene", "No patient found", "No treatment required", "Refused treatment", "Treated and refused transport", "Treated and released", "Treated and transferred care", "Treated, transported"];
export const transportModes = ["N/A", "Initial lights & sirens, downgraded to no lights or sirens", "Initial no lights or sirens, upgraded to lights & sirens", "Lights & sirens", "No lights or sirens"];

export const ageUnitOptions = ["N/A", "Years", "Months", "Days"];
export const sexOptions = ["N/A", "Male", "Female", "Other", "Unknown"]; 
export const ethnicities = ["N/A", "African", "Coloured", "Indian", "White", "Other", "Unknown"];

export const alertOrientedOptions = [
    { value: "N/A", label: "N/A" },
    { value: "Alert", label: "Alert - reacts to environmental stimuli"},
    { value: "Voice", label: "Voice responsive - reacts to verbal stimuli"},
    { value: "Pain", label: "Pain responsive - reacts to painful stimuli"},
    { value: "Unresponsive", label: "Unresponsive to verbal or painful stimuli"},
];

export const complaintsOptions = [
  "N/A",
  "Abdominal pain/problems", 
  "Allergic Reaction", 
  "Altered Mental State", 
  "Behavioral/Psychiatric", 
  "Burns", 
  "Cardiac conditions", 
  "Diabetic symptoms", 
  "Trauma", 
  "Respiratory Distress", 
  "Seizures", 
  "Stroke", 
  "Syncope", 
  "Weakness", 
  "Other",
];

export const gcsEyesOptions = [
  { label: "4 - Spontaneous", value: "4" },
  { label: "3 - To Voice", value: "3" },
  { label: "2 - To Pain", value: "2" },
  { label: "1 - None", value: "1" },
];
export const gcsVerbalOptions = [
  { label: "5 - Oriented", value: "5" },
  { label: "4 - Confused", value: "4" },
  { label: "3 - Inappropriate Words", value: "3" },
  { label: "2 - Incomprehensible Sounds", value: "2" },
  { label: "1 - None", value: "1" },
];
export const gcsMotorOptions = [
  { label: "6 - Obeys Commands", value: "6" },
  { label: "5 - Localizes Pain", value: "5" },
  { label: "4 - Withdraws from Pain", value: "4" },
  { label: "3 - Flexion to Pain (Decorticate)", value: "3" },
  { label: "2 - Extension to Pain (Decerebrate)", value: "2" },
  { label: "1 - None", value: "1" },
];

export const pupilStateOptions: { label: string; value: 'Yes' | 'No' | 'N/A' }[] = [ 
  { value: "N/A", label: "N/A" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const skinConditionOptions = [ 
  "N/A", "Clammy", "Cold", "Cyanotic", "Diaphoretic", "Dry", "Flushed", 
  "Hot", "Jaundiced", "Lividity", "Mottled", "Normal", "Pale", "Warm", "Other"
];

export const lungSoundsOptions = [ 
  "N/A", "Absent", "Clear", "Crackles (Coarse)", "Crackles (Fine)", "Crowing", 
  "Distant", "Gurgling", "Normal Vesicular", "Rhonchi", "Snoring", 
  "Stridor", "Wheezing", "Bronchovesicular", "Other"
];

// Vitals Specific Options
export const pulseStrengthOptions = [
  "N/A", "Absent", "Irregular Strong", "Irregular Weak", "Regular Strong", "Regular Weak", "Thready", "Bounding"
];

export const bloodPressureMethodOptions = [
  "N/A", "Manual", "NIBP (Auto Cuff)", "Palpation", "Doppler", "Arterial Line"
];

export const pupilSizeOptions = [ 
  "N/A", "1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "7mm", "8mm", "Pinpoint", "Midpoint", "Dilated"
];

export const pupilReactionOptions = [ 
  "N/A", "Brisk", "Sluggish", "Fixed"
];

export const respirationsQualityOptions = [
  "N/A", "Normal", "Shallow", "Deep", "Labored", "Gasping", "Kussmaul", "Cheyne-Stokes", "Apneic", "Other"
];

export const temperatureRouteOptions = [
  "N/A", "Oral", "Axillary", "Tympanic", "Rectal", "Oesophageal", "Skin", "Temporal Artery", "Forehead (Skin)", "Core (Other)"
];

export const bloodGlucoseMethodOptions = [
  "N/A", "Glucometer", "Visual Strip", "Lab Value (Reported)"
];

// General Reusable Options
export const yesNoOptions: { label: string; value: 'Yes' | 'No' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const yesNoNaOptions: { label: string; value: 'Yes' | 'No' | 'N/A' }[] = [ 
  { label: "N/A", value: "N/A" },
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];


// Intervention Specific Options - Airway
export const airwayProcedureNameOptions = [
  "N/A",
  "Manual Airway Manoeuvre",
  "Finger Sweep",
  "Obstruction Cleared (Heimlich or other)",
  "Oropharyngeal Airway (OPA)",
  "Nasopharyngeal Airway (NPA)",
  "Suctioning: Oropharynx/Nasopharynx",
  "Suctioning: ETT/Trach",
  "Suctioning: SGA",
  "Bag-valve-mask/tube Ventilation",
  "Combitube", 
  "I-gel", 
  "KING LT", 
  "LMA", 
  "EOA/EGTA", 
  "Orotracheal Intubation",
  "Nasotracheal Intubation",
  "Digital ET Intubation",
  "Rapid Sequence Induction (RSI)",
  "Cricothyrotomy",
  "Transtracheal Jet Ventilation",
  "Extubation", 
  "Tracheostomy Tube Change", 
];


export const opaSizeOptions = ["N/A", "40", "50", "60", "70", "80", "90", "100", "110"]; 
export const npaSizeOptions = ["N/A", "20", "22", "24", "26", "28", "30", "32", "34", "36"]; 

export const sgaCombitubeSizeOptions = ["N/A", "37Fr Small Adult", "41Fr Adult"];
export const sgaIgelSizeOptions = ["N/A", "1", "1.5", "2", "2.5", "3", "4", "5"];
export const sgaKingLTSizeOptions = ["N/A", "0", "1", "2", "2.5", "3", "4", "5"];
export const sgaLmaSizeOptions = ["N/A", "1", "1.5", "2", "2.5", "3", "4", "5"];

export const intubationTubeSizeOptions = [
  "N/A", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", 
  "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"
]; 

export const cricDeviceTubeSizeOptions = [
  "N/A", 
  "5.0mm ID Cuffed", 
  "6.0mm ID Cuffed", 
  "Commercial Kit (specify below)", 
  "Needle Cric (specify gauge below)"
];
export const ttjvCatheterGaugeOptions = ["N/A", "14", "16", "Other (specify below)"];

export const intubationConfirmationCo2ResultOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Positive/Yellow", value: "Positive/Yellow" },
  { label: "Negative/Purple", value: "Negative/Purple" },
];
export const intubationConfirmationEsophagealBulbResultOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Refill", value: "Refill" },
  { label: "No Refill", value: "No Refill" },
];

export const intubationConfirmationMethodsCheckboxOptions = [
  { id: "co2Detector", label: "CO2 Detector (Colorimetric/Waveform)" },
  { id: "esophagealBulb", label: "Esophageal Bulb Device" },
  { id: "bilateralLungs", label: "Bilateral Lung Sounds" },
  { id: "noEpigastric", label: "No Epigastric Sounds" },
  { id: "chestXray", label: "Chest X-Ray (Hospital)" },
];

// Breathing Support Specific Options
export const breathingSupportProcedureNameOptions = [
  "N/A",
  "Nasal Cannula",
  "Simple Mask",
  "Non-Rebreather Mask",
  "Venturi Mask",
  "Nebulizer Treatment",
  "CPAP/BiPAP (Non-Invasive Ventilation)",
  "Manual NIV Device",
  "Mechanical Ventilator Use",
  "PEEP Application (Manual with BVM)",
  "Rescue Breathing",
  "Impedance Threshold Device (ITD) Use",
  "Chest Decompression (Needle Thoracentesis)",
  "Chest Tube Management",
  "Use of Peak-Flow Meter",
];

export const venturiMaskO2Options = ["N/A", "24%", "28%", "31%", "35%", "40%", "50%", "60%"];
export const cpapMaskSizeOptions = ["N/A", "Small", "Medium", "Large", "Other"];
export const drivingGasOptions: { label: string; value: 'Oxygen' | 'Air' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Oxygen", value: "Oxygen" },
  { label: "Air", value: "Air" },
];
export const mechVentModeOptions = ["N/A", "AC", "SIMV", "Pressure Support", "Other"];
export const tidalVolumeUnitOptions: { label: string; value: 'mL' | 'mL/kg' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "mL", value: "mL" },
  { label: "mL/kg", value: "mL/kg" },
];
export const peepLevelOptions = ["N/A", "5", "7.5", "10", "Other"];
export const chestDecompressionNeedleGaugeOptions = ["N/A", "10g", "14g", "16g", "Other"];
export const chestDecompressionCatheterLengthOptions = ["N/A", "1.75 inches", "2.25 inches", "3.25 inches", "Other"];
export const chestDecompressionSiteOptions = ["N/A", "2nd ICS MCL", "5th ICS AAL", "5th ICS MAL", "Other"];
export const leftRightOptions: { label: string; value: 'Left' | 'Right' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
];
export const chestTubeDrainageSystemOptions: { label: string; value: 'Water Seal' | 'Suction' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Water Seal", value: "Water Seal" },
  { label: "Suction", value: "Suction" },
];

// Cardiac Procedure Specific Options
export const rhythmOptions: { group: string, options: {value: string, label: string}[] }[] = [
  { group: "Not Applicable", options: [{ value: "N/A", label: "N/A" }] }, 
  {
    group: "Sinus Rhythms",
    options: [
      { value: "Normal Sinus Rhythm", label: "Normal Sinus Rhythm" },
      { value: "Sinus Bradycardia", label: "Sinus Bradycardia" },
      { value: "Sinus Tachycardia", label: "Sinus Tachycardia" },
      { value: "Sinus Arrest", label: "Sinus Arrest" },
      { value: "Sinus Block", label: "Sinus Block" },
    ],
  },
  {
    group: "Atrial Rhythms",
    options: [
      { value: "Atrial Fibrillation", label: "Atrial Fibrillation" },
      { value: "Atrial Flutter", label: "Atrial Flutter" },
      { value: "Atrial Tachycardia", label: "Atrial Tachycardia" },
      { value: "Multifocal Atrial Tachycardia", label: "Multifocal Atrial Tachycardia" },
    ],
  },
  {
    group: "Junctional Rhythms",
    options: [
      { value: "Junctional Rhythm", label: "Junctional Rhythm" },
      { value: "Junctional Tachycardia", label: "Junctional Tachycardia" },
      { value: "Accelerated Junctional Rhythm", label: "Accelerated Junctional Rhythm" },
    ],
  },
  {
    group: "Ventricular Rhythms",
    options: [
      { value: "Ventricular Tachycardia", label: "Ventricular Tachycardia" },
      { value: "Ventricular Fibrillation", label: "Ventricular Fibrillation" },
      { value: "Idioventricular Rhythm", label: "Idioventricular Rhythm" },
      { value: "Accelerated Idioventricular Rhythm", label: "Accelerated Idioventricular Rhythm" },
      { value: "Torsades de Pointes", label: "Torsades de Pointes" },
    ],
  },
  {
    group: "Heart Blocks",
    options: [
      { value: "1st Degree AV Block", label: "1st Degree AV Block" },
      { value: "2nd Degree AV Block Type I (Wenckebach)", label: "2nd Degree AV Block Type I (Wenckebach)" },
      { value: "2nd Degree AV Block Type II", label: "2nd Degree AV Block Type II" },
      { value: "3rd Degree AV Block (Complete)", label: "3rd Degree AV Block (Complete)" },
    ],
  },
  {
    group: "Paced Rhythms",
    options: [
      { value: "Atrial Paced", label: "Atrial Paced" },
      { value: "Ventricular Paced", label: "Ventricular Paced" },
      { value: "Dual Chamber Paced", label: "Dual Chamber Paced" },
      { value: "Pacemaker Malfunction", label: "Pacemaker Malfunction" },
    ],
  },
  {
    group: "Other Rhythms",
    options: [
      { value: "Asystole", label: "Asystole" },
      { value: "Pulseless Electrical Activity (PEA)", label: "Pulseless Electrical Activity (PEA)" },
      { value: "Artifact", label: "Artifact" },
      { value: "Undetermined", label: "Undetermined" },
      { value: "Not Assessed", label: "Not Assessed / Not Applicable"},
    ],
  },
];

export const rhythmAttributeOptions: { id: string; label: string }[] = [
  { id: "pacs", label: "Premature Atrial Contractions (PACs)" },
  { id: "pjcs", label: "Premature Junctional Contractions (PJCs)" },
  { id: "pvcs", label: "Premature Ventricular Contractions (PVCs)" },
  { id: "aberrancy", label: "Aberrancy" },
  { id: "stElevation", label: "ST Elevation" },
  { id: "stDepression", label: "ST Depression" },
  { id: "tWaveInversion", label: "T-Wave Inversion" },
  { id: "qWaves", label: "Q Waves" },
];

export const stemiLocationOptions: string[] = [
  "N/A", "Anterior", "Anterolateral", "Anteroseptal", "Inferior", "Lateral", "Posterior", "Septal", "Widespread (Multiple Territories)"
];

export const cardiacProcedureNameOptions: string[] = [
  "N/A",
  "Carotid Sinus Massage",
  "Chest Compressions",
  "Defibrillation",
  "Pacing",
  "Synchronized Cardioversion",
  "Valsalva's Maneuver",
  "Precordial Thump",
];

export const chestCompressionMethodOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Automated CPR Device", value: "Automated CPR Device" },
  { label: "Manual", value: "Manual" },
];

export const yesNoNotMonitoredOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not Monitored", value: "Not Monitored" },
];

export const defibMethodOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Automated (AED)", value: "Automated (AED)" },
  { label: "Manual", value: "Manual" },
];

export const roscOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "No ROSC", value: "No ROSC" },
  { label: "Brief ROSC", value: "Brief ROSC" },
  { label: "Sustained ROSC", value: "Sustained ROSC" },
];

export const pacingMethodOptions: { label: string; value: string }[] = [
  { label: "N/A", value: "N/A" },
  { label: "External/Transcutaneous", value: "External/Transcutaneous" },
  { label: "Transvenous (existing)", value: "Transvenous (existing)" },
];
    

// Vascular Access/IO Specific Options
export const vascularAccessLocationOptions = [
  "N/A",
  "Antecubital",
  "External Jugular",
  "Femoral",
  "Forearm",
  "Hand",
  "Humerus (IO)",
  "Lower Extremity",
  "Scalp",
  "Sternal (IO)",
  "Tibia (IO)",
  "Umbilical",
  "Other",
];

export const vascularAccessSideOptions: { label: string; value: 'Left' | 'Right' | 'Midline' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
  { label: "Midline", value: "Midline" },
];

export const vascularFluidTypeOptions = [
  "N/A",
  "Normal Saline",
  "Lactated Ringers",
  "D5W",
  "Saline Lock",
  "Other",
];

export const vascularProcedureTypeOptions = [
  "N/A",
  "Blood Draw",
  "Central line (existing)",
  "Discontinue venous access",
  "Existing catheter (used)",
  "IO Insertion",
  "IV Insertion",
  "IV with blood draw",
  "Swan Ganz maintenance (existing)",
];

export const bloodDrawNeedleGaugeOptions = [
  "N/A", "21g", "22g", "23g", "Butterfly 21g", "Butterfly 23g", "Butterfly 25g"
];

export const ioNeedleSystemOptions = [
  "N/A",
  "EZ-IO 15mm (Pink)",
  "EZ-IO 25mm (Blue)",
  "EZ-IO 45mm (Yellow)",
  "FAST1 (Sternal)",
  "Manual IO Needle (Specify)",
  "Other",
];

export const ivCatheterGaugeOptions = [
  "N/A", "14g", "16g", "18g", "20g", "22g", "24g", "26g"
];

// Medication Specific Options
export const medicationNameOptions: { group: string; items: string[] }[] = [
  { group: "N/A Medication", items: ["N/A"] },
  { group: "Analgesics", items: ["Fentanyl", "Morphine", "Ketamine (Analgesic)", "Ketorolac", "Acetaminophen", "Ibuprofen"] },
  { group: "Cardiac", items: ["Adenosine", "Amiodarone", "Aspirin", "Atropine", "Diltiazem", "Epinephrine", "Labetalol", "Lidocaine", "Metoprolol", "Nitroglycerin", "Norepinephrine", "Sodium Bicarbonate", "Verapamil"] },
  { group: "Sedatives/Anxiolytics", items: ["Diazepam", "Lorazepam", "Midazolam", "Ketamine (Sedation)", "Etomidate", "Propofol"] },
  { group: "Paralytics", items: ["Succinylcholine", "Rocuronium", "Vecuronium"] },
  { group: "Respiratory", items: ["Albuterol", "Ipratropium", "Methylprednisolone", "Dexamethasone", "Epinephrine (Nebulized)"] },
  { group: "Other Medications", items: ["Dextrose", "Diphenhydramine", "Glucagon", "Haloperidol", "Magnesium Sulfate", "Naloxone", "Ondansetron", "Calcium Chloride", "Tranexamic Acid"] },
  { group: "Custom", items: ["Other (Specify)"] },
];


export const medicationUnitOptions = [
  "N/A", "mcg", "mg", "g", "mcg/kg", "mg/kg", "mL", "L", 
  "mcg/min", "mg/min", "mcg/kg/min", "units", "mEq", 
  "puffs", "sprays", "drops", "tabs", "patch"
];

export const medicationRouteOptions = [
  "N/A", "IV Push", "IV Bolus", "IV Drip",
  "IO",
  "Intramuscular", "Subcutaneous",
  "Oral", "Sublingual", "Buccal",
  "Nasal", "Nebulizer", "Inhalation",
  "Endotracheal Tube",
  "Rectal",
  "Topical", "Transdermal",
  "Ophthalmic", "Otic",
  "BVM", "PPV", "NRB Mask", "Simple Mask", "Nasal Cannula", "Venturi Mask", "Tracheostomy",
  "Wound", "Urethral",
  "Other"
];

// Trauma Care & Immobilization Specific Options
export const traumaProcedureCategoryOptions = [
  {label: "N/A", value: "N/A"},
  {label: "Spinal Immobilization", value: "Spinal Immobilization"},
  {label: "Limb Immobilization", value: "Limb Immobilization"},
  {label: "Hemorrhage Control", value: "Hemorrhage Control"},
  {label: "Other Trauma Care", value: "Other Trauma Care"},
];

export const spinalImmobilizationProcedureOptions = [
  "N/A", "Cervical Collar (C-Collar)", "Kendrick Extrication Device (KED)", "Short Board", 
  "Long Board (LSP / Backboard)", "Scoop Stretcher", "Vacuum Mattress"
];
export const cCollarSizeOptions = [
  "N/A", "No-Neck", "Small", "Regular/Medium", "Large", "Adjustable - Setting", "Other"
];

export const limbImmobilizationProcedureOptions = [
  "N/A", "Basic Splint (Sling/Swathe, Pillow, SAM Splint folded)", "Traction Splint", 
  "Vacuum Splint (Limb)", "Air Splint", "Rigid Splint (Board, SAM Splint rigid)"
];
export const tractionSplintTypeOptions = ["N/A", "Hare", "Sager", "KTD", "Reel", "Other"];

export const hemorrhageControlProcedureOptions = [
  "N/A", "Wound Dressing / Bandaging", "Tourniquet Application", "Hemostatic Agent Use", 
  "Pneumatic Anti-Shock Garment (PASG/MAST)", "Non-Pneumatic Anti-Shock Garment Use"
];
export const tourniquetTypeOptions = ["N/A", "CAT", "SOFTT-W", "SWAT-T", "Improvised", "Other"];
export const hemostaticAgentTypeOptions = ["N/A", "QuikClot Combat Gauze", "Celox", "Other Granules/Gauze"];
export const pasgCompartmentsOptions = [
  { id: "Left Leg", label: "Left Leg" },
  { id: "Right Leg", label: "Right Leg" },
  { id: "Abdomen", label: "Abdomen" },
];

export const otherTraumaCareProcedureOptions = [
  "N/A", "Pelvic Stabilisation Device Use", "Care of Impaled Objects", "Extrication Performed"
];
export const pelvicDeviceTypeOptions = [
  "N/A", "T-POD", "SAM Pelvic Sling", "Improvised Sheet Wrap", "Other"
];

// Obstetrics/Neonatal Specific Options
export const obstetricsNeonatalProcedureNameOptions: { group: string; items: string[] }[] = [
  { group: "N/A Procedures", items: ["N/A"] },
  { 
    group: "Delivery Procedures", 
    items: [
      "Normal Vaginal Delivery", 
      "Abnormal Vaginal Delivery (Non-Breech)", 
      "Breech Delivery"
    ] 
  },
  { 
    group: "Obstetric Procedures", 
    items: [
      "Care of Prolapsed Umbilical Cord", 
      "Fundal Massage"
    ] 
  },
  { 
    group: "Neonatal Procedures", 
    items: [
      "Neonatal Resuscitation Required", 
      "Setup/Monitor Incubator"
    ] 
  },
];

export const infantGenderOptions = [ "N/A", "Male", "Female", "Indeterminate" ];

export const fundalMassageUterineToneOptions = [ "N/A", "Firm", "Boggy" ];

export const incubatorTemperatureUnitOptions: { label: string; value: '°C' | '°F' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "°C", value: "°C" },
  { label: "°F", value: "°F" },
];

// Reusing yesNoNaOptions for placentaDelivered
export const placentaIntactOptions = [ "N/A", "Yes", "No", "Uncertain" ];

// Other Interventions Specific Options
export const otherInterventionCategoryOptions = [
  {label: "N/A", value: "N/A"},
  {label: "Tubes and Catheters", value: "Tubes and Catheters"},
  {label: "Safety and Protection", value: "Safety and Protection"},
  {label: "Cardiac and Stroke Management", value: "Cardiac and Stroke Management"},
  {label: "Wound Management", value: "Wound Management"},
  {label: "Advanced Procedures", value: "Advanced Procedures"},
];

export const tubesAndCathetersProcedureOptions = [
  "N/A", "Naso/Orogastric Tube Insertion", "Urinary Catheterization"
];
export const ngTubeSizeOptions = ["N/A", "10Fr", "12Fr", "14Fr", "16Fr", "18Fr", "Other"];
export const ngPlacementConfirmationOptions = ["N/A", "Auscultation", "Aspiration", "pH Test", "X-Ray in ED"];
export const urinaryCatheterSizeOptions = ["N/A", "12Fr", "14Fr", "16Fr", "18Fr", "Other"];
export const urinaryCatheterTypeOptions = ["N/A", "Foley", "Straight/Intermittent"];

export const safetyAndProtectionProcedureOptions = [
  "N/A", "Decontamination", "Physical Restraints Applied"
];
export const restraintTypeOptions = ["N/A", "Soft Limb", "Leather", "Spit Hood", "Full Body Wrap", "Other"];

export const cardiacAndStrokeManagementProcedureOptions = [
  "N/A", "Thrombolytic Screen Performed", "Thrombolysis Administered"
];
export const thrombolyticScreenResultOptions = ["N/A", "Eligible", "Ineligible - Contraindicated", "Inconclusive"];

export const woundManagementProcedureOptions = [
  "N/A", "Suturing", "Morgan Lens Use", "Eye Irrigation (Other Method)"
];
export const morganLensEyeOptions: { label: string; value: 'Left' | 'Right' | 'Both' | 'N/A' }[] = [
  { label: "N/A", value: "N/A" },
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
  { label: "Both", value: "Both" },
];


export const advancedProceduresOptions = [
  "N/A",
  "Use of Doppler/Ultrasound",
  "Pericardiocentesis",
  "Field Amputation",
  "Ice Pack Application",
  "Targeted Temperature Management",
  "Arterial Blood Gas Sampling",
  "Invasive Hemodynamic Monitoring"
];
export const dopplerProbeTypeOptions = ["N/A", "Linear", "Curvilinear", "Phased Array", "Vascular Doppler"];
export const ttmUnitOptions: { label: string; value: '°C' | '°F' | 'N/A' }[] = [ 
  { label: "N/A", value: "N/A" },
  { label: "°C", value: "°C" },
  { label: "°F", value: "°F" },
];
export const abgSiteOptions = ["N/A", "Radial", "Brachial", "Femoral", "Art Line"];

// Shift Management
export const shiftTypeOptions = [
  "N/A", "Clinical", "Field", "Lab", "Other"
];
