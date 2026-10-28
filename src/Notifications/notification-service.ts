import { Api } from "node-telegram-bot-api";
import { GifNotification, TextNotification } from "./notification.types.js";

export class NotificationService {
    private readonly api: Api;
    private readonly chatId: string;

    constructor(token: string, chatId: string) {
        this.api = new Api(token);
        this.chatId = chatId;
    }

    async sendMessage(message: TextNotification | GifNotification | null): Promise<void> {
        if(message === null) {
            return;
        }
        switch (message.type) {
            case "text":
                await this.sendText(message.message);
                break;

            case "gif":
                await this.sendGif(message.gifUrl, message.caption);
                break;
        }
    }

    async sendText(message: string): Promise<void> {
        await this.api.sendMessage({
            chat_id: this.chatId,
            text: message
        });
        console.log("Telegram notification sent successfully");
    }
        
    async sendGif( gifUrl: string, caption: string): Promise<void> {
        await this.api.sendAnimation({
            chat_id: this.chatId,
            animation: gifUrl,
            caption: caption
        });
        console.log("Telegram notification sent successfully");
    }
}