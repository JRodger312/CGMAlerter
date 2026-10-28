import "dotenv/config";
import cron from "node-cron";

import { GlucoseProvider } from "./src/Glucose/glucose-provider.js";
import { GlucoseService } from "./src/Glucose/glucose-service.js";
import { AchievementEngine } from "./src/Achievements/achievement-engine.js";
import { NotificationService } from "./src/Notifications/notification-service.js";
import { NotificationHandler } from "./src/Notifications/notification-handler.js"
import { JSONUtils } from "./src/Database/json-utils.js";
import { StatTracker } from "./src/Database/stat-tracker.js";
import type { StreakData, TrackingData } from "./src/Database/db.types.js";
import { reset } from "./src/Database/db.types.js";
import { texts, gifs } from "./src/Notifications/notification-messages.js";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId =  process.env.TELEGRAM_CHAT_ID;
const dbPath = process.env.DB_JSON;
const minutes = 1;

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

// Initialize achievement engine
const achievementEngine = new AchievementEngine();

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
    // 1. Fetch the latest glucose reading

    const reading = await glucoseService.getLatestReading();

    // 2. Read the current db values

    const data = await db.read();

    // 3. Determine and apply the appropriate action


    //check for low glucose alert

    // 4. Log the updated state

    const updatedData = await db.read();
    console.log("Updated data:", updatedData);
  } catch (error) {
    console.error("Error during glucose monitoring:", error);
  }
});
