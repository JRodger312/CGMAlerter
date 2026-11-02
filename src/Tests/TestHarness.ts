import type { Reading } from "../Glucose/glucose.types.js";
import { reset, type TrackingData } from "../Database/db.types.js";

import { StatTracker } from "../Database/StatTracker.js";
import { JsonUtils } from "../Database/JsonUtils.js";
import { NotificationHandler } from "../Notifications/notification-handler.js";
import { GlucoseMonitor } from "../Monitor/monitor.js";

interface TestScenario {
    name: string;
    readings: Reading[];
    initialData?: TrackingData;
    resetDatabase?: boolean;
    sendNotifications?: boolean;
}

interface TestHarnessOptions {
    verbose?: boolean;
}

export class TestHarness {
    constructor(
        private readonly tracker: StatTracker,
        private readonly db: JsonUtils<TrackingData>,
        private readonly notifications: NotificationHandler,
        private readonly provider: GlucoseMonitor,
        private readonly options: TestHarnessOptions = {}
    ) {}

    async run(scenario: TestScenario): Promise<TrackingData> {

        console.log(`\n=== ${scenario.name} ===`);
        console.log(`Readings to process: ${scenario.readings.length}`);

        // Initialize the database
        await this.db.write(scenario.initialData ?? reset);

        for (const reading of scenario.readings) {
            const previousData = await this.db.read();

            const newData = this.tracker.getNewData(
                reading,
                previousData
            );

            // Notifications can be disabled for simulation.
            if (scenario.sendNotifications ?? true) {
                await this.notifications.sendNotification(
                    newData,
                    previousData
                );
            }

            await this.db.write(newData);

            if (this.options.verbose ?? true) {
                console.log({
                    timestamp: reading.timestamp,
                    value: reading.value,
                    streak: newData.streak,
                    grace: newData.grace,
                    notfications: newData.notifications
                });
            }
        }

        const finalData = await this.db.read();

        console.log(`=== ${scenario.name} complete ===\n`);

        return finalData;
    }
}