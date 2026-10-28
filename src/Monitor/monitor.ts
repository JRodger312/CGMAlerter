import { GlucoseService } from "../Glucose/glucose-service.js";
import { StatTracker } from "../Database/stat-tracker.js";
import { NotificationHandler } from "../Notifications/notification-handler.js";
import { JSONUtils } from "../Database/json-utils.js";
import type { TrackingData } from "../Database/db.types.js";

export class GlucoseMonitor {
    constructor(
        private glucoseService: GlucoseService,
        private tracker: StatTracker,
        private notificationHandler: NotificationHandler,
        private db: JSONUtils<TrackingData>
    ) {}

    async runCycle(): Promise<void> {
        // Get current reading and previous tracking data
        const reading = await this.glucoseService.getLatestReading();
        const prevData = await this.db.read();

        // Calculate updated tracking data
        const newData = this.tracker.getNewData(reading, prevData);

        // Send notifications
        await this.notificationHandler.sendNotification(
            newData,
            prevData
        );

        // Persist updated tracking data
        await this.db.write(newData);
        console.log(newData.reading.value, newData.streak, newData.grace);
        console.log("Cycle complete");
    }
}