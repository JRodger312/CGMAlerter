import { TextNotification, GifNotification } from "./notification.types.js";

export const texts: TextNotification[] = [
  {
    id: "three-hour-streak",
    message: "🎉 Three hours in range!"
  },
  {
    id: "six-hour-streak",
    message: "🏆 Six hours in range!"
  },
  {
    id: "twelve-hour-streak",
    message: "🔥 Twelve hours in range!"
  }
];



export const gifs: Record<string, GifNotification> = {
  low: {
      gifUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDVpZDI4Ymxzb2VkNjR6ODlobzJndDU5NjkxN2NlbDF5bDM1dXRqaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xK0liGg1yTgcZq/giphy.gif",
      caption: "👿👿👿 Your glucose is low. Eat a cookie!"
  }
};