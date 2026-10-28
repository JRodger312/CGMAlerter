import { readFile, writeFile } from "node:fs/promises";

export class JSONUtils<T extends object> {
  constructor(private filePath: string) {}

  // Read JSON file and convert it to an object
  async read(): Promise<T> {
    const data = await readFile(this.filePath, "utf-8");
    return JSON.parse(data) as T;
  }

  // Write an object to the JSON file
  async write(data: T): Promise<void> {
    await writeFile(
      this.filePath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  }

  // Update specific properties in the JSON file
  async update(updates: Partial<T>): Promise<T> {
    const currentData = await this.read();

    const updatedData = {
      ...currentData,
      ...updates
    } as T;

    await this.write(updatedData);

    return updatedData;
  }

  async reset(data: T): Promise<void> {
    await this.write(data);
  }
}