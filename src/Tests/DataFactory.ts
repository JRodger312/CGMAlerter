import type { Reading } from "../Glucose/glucose.types.js";
import type { TrackingData } from "../Database/db.types.js";
import { reset } from "../Database/db.types.js";

type TrackingDataOverrides = {
    [K in keyof TrackingData]?: Partial<TrackingData[K]>;
};

export class TestDataFactory {

    testReading(
        value: number = 100,
        timestamp?: Date
    ): Reading {
        return {
            timestamp: timestamp? timestamp : new Date(),
            value
        };
    }

    testReadings(
        value: number = 100,
        count: number = 1,
        timestamp?: Date
    ): Reading[] {
        let testReadings = [];
        for(let i = 0; i < count; i++){
            testReadings.push({
                timestamp: timestamp? timestamp : new Date(),
                value: value
            })
        }
        return testReadings;
    }

    testTracking(
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