export interface GlucoseReading {
  timestamp: Date;
  value: number;
  unit: "mg/dL";
}

export interface GlucoseRange {
  acceptableMin: number; //70
  acceptableMax: number; //180
}

export const DEFAULT_GLUCOSE_RANGE: Readonly<GlucoseRange> = {
  acceptableMin: 80,
  acceptableMax: 170,
};

//ANGRY DEVIL FACE FOR URGENT LOW < 55

