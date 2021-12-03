import color from "ansi-colors";
import { Command } from "commander";
import { ISolution } from "./solutions/solution";
import * as path from "path";

const program = new Command();

program
  .command("execute <dayandpart>")
  .option("-s, --sample-data", undefined, false)
  .description(
    "Executes the solution logic for a given day and part (ie 1a or 5b)"
  )
  .action(async (dayandpart, cmdObj) => {
    try {
      await execute(dayandpart, cmdObj["sampleData"]);
    } catch (e) {
      console.log((e as Error).message);
    }
  });

program.parse(process.argv);

async function execute(
  dayandpart: string,
  useSampleData: boolean
): Promise<void> {
  dayandpart = dayandpart.replace(/'/g, "");
  const day = dayandpart.substr(0, dayandpart.length - 1);
  const part: "GetSolutionA" | "GetSolutionB" =
    dayandpart.substr(dayandpart.length - 1).toUpperCase() === "A"
      ? "GetSolutionA"
      : "GetSolutionB";
  const solutionPath = `./solutions/${day}/index`;
  const inputFile = path.join(
    __dirname,
    `solutions/${day}`,
    useSampleData ? "sample-input.txt" : "input.txt"
  );

  console.log(`Loading ${dayandpart} from ${solutionPath}...`);

  let solution: ISolution;
  try {
    const solutionClass = await import(solutionPath);
    solution = new solutionClass.default() as ISolution;
  } catch (e) {
    throw Error(`Error trying to load ${dayandpart}. ${(e as Error).message}`);
  }

  console.log(`Running ${dayandpart}...`);

  const start = +new Date();
  let results: string;
  try {
    results = await solution[part](inputFile);
  } catch (e) {
    console.error(color.red((e as Error).toString()));
    return;
  }
  const timeElapsed = +new Date() - start;
  console.log(
    `Result: ${color.bgBlue(color.whiteBright(results))} (${timeElapsed} ms)`
  );
}
