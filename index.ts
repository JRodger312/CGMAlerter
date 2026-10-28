import "dotenv/config";
import cron from "node-cron";

import { dbPath, minutes } from './constants.js'

import { GlucoseMonitor } from "./src/Monitor/monitor.js";
import { GlucoseProvider } from "./src/Glucose/glucose-provider.js";
import { GlucoseService } from "./src/Glucose/glucose-service.js";
import { NotificationService } from "./src/Notifications/notification-service.js";
import { NotificationHandler } from "./src/Notifications/notification-handler.js"
import { JSONUtils } from "./src/Database/json-utils.js";
import { StatTracker } from "./src/Database/stat-tracker.js";
import type { TrackingData } from "./src/Database/db.types.js";
import { reset } from "./src/Database/db.types.js";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId =  process.env.TELEGRAM_CHAT_ID;

// Validate database configuration
if (!dbPath) {
  throw new Error("DB Path not defined");
}

// Validate Telegram configuration
if (!botToken || !chatId) {
  throw new Error("Missing required Telegram environment variables");
}

// Initialize glucose services
const glucoseProvider = new GlucoseProvider();
const glucoseService = new GlucoseService(glucoseProvider);


// Initialize database
const db = new JSONUtils<TrackingData>(dbPath);
const tracker = new StatTracker();

// Initialize SMS service
const smsService = new NotificationService(botToken, chatId);
const smsHandler = new NotificationHandler(smsService);

const monitor = new GlucoseMonitor(
    glucoseService,
    tracker,
    smsHandler,
    db
);

//Reset the DB
console.log("Resetting json db")
await db.write(reset)


// Run monitoring every five minutes
console.log("Starting glucose monitoring cycle...\n");


cron.schedule(`*/${minutes} * * * *`, async () => {
        try {
            await monitor.runCycle();
        } catch (error) {
            console.error("Error during glucose monitoring:", error);
        }
    },
    {
        noOverlap: true
    }
);
