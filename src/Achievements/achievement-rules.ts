import type { Achievement } from "./achievement.types.js";

export const achievementRules = [
  {
    id: "three-hour-streak",
    name: "Three Hour Streak",
    durationMinutes: 180,
    message: "🎉 Three hours in range!"
  },
  {
    id: "six-hour-streak",
    name: "Six Hour Streak",
    durationMinutes: 360,
    message: "🏆 Six hours in range!"
  },
  {
    id: "twelve-hour-streak",
    name: "Twelve Hour Streak",
    durationMinutes: 720,
    message: "🔥 Twelve hours in range!"
  }
];