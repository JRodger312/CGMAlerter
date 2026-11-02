import type { TrackingData, DailyData } from "../db.types.js";
import type { Reading } from "../../Glucose/glucose.types.js";

import { Utils } from '../Utils.js';


export class Daily {

        // SET DAILY DATA
        reset(reading: Reading): DailyData {
            const newData: DailyData = {
                day: reading.timestamp.getTime(),
                hits: 0,
                misses: 0
            }
            return newData;
        }
    
        setDaily(reading: Reading, prevData: TrackingData): DailyData {
            const key: "hits" | "misses" = Utils.isInBounds(reading)
                ? "hits"
                : "misses";
    
            const newData = Utils.checkReset(reading, prevData)
                ? this.reset(reading)
                : { ...prevData.daily };
    
            newData[key]++;
    
            return newData;
        }
}
