import type { StreakData } from "../Database/db.types.js";
import type { GlucoseReading } from "../Glucose/glucose.types.js";
import { DEFAULT_GLUCOSE_RANGE } from "../Glucose/glucose.types.js";

type IncrementAction =
    | "increment streak"
    | "no update"
    | "increment grace"
    | "reset";

export class AchievementEngine {

}