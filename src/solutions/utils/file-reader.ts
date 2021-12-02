import * as fs from "fs";
import * as readline from "readline";

export default class FileReader {
  constructor(private lineProcessor: (str: string) => void) {}

  public async processFile(filePath: string): Promise<void> {
    const fileStream = fs.createReadStream(filePath);

    const linereader = readline.createInterface({
      crlfDelay: Infinity,
      input: fileStream,
    });

    for await (const line of linereader) {
      this.lineProcessor(line);
    }
  }
}

export function processFile(
  file: string,
  lineProcessor: (str: string) => void
): Promise<void> {
  const reader = new FileReader(lineProcessor);
  return reader.processFile(file);
}
