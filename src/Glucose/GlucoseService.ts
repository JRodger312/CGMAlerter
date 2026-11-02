import { GlucoseProvider } from "./GlucoseProvider.js";
import type { Reading } from "./glucose.types.js";

export class GlucoseService {

  constructor(
    private provider: GlucoseProvider
  ) {}

  async getLatestReading(): Promise<Reading> {

    const {value, timestamp} = await this.provider.getReading();

    return {value, timestamp}
  }
}
