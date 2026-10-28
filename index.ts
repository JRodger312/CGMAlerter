import "dotenv/config";
import cron from "node-cron";

import { dbPath, minutes } from './constants.js'

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
const sms = new NotificationService(botToken, chatId);
const smsHandler = new NotificationHandler(sms);

//Reset the DB
console.log("Resetting json db")
await db.write(reset)


// Run monitoring every five minutes
console.log("Starting glucose monitoring cycle...\n");


cron.schedule(`*/${minutes} * * * *`, async () => {

  try {
    //get current reading and previous data
    const reading = await glucoseService.getLatestReading();
    const prevData = await db.read();

    //setup new data object and check for notifications to be sent
    const newData = tracker.getNewData(reading, prevData);
    await smsHandler.sendNotification(newData, prevData);

    //write the new data
    await db.write(newData);
    console.log("Cycle complete");
  } catch (error) {
    console.error("Error during glucose monitoring:", error);
  }
});
