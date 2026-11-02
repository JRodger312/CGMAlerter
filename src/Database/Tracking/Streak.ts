import type { StreakData, TrackingData } from "../db.types.js";
import type { Reading } from "../../Glucose/glucose.types.js";

import { Utils } from '../Utils.js';


export class Streak {
    //SET STREAK DATA

    isStreak(reading: Reading): boolean {
        return Utils.isInBounds(reading);
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
}