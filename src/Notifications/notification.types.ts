export interface TextNotification {
    type: "text";
    id: string;
    message: string;
}

export interface GifNotification {
    type: "gif";
    gifUrl: string;
    caption: string;
}