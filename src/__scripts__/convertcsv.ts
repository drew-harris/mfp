import { parseFile } from "fast-csv";

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

const rows = await parseCsv();

const ids = new Set<string>();

rows.forEach((row) => {
  if (!row.source.startsWith("r_")) {
    ids.add(row.source);
  }

  if (!row.target.startsWith("r_")) {
    ids.add(row.target);
  }
});

console.log(ids);
console.log(ids.size);

export {};
