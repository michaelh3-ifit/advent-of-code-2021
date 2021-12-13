import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const scoreMap: { [char: string]: number } = {
      ")": 3,
      "]": 57,
      "}": 1197,
      ">": 25137,
    };

    return data
      .map(this.getFirstCorruptCharacter)
      .reduce((acc, curr) => acc + (curr !== null ? scoreMap[curr] : 0), 0)
      .toString();
  }
  private getFirstCorruptCharacter(input: string): string | null {
    const map: { [char: string]: string } = {
      "[": "]",
      "{": "}",
      "(": ")",
      "<": ">",
    };
    const stack: string[] = [];
    for (const char of input) {
      if (!map[char]) {
        if (stack.pop() !== char) {
          return char;
        }
      } else {
        stack.push(map[char]);
      }
    }
    return null;
  }
  private getClosingString(input: string): string | null {
    const map: { [char: string]: string } = {
      "[": "]",
      "{": "}",
      "(": ")",
      "<": ">",
    };
    const stack: string[] = [];
    for (const char of input) {
      if (map[char]) {
        stack.push(map[char]);
      } else if (stack.pop() !== char) {
        return null;
      }
    }
    let result = "";
    while (stack.length) {
      result += stack.pop();
    }
    return result;
  }
  private getScoreForString(input: string): number {
    const scoreMap: { [char: string]: number } = {
      ")": 1,
      "]": 2,
      "}": 3,
      ">": 4,
    };
    let score = 0;
    for (const char of input) {
      score *= 5;
      score += scoreMap[char];
    }
    return score;
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const closingStringsScores = data
      .map(this.getClosingString)
      .filter((str) => str !== null)
      .map((str) => this.getScoreForString(str!));
    closingStringsScores.sort((a, b) => a - b);
    return closingStringsScores[
      Math.floor(closingStringsScores.length / 2)
    ].toString();
  }
}
