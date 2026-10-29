export interface StreakData {
    streak: boolean,
    duration: number
}

export interface GraceData {
    grace: boolean,
    period: number
}

export interface ReadingData {
    timestamp: number | null,
    value: number,
    inBounds: boolean,
    high: boolean,
    low: boolean
}

export interface DailyData {
    day: number | null;
    hits: number;
    misses: number;
}

export interface NotificationData {
    lowCD: number;
    highCD: number;
    lastSent: string;
}

export interface TrackingData {
    streak: StreakData;
    grace: GraceData;
    reading: ReadingData;
    daily: DailyData;
    notifications: NotificationData;
}

export const reset: TrackingData = {
  "streak": {
    "streak": true,
    "duration": 0
  },
  "grace": {
    "grace": false,
    "period": 60
  },
  "reading": {
    "timestamp": null,
    "value": 0,
    'inBounds': false,
    "high": false,
    "low": false
  },
  "daily": {
    "day": null,
    "hits": 0,
    "misses": 0
  },
  "notifications": {
    "lowCD": 0,
    "highCD": 0,
    "lastSent": ""
  }
}
