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

export const lowAlert = 55;
export const highAlert = 300;
