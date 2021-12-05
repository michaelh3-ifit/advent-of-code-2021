import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

interface INode {
  value: string;
  next: INode | null;
}
export default class Solution implements ISolution {
  async GetSolutionA(inputFile: string): Promise<string> {
    let input = "";
    const data: { [pair: string]: string } = {};
    await processFile(inputFile, (line) => {
      if (!input) {
        input = line;
        return;
      }
      if (!line.trim()) {
        return;
      }
      const split = line.split(" -> ");
      data[split[0]] = split[1];
    });
    // convert input into linked list
    const headNode: INode = { value: "", next: null }
    let currNode: INode = headNode;
    for (const char of input) {
      currNode.next = { value: char, next: null };
      currNode = currNode.next;
    }
    for (let i = 0; i < 10; i++) {
      currNode = headNode.next!;
      while (currNode.next) {
        const match = data[currNode.value + currNode.next.value];
        if (match) {
          const newNode = { value: match, next: currNode.next };
          currNode.next = newNode;
          currNode = currNode.next; // Moving forward an extra node to skip the newly added character
        }
        currNode = currNode.next!;
      }
    }
    currNode = headNode.next!;
    const counts: { [char: string]: number } = {};
    while (currNode) {
      counts[currNode.value] = (counts[currNode.value] || 0) + 1;
      currNode = currNode.next!;
    }
    const values = Object.values(counts);
    values.sort((a, b) => b - a);
    return (values[0] - values[values.length - 1]).toString();
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    let input = "";
    const data: { [pair: string]: string[] } = {};
    await processFile(inputFile, (line) => {
      if (!input) {
        input = line;
        return;
      }
      if (!line.trim()) {
        return;
      }
      const split = line.split(" -> ");
      data[split[0]] = [split[0][0] + split[1], split[1] + split[0][1]];
    });
    // convert input to a hashmap of pairs to the count of that pair in the string
    const inputMap: { [pair: string]: bigint } = {};
    for (let i = 0; i < input.length - 1; i++) {
      const pair = input.substring(i, i + 2);
      if (!inputMap[pair]) {
        inputMap[pair] = 0n;
      }
      inputMap[pair]++;
    }

    for (let i = 0; i < 40; i++) {
      const pairsToAdd: { [pair: string]: bigint } = {}
      // go through all of the 'polymer insertion rules' and see what pairs need to be added
      for (const pair of Object.keys(data)) {
        if (inputMap[pair]) {
          if (!pairsToAdd[data[pair][0]]) {
            pairsToAdd[data[pair][0]] = 0n;
          }
          if (!pairsToAdd[data[pair][1]]) {
            pairsToAdd[data[pair][1]] = 0n;
          }
          pairsToAdd[data[pair][0]] += inputMap[pair];
          pairsToAdd[data[pair][1]] += inputMap[pair];
          inputMap[pair] = 0n;
        }
      }
      // add the new pairs to the input map
      for (const pair of Object.keys(pairsToAdd)) {
        if (!inputMap[pair]) {
          inputMap[pair] = 0n;
        }
        inputMap[pair] += pairsToAdd[pair];
      }
    }

    const counts: { [char: string]: bigint } = {};
    // convert the input map to a count of the characters
    // keeping in mind that all chars are double counted (except for the first and last)
    for (const pair of Object.keys(inputMap)) {
      if (!counts[pair[0]]) counts[pair[0]] = 0n;
      if (!counts[pair[1]]) counts[pair[1]] = 0n;
      counts[pair[0]] += inputMap[pair];
      counts[pair[1]] += inputMap[pair];
    }
    counts[input[0]]+= 1n;
    counts[input[input.length - 1]]+= 1n;

    const values = Object.values(counts).map((c) => c/2n);
    values.sort((a, b) => Number(b - a));
    return (values[0] - values[values.length - 1]).toString();
  }
}
