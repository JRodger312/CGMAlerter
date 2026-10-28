import { Api } from "node-telegram-bot-api";

export class NotificationService {
    private readonly api: Api;
    private readonly chatId: string;

    constructor(token: string, chatId: string) {
        this.api = new Api(token);
        this.chatId = chatId;
    }

    async sendNotification(message: string): Promise<void> {
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