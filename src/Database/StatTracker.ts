import type { ReadingData, TrackingData } from "./db.types.js";
import type { Reading } from "../Glucose/glucose.types.js";

import { Utils } from './Utils.js';
import { Streak } from './Tracking/Streak.js';
import { Grace } from "./Tracking/Grace.js";
import { Daily } from "./Tracking/Daily.js";
import { Notification } from "./Tracking/Notification.js";


export class StatTracker {
    constructor(
        private streak = new Streak(),
        private grace = new Grace(),
        private daily = new Daily(),
        private notification = new Notification()
    ){}

    //SET READING DATA
    
    setReading(reading: Reading): ReadingData {
        const newData: ReadingData = {
            timestamp: reading.timestamp.getTime(),
            value: reading.value,
            inBounds:Utils.isInBounds(reading),
            high: Utils.isHigh(reading),
            low: Utils.isLow(reading),
        }
        return newData;
    }

    //SET TRACKING DATA
    
    getNewData(reading: Reading, prevData: TrackingData): TrackingData {
        let newData = {
            reading: this.setReading(reading),
            streak: this.streak.setStreak(reading, prevData),
            grace: this.grace.setGrace(reading, prevData),
            daily: this.daily.setDaily(reading, prevData),
            notifications: this.notification.setNotifications(reading, prevData)
        }
        return newData;
    }

}
