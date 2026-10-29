import type { Reading } from "../Glucose/glucose.types.js";
import type { TrackingData } from "../Database/db.types.js";
import { reset } from "../Database/db.types.js";

type TrackingDataOverrides = {
    [K in keyof TrackingData]?: Partial<TrackingData[K]>;
};

export class TestDataFactory {

    createGlucose(
        timestamp: Date = new Date("2026-01-01T12:00:00Z"),
        value: number = 100
    ): Reading {
        return {
            timestamp,
            value,
        };
    }

    createTrackingData(
        overrides: TrackingDataOverrides = {}
    ): TrackingData {
        const defaults = structuredClone(reset);

        return {
            reading: {
                ...defaults.reading,
                ...overrides.reading
            },
            streak: {
                ...defaults.streak,
                ...overrides.streak
            },
            grace: {
                ...defaults.grace,
                ...overrides.grace
            },
            daily: {
                ...defaults.daily,
                ...overrides.daily
            },
            notifications: {
                ...defaults.notifications,
                ...overrides.notifications
            }
        };
    }
}