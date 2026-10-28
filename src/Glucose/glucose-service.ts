import { GlucoseProvider } from "./glucose-provider.js";
import type { Reading } from "./glucose.types.ts";

export class GlucoseService {

  constructor(
    private provider: GlucoseProvider
  ) {}

  async getLatestReading(): Promise<Reading> {

    const {value, timestamp} = await this.provider.getReading();

    return {value, timestamp}
  }

}