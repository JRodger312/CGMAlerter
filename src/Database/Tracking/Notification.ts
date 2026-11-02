import type { NotificationData, TrackingData } from "../db.types.js";
import type { Reading } from "../../Glucose/glucose.types.js";
import { minutes } from '../../../constants.js'

import { Utils } from '../Utils.js';

export class Notification {

    // SET NOTIFICATION DATA
    lowCD(reading: Reading, prevData: TrackingData): number {
        const newData = {...prevData.notifications};
        if(prevData.notifications.lowCD > 0){
            return newData.lowCD - minutes;
        };
        if(Utils.isLow(reading)){
            return 60;
        }
        return 0;
    }

    highCD(reading: Reading, prevData: TrackingData): number {
        const newData = {...prevData.notifications};
        if(prevData.notifications.highCD > 0){
            return newData.highCD - minutes;
        }
        if(Utils.isHigh(reading)){
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