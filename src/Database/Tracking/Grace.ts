import { minutes } from "../../../constants.js";
import type { TrackingData, GraceData } from "../db.types.js";
import type { Reading } from "../../Glucose/glucose.types.js";

import { Utils } from '../Utils.js';

export class Grace {

   //SET GRACE DATA

    isGrace(reading: Reading, prevData: TrackingData): boolean {
        //If no grace period remains, always return false
        if(prevData.grace.period === 0) {
            return false;
        }
        return (!Utils.isInBounds(reading) && prevData.streak.duration > 0);
    }

    period(reading: Reading, prevData: TrackingData): number {
        //If it's a new day reset
        if(Utils.checkReset(reading, prevData)){
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

}