import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

function isNumber(data: unknown): data is number {
  return typeof data === "number";
}
function assertIsNumber(num: unknown): asserts num is number {
  if (!isNumber(num)) {
    throw new Error("Assert failed. Not a number.");
  }
}
export default class Solution implements ISolution {
  private stringToArray(data: string): (string | number)[] {
    const input: (string | number)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (isNaN(Number(data[i]))) {
        input.push(data[i]);
        continue;
      }
      let numLength = 1;
      while (!isNaN(Number(data.substring(i, i + numLength)))) {
        numLength++;
      }
      input.push(Number(data.substring(i, i + numLength - 1)));
      i += numLength - 2;
    }
    return input;
  }
  private explode(input: (string | number)[]): boolean {
    let depth = 0;
    let prevNumIndex = -1;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === "[") {
        depth++;
      } else if (char === "]") {
        depth--;
      } else if (depth > 4 && isNumber(char) && isNumber(input[i + 2])) {
        // hit a pair nested inside 4 pairs, explode them

        // if there's a previous number, add the left value into it
        if (prevNumIndex >= 0) {
          const prevNum = input[prevNumIndex];
          assertIsNumber(prevNum);
          input[prevNumIndex] = char + prevNum;
        }
        // add right value to the next number found (if there is one)
        const rightNum = input[i + 2];
        assertIsNumber(rightNum);
        const numberToAdd = rightNum;
        for (let j = i + 3; j < input.length; j++) {
          if (isNumber(input[j])) {
            const prevNum = input[j];
            assertIsNumber(prevNum);
            input[j] = numberToAdd + prevNum;
            break;
          }
        }
        // replace pair with 0
        input.splice(i - 1, 5, 0);
        i -= 1;
        return true;
      } else if (isNumber(char)) {
        prevNumIndex = i;
      }
    }
    return false;
  }
  private split(input: (string | number)[]): boolean {
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (isNumber(char) && char >= 10) {
        input.splice(
          i,
          1,
          ...["[", Math.floor(char / 2), ",", Math.ceil(char / 2), "]"]
        );
        return true;
      }
    }

    return false;
  }
  private add(left: (string | number)[], right: (string | number)[]): (string | number)[] {
    const input = ["[", ...left, ",", ...right, "]"];
    let changed = true;
    while (changed) {
      changed = this.explode(input) || this.split(input);
    }
    return input;
  }
  private getMagnitude(input: (string | number)[]): number {
    const reg = /\[(\d+),(\d+)\]/;
    let inputStr = input.join("");
    let result: RegExpExecArray | null;
    while ((result = reg.exec(inputStr))) {
      const newNumber = Number(result[1]) * 3 + Number(result[2]) * 2;
      inputStr = inputStr.replace(result[0], newNumber.toString());
    }
    const magnitude = Number(inputStr);
    return magnitude;
  }
  async GetSolutionA(inputFile: string): Promise<string> {
    let data: (string | number)[] = [];
    await processFile(inputFile, (line) => {
      if (data.length === 0) {
        data = this.stringToArray(line);
      } else {
        data = this.add(data, this.stringToArray(line));
      }
    });
    return this.getMagnitude(data).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: (string | number)[][] = [];
    await processFile(inputFile, (line) => {
      data.push(this.stringToArray(line));
    });
    let largest = Number.MIN_SAFE_INTEGER;
    for (let ia = 0; ia < data.length; ia++) {
      for (let ib = 0; ib < data.length; ib++) {
        if (ia === ib) {
          continue;
        }
        largest = Math.max(
          this.getMagnitude(this.add(data[ia], data[ib])),
          largest
        );
      }
    }
    return largest.toString();
  }
}
