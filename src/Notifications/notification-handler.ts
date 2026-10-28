import { TrackingData } from "../Database/db.types.js";
import { NotificationService } from "./notification-service.js";
import { texts, gifs } from "./notification-messages.js";
import type { TextNotification } from "./notification.types.js";
//Takes Glucose Readings and the Current Streak to determine which message to send

export class NotificationHandler {

    constructor (
        private messager: NotificationService
    ){}

    // Send notification

    async sendNotification(newData: TrackingData, prevData: TrackingData): Promise<void> {
        const notification = this.getNotification(newData, prevData);
        await this.messager.sendMessage(notification);
    }

    // Function to determine which message to send

    getNotification(newData: TrackingData, prevData: TrackingData) {
        if(this.alertLow(newData, prevData)){
            return gifs.low;
        }
        if(this.alertHigh(newData, prevData)){
            return gifs.high;
        }
        return this.checkStreak(newData, prevData);
    }

    // Utility functions

    alertLow(newData: TrackingData, prevData: TrackingData): boolean {
        return (newData.reading.value < 55 && prevData.notifications.lowCD === 0)
    }

    alertHigh(newData: TrackingData, prevData: TrackingData): boolean {
        return (newData.reading.value > 300 && prevData.notifications.highCD === 0)
    }

    checkStreak(newData: TrackingData, prevData: TrackingData): TextNotification | null {
        const duration = newData.streak.duration;

        // Only notify during an active streak
        if (!newData.streak.streak) {
            return null;
        }

        // Look up notification by duration
        const notification = texts[duration];

        if (!notification) {
            return null;
        }

        // Prevent duplicate notifications
        if (prevData.streak.duration >= duration) {
            return null;
        }

        return notification;
    }
}