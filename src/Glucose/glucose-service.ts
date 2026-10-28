import { GlucoseProvider } from "./glucose-provider.js";
import type { GlucoseReading } from "./glucose.types.ts";

export class GlucoseService {

  constructor(
    private provider: GlucoseProvider
  ) {}

  async getLatestReading(): Promise<GlucoseReading> {

    const {value, timestamp, unit} = await this.provider.getReading();

    return {value, timestamp, unit}
  }

}