import type { DailyData, GraceData, ReadingData, StreakData, TrackingData } from "./db.types.js";
import type { GlucoseReading } from "../Glucose/glucose.types.js";
import { DEFAULT_GLUCOSE_RANGE } from "../Glucose/glucose.types.js";

export const GRACE_PERIOD = 60;

export class StatTracker {

    //SET ALL DATA
    getNewData(reading: GlucoseReading,prevData: TrackingData): TrackingData {
        return {
            reading: this.setReading(reading, prevData),
            streak: this.setStreak(reading, prevData),
            grace: this.setGrace(reading, prevData),
            daily: this.setDaily(reading, prevData),
            notifications: { ...prevData.notifications }
        };
    }

    //SET READING DATA

    isInBounds(reading: GlucoseReading): boolean {
        return (
            reading.value >= DEFAULT_GLUCOSE_RANGE.acceptableMin &&
            reading.value <= DEFAULT_GLUCOSE_RANGE.acceptableMax
        );
    }

    isLow(reading: GlucoseReading): boolean {
        return reading.value < 55
    }

    isHigh(reading: GlucoseReading): boolean {
        return reading.value > 300;
    }

    setReading(reading: GlucoseReading, data: TrackingData): ReadingData {
        const newData: ReadingData = {
            timestamp: reading.timestamp.getTime(),
            value: reading.value,
            inBounds:this.isInBounds(reading),
            high: this.isHigh(reading),
            low: this.isLow(reading),
        }
        return newData;
    }

    //SET STREAK DATA

    isStreak(reading: GlucoseReading, prevData: TrackingData): boolean {
        return this.isInBounds(reading) ||
            this.isGrace(reading, prevData);
    }

    start(reading: GlucoseReading, prevData: TrackingData): number | null {
        if(!prevData.streak.streak && this.isInBounds(reading)){
            return reading.timestamp.getTime();
        }
        return prevData.streak.start;
    }

    end(reading: GlucoseReading, prevData: TrackingData): number | null {
        if(prevData.streak.streak && !this.isInBounds(reading)){
            return reading.timestamp.getTime();
        }
        return prevData.streak.end;
    }

    //STILL NEED TO CALCULATE DURATION
    duration(reading: GlucoseReading, prevData: TrackingData): number {
        const start = this.start(reading, prevData);

        if (start === null) {
            return 0;
        }

        const isActive = this.isStreak(reading, prevData);

        const end = isActive
            ? reading.timestamp.getTime()
            : this.end(reading, prevData);

        if (end === null) {
            return 0;
        }

        return Math.floor((end - start) / 60000);
    }


    setStreak(reading: GlucoseReading, prevData: TrackingData): StreakData {
        const newData: StreakData = {
            streak: this.isStreak(reading, prevData),
            start: this.start(reading, prevData),
            end: this.end(reading, prevData),
            duration: this.duration(reading, prevData)
        }
        return newData;
    }

    //SET GRACE DATA

    isGrace(reading: GlucoseReading, prevData: TrackingData): boolean {
        if (this.isInBounds(reading) || !prevData.streak.streak) {
            return false;
        }

        const expiration = prevData.grace.period;

        return expiration === null ||
            reading.timestamp.getTime() <= expiration;
    }

    period(reading: GlucoseReading, prevData: TrackingData): number | null {
        if (!this.isGrace(reading, prevData)) {
            return null;
        }

        if (prevData.grace.grace && prevData.grace.period !== null) {
            return prevData.grace.period;
        }

        return reading.timestamp.getTime() + GRACE_PERIOD * 60 * 1000;
    }

    setGrace(reading: GlucoseReading, prevData: TrackingData): GraceData {
        const newData: GraceData = {
            grace: this.isGrace(reading, prevData),
            period: this.period(reading, prevData)
        }
        return newData;
    }

    // SET DAILY DATA

    checkReset(reading: GlucoseReading, prevData: TrackingData): boolean {
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

    reset(reading: GlucoseReading, prevData: TrackingData): DailyData {
        const newData: DailyData = {
            day: reading.timestamp.getTime(),
            hits: 0,
            misses: 0
        }
        return newData;
    }

    setDaily(reading: GlucoseReading, prevData: TrackingData): DailyData {
        const key: "hits" | "misses" = this.isInBounds(reading)
            ? "hits"
            : "misses";

        const newData = this.checkReset(reading, prevData)
            ? this.reset(reading, prevData)
            : { ...prevData.daily };

        newData[key]++;

        return newData;
    }
}
