import { TrackingData } from "../Database/db.types.js";
import { NotificationService } from "./notification-service.js";
import { NotificationCooldown } from "./notification-cooldown.js";
import { texts, gifs } from "./notification-messages.js";
import { GlucoseReading } from "../Glucose/glucose.types.js";
//Takes Glucose Readings and the Current Streak to determine which message to send

export class NotificationHandler {

    constructor (
        private provider: NotificationService
    ){}

    //functions to determine which message to send
    async getNotification(reading: GlucoseReading, data: TrackingData) {

    }

    async lowGlucose(data: TrackingData) {
        if(data.reading.low == true && !NotificationCooldown.isActive(data.notifications.lowCD)) {
            this.provider.sendGif(gifs.low.gifUrl, gifs.low.caption);
        }
    }
}