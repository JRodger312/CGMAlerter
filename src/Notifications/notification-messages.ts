import { TextNotification, GifNotification } from "./notification.types.js";

export const texts: Record<string, TextNotification> = {
  3: {
    type: "text",
    id: "three-hour-streak",
    message: "🎉 Three hours in range!"
  },
  5: {
    type: "text",
    id: "six-hour-streak",
    message: "🏆 Six hours in range!"
  },
  7: {
    type: "text",
    id: "twelve-hour-streak",
    message: "🔥 Twelve hours in range!"
  }
};



export const gifs: Record<string, GifNotification> = {
  low: {
      type: "gif",
      gifUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDVpZDI4Ymxzb2VkNjR6ODlobzJndDU5NjkxN2NlbDF5bDM1dXRqaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xK0liGg1yTgcZq/giphy.gif",
      caption: "👿👿👿 Your glucose is low. Eat a cookie!"
    },
    high: {
      type: "gif",
      gifUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXg5bXYyM3J3YnF6OHV4M2hwZzBrYjVxemw0bGQwY2hzNjVhMnl0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yd7FaLDEnoA2zYwAhy/giphy.gif",
      caption: "Your glucose is high. Jack needs a walk!"
  }
};