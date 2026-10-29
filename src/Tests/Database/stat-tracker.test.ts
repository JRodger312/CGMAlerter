import { describe, it, expect } from "@jest/globals";

import { StatTracker } from "../../Database/stat-tracker.js";

describe("StatTracker", () => {

    const tracker = new StatTracker();

    it("should identify an in-range glucose reading", () => {
        const reading = {
            timestamp: new Date(),
            value: 120,
        };

        const result = tracker.isInBounds(reading);

        expect(result).toBe(true);
    });

    it("should identify an out-of-range glucose reading", () => {
        const reading = {
            timestamp: new Date(),
            value: 250,
        };

        const result = tracker.isInBounds(reading);

        expect(result).toBe(false);
    });

    it("should identify a critically low reading", () => {
        const reading = {
            timestamp: new Date(),
            value: 50,
        };

        expect(tracker.isLow(reading)).toBe(true);
    });

});