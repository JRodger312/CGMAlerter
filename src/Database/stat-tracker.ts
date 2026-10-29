import type { DailyData, GraceData, ReadingData, StreakData, NotificationData, TrackingData } from "./db.types.js";
import type { Reading } from "../Glucose/glucose.types.js";
import { DEFAULT_GLUCOSE_RANGE } from "../Glucose/glucose.types.js";
import { minutes, gracePeriod } from '../../constants.js'


export class StatTracker {

    //SET ALL DATA

    getNewData(reading: Reading, prevData: TrackingData): TrackingData {
        let newData = {
            reading: this.setReading(reading),
            streak: this.setStreak(reading, prevData),
            grace: this.setGrace(reading, prevData),
            daily: this.setDaily(reading, prevData),
            notifications: this.setNotifications(reading, prevData)
        }
        return newData;
    }

    //SET READING DATA

    isInBounds(reading: Reading): boolean {
        return (
            reading.value >= DEFAULT_GLUCOSE_RANGE.acceptableMin &&
            reading.value <= DEFAULT_GLUCOSE_RANGE.acceptableMax
        );
    }

    isLow(reading: Reading): boolean {
        return reading.value < 55
    }

    isHigh(reading: Reading): boolean {
        return reading.value > 300;
    }

    setReading(reading: Reading): ReadingData {
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

    isStreak(reading: Reading): boolean {
        return this.isInBounds(reading);
    }

    //LOGIC CONCERNING GRACE AND STREAKS WILL LIVE HERE
    duration(reading: Reading, prevData: TrackingData): number {
        //If streak is active increment duration
        if(this.isStreak(reading)){
            return prevData.streak.duration + 1;
        }

        //If reading is out of bounds and no grace is available, reset
        if(!this.isStreak(reading) && prevData.grace.period === 0){
            return 0;
        }
        return prevData.streak.duration;
    }


    setStreak(reading: Reading, prevData: TrackingData): StreakData {
        const newData: StreakData = {
            streak: this.isStreak(reading),
            duration: this.duration(reading, prevData)
        }
        return newData;
    }

    //SET GRACE DATA

    isGrace(reading: Reading, prevData: TrackingData): boolean {
        //If no grace period remains, always return false
        if(prevData.grace.period === 0) {
            return false;
        }
        return (!this.isInBounds(reading) && prevData.streak.duration > 0);
    }

    period(reading: Reading, prevData: TrackingData): number {
        //If it's a new day reset
        if(this.checkReset(reading, prevData)){
            return 60;
        }
        //If period was 0, return 0
        if(prevData.grace.period === 0){
            return 0;
        }
        //Check if a streak was active, if so && period > 0, decrement period
        if(prevData.streak.duration > 0 && this.isGrace(reading, prevData)){
            return prevData.grace.period - minutes;
        }
        return prevData.grace.period;
    }

    setGrace(reading: Reading, prevData: TrackingData): GraceData {
        const newData: GraceData = {
            grace: this.isGrace(reading, prevData),
            period: this.period(reading, prevData)
        }
        return newData;
    }

    // SET DAILY DATA

    checkReset(reading: Reading, prevData: TrackingData): boolean {
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

    reset(reading: Reading, prevData: TrackingData): DailyData {
        const newData: DailyData = {
            day: reading.timestamp.getTime(),
            hits: 0,
            misses: 0
        }
        return newData;
    }

    setDaily(reading: Reading, prevData: TrackingData): DailyData {
        const key: "hits" | "misses" = this.isInBounds(reading)
            ? "hits"
            : "misses";

        const newData = this.checkReset(reading, prevData)
            ? this.reset(reading, prevData)
            : { ...prevData.daily };

        newData[key]++;

        return newData;
    }

    // SET NOTIFICATION DATA
    lowCD(reading: Reading, prevData: TrackingData): number {
        const newData = {...prevData.notifications};
        if(prevData.notifications.lowCD > 0){
            return newData.lowCD - minutes;
        };
        if(this.isLow(reading)){
            return 60;
        }
        return 0;
    }

    highCD(reading: Reading, prevData: TrackingData): number {
        const newData = {...prevData.notifications};
        if(prevData.notifications.highCD > 0){
            return newData.highCD - minutes;
        }
        if(this.isHigh(reading)){
            return 60;
        }
        return 0;
    }

    setNotifications(reading: Reading, prevData: TrackingData): NotificationData {
        const newData: NotificationData = {
            lowCD: this.lowCD(reading, prevData),
            highCD: this.highCD(reading, prevData),
            lastSent: prevData.notifications.lastSent
        };
        return newData;
    }
}
