export interface ISolution {
  GetSolutionA(inputFile: string): Promise<string>;
  GetSolutionB(inputFile: string): Promise<string>;
}

// import { ISolution } from "../solution";
// import { processFile } from "../utils/file-reader";

// export default class Solution implements ISolution {
//   async GetSolutionA(inputFile: string): Promise<string> {
//     await processFile(inputFile, line => {
//       throw new Error("Method not implemented.");
//     });

//     throw new Error("Method not implemented.");
//   }
//   async GetSolutionB(inputFile: string): Promise<string> {
//     await processFile(inputFile, line => {
//       throw new Error("Method not implemented.");
//     });

//     throw new Error("Method not implemented.");
//   }
// }
