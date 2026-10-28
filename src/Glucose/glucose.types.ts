export interface Reading {
  timestamp: Date;
  value: number;
}

export interface GlucoseRange {
  acceptableMin: number;
  acceptableMax: number;
}

export const DEFAULT_GLUCOSE_RANGE: Readonly<GlucoseRange> = {
  acceptableMin: 80,
  acceptableMax: 170,
};

//ANGRY DEVIL FACE FOR URGENT LOW < 55

