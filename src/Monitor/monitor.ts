import { GlucoseService } from "../Glucose/GlucoseService.js";
import { StatTracker } from "../Database/StatTracker.js";
import { NotificationHandler } from "../Notifications/notification-handler.js";
import { JSONUtils } from "../Database/JsonUtils.js";
import type { TrackingData } from "../Database/db.types.js";
import type { Reading } from "../Glucose/glucose.types.js";

export class GlucoseMonitor {
    constructor(
        private readonly glucoseService: GlucoseService,
        private readonly tracker: StatTracker,
        private readonly notificationHandler: NotificationHandler,
        private readonly db: JSONUtils<TrackingData>
    ) {}

    async runCycle(): Promise<void> {
        const reading = await this.glucoseService.getLatestReading();

        if (!reading) {
            console.log("No glucose reading available.");
            return;
        }

        await this.processReading(reading);
    }

    async processReading(reading: Reading): Promise<TrackingData> {
        const prevData = await this.db.read();

        const newData = this.tracker.getNewData(reading, prevData);
        
        await this.db.write(newData);
            
        try {
        await this.notificationHandler.sendNotification(
            newData,
            prevData
        );
    } catch (error) {
        console.error("Notification failed:", error);
    }

        console.log(
            reading.value,
            newData.streak,
            newData.grace,
            newData.notifications
        );

        console.log("Cycle complete");

        return newData;
    }
}
