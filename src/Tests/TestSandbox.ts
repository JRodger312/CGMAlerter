import "dotenv/config";

import { TestDataFactory } from "./DataFactory.js";
import { TestHarness } from "./TestHarness.js";

import { GlucoseMonitor } from "../Monitor/monitor.js";
import { GlucoseProvider } from "../Glucose/GlucoseProvider.js";
import { GlucoseService } from "../Glucose/GlucoseService.js";

import { StatTracker } from "../Database/StatTracker.js";
import { JsonUtils } from "../Database/JsonUtils.js";

import { NotificationService } from "../Notifications/notification-service.js";
import { NotificationHandler } from "../Notifications/notification-handler.js";

import type { TrackingData } from "../Database/db.types.js";
import type { Reading } from "../Glucose/glucose.types.js";

// ==========================================
// SETUP
// ==========================================

const factory = new TestDataFactory();

const db = new JsonUtils<TrackingData>('./src/Tests/test.db.json');
const tracker = new StatTracker();

const glucoseService = new GlucoseService(
    new GlucoseProvider()
);

const notificationService = new NotificationService(process.env.TELEGRAM_BOT_TOKEN!, process.env.TELEGRAM_CHAT_ID!);
const notificationHandler = new NotificationHandler(notificationService);

const monitor = new GlucoseMonitor(
    glucoseService,
    tracker,
    notificationHandler,
    db
);

const harness = new TestHarness(tracker, db, notificationHandler, monitor);

// ==========================================
// SCENARIOS
// ==========================================

// Scenario 1: Normal readings
const normalReadings = {
    name: "Normal Readings",

    initialData: factory.testTracking(),

    readings: factory.testReadings(
        100,
        5
    )
};

// Scenario 2: Existing streak
const existingStreaks = {
    name: "Existing Streak",

    initialData: factory.testTracking({
        streak: {
            duration: 50
        }
    }),

    readings: factory.testReadings(
        120,
        5
    )
};

// Scenario 3: Grace period
const gracePeriods = {
    name: "Grace Period",

    initialData: factory.testTracking({
        streak: {
            duration: 25,
          },
          grace: {
            period: 5  
          }
    }),

    readings: factory.testReadings(
        200,
        5
    )
};

// Scenario 4: Mixed glucose readings
const mixedReadings = {
    name: "Mixed Readings",
    readings: [
        { timestamp: new Date("2026-10-30T12:00:00Z"), value: 100 },
        { timestamp: new Date("2026-10-30T12:01:00Z"), value: 120 },
        { timestamp: new Date("2026-10-30T12:02:00Z"), value: 200 },
        { timestamp: new Date("2026-10-30T12:03:00Z"), value: 250 },
        { timestamp: new Date("2026-10-30T12:04:00Z"), value: 110 },
    ] satisfies Reading[]
};

// Scenario 5: Low Glucose Alert
const lowGlucoseAlert = {
  name: "Low Glucose Alert",
  readings: factory.testReadings(50),
}

// Scenario 6: High Glucose Alert
const highGlucoseAlert = {
  name: "High Glucose Alert",
  readings: factory.testReadings(350)
}

const checkGrace = {
    name: "check",
    initialData: factory.testTracking({
        streak: {
            duration: 2
        },
        grace: {
            period: 2
        }
    }),
    readings: factory.testReadings(60, 3)
}

// ==========================================
// RUN SCENARIOS
// ==========================================

//await harness.run(normalReadings);
//await harness.run(existingStreaks);
//await harness.run(gracePeriods);
//await harness.run(mixedReadings);
//await harness.run(lowGlucoseAlert);
//await harness.run(highGlucoseAlert);
await harness.run(checkGrace)


console.log("\nAll sandbox scenarios completed.");