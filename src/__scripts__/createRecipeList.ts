import { parseFile } from "fast-csv";
import * as fsprom from "node:fs/promises";
import { Recipe } from "../types/MCNodes";

interface Row {
  source: string;
  target: string;
  weight: number;
}

async function parseCsv(): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const rows: Row[] = [];
    parseFile("src/hardcoded/edge_sheet.csv", {
      delimiter: ";",
    })
      .on("error", (error) => reject(error))
      .on("data", (row: string[]) => {
        rows.push({
          source: row[0],
          target: row[1],
          weight: Number(row[2]),
        });
      })
      .on("end", () => {
        resolve(rows);
      });
  });
}

async function saveRecipes(recipes: Recipe[], path: string) {
  await fsprom.writeFile(path, JSON.stringify(recipes));
}

async function main() {
  const rows = await parseCsv();

  const recipes: Recipe[] = [];
  const recipeIds = new Set<string>();

  for (const row of rows) {
    if (row.source.startsWith("r_")) recipeIds.add(row.source);
    if (row.target.startsWith("r_")) recipeIds.add(row.target);
  }

  for (const id of recipeIds) {
    const outputRows = rows.filter((row) => row.source === id);
    const inputRows = rows.filter((row) => row.target === id);

    const recipe: Recipe = {
      outputAmount: outputRows?.at(0)?.weight || 0,
      outputItemId: outputRows?.at(0)?.target || "",
      inputs: inputRows.map((row) => ({
        amount: -1 * row.weight,
        itemId: row.source,
      })),
    };

    recipes.push(recipe);
  }

  await saveRecipes(recipes, "src/hardcoded/recipes.json");
}

await main();

export {};
