import { LibreLinkClient } from "libre-link-unofficial-api";
import type { Reading } from "./glucose.types.ts";

export class GlucoseProvider {
  
  async getReading(): Promise<Reading> {
    const email = process.env.LIBRE_EMAIL;
    const password = process.env.LIBRE_PASSWORD;

    if (!email || !password) {
      throw new Error("LibreLink credentials are not configured");
    }

    const client = new LibreLinkClient({
      email,
      password,
      lluVersion: "4.16.0"
    });

    await client.login();

    const reading = await client.read();

    return {
      timestamp: new Date(reading._raw.Timestamp),
      value: reading._raw.ValueInMgPerDl,
      unit: "mg/dL"
    };
  }
}