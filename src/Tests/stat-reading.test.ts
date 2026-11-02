import { describe, it, expect } from "@jest/globals";

import { StatTracker } from "../Database/StatTracker.js";
import { TestDataFactory } from "./DataFactory.js";

describe("StatTracker-Readings", () => {

    const tracker = new StatTracker();
    const {testReading, testTracking} = new TestDataFactory();

    it("should identify an in-range glucose reading", () => {
        const reading = testReading();

        const result = tracker.isInBounds(reading);

        expect(result).toBe(true);
    });

    it("should identify an out-of-range glucose reading", () => {
        const reading = testReading(
            200
        );

        const result = tracker.isInBounds(reading);

        expect(result).toBe(false);
    });

    it("should identify a critically low reading", () => {
        const reading = testReading(
            50
        );

        expect(tracker.isLow(reading)).toBe(true);
    });

    it("should identify a critically high reading", () => {
        const reading = testReading(
            301
        );
        expect(tracker.isHigh(reading)).toBe(true);
    })
});
