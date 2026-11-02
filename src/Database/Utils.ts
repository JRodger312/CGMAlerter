import { DEFAULT_GLUCOSE_RANGE } from "../Glucose/glucose.types.js";
import { lowAlert, highAlert } from "../Glucose/glucose.types.js";
import type { Reading } from "../Glucose/glucose.types.js";
import type { TrackingData } from "./db.types.js";

export class Utils {

        public static isInBounds(reading: Reading): boolean {
            return (
                reading.value >= DEFAULT_GLUCOSE_RANGE.acceptableMin &&
                reading.value <= DEFAULT_GLUCOSE_RANGE.acceptableMax
            );
        }
    
        public static isLow(reading: Reading): boolean {
            return reading.value < lowAlert
        }
    
        static isHigh(reading: Reading): boolean {
            return reading.value > highAlert;
        }

        static checkReset(reading: Reading, prevData: TrackingData): boolean {
            const previousDay = prevData.daily.day;
            if (previousDay === null) {
                return true;
            }
    
            const options: Intl.DateTimeFormatOptions = {
                timeZone: "America/Los_Angeles",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            };
    
            const readingDate = reading.timestamp.toLocaleDateString("en-CA", options);
            const storedDate = new Date(previousDay).toLocaleDateString("en-CA", options);
    
            return readingDate !== storedDate;
        }
}
