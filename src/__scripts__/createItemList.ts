import { parseFile } from "fast-csv";
import * as fs from "fs";

// eslint-disable-next-line
// @ts-ignore
import nfzf from "node-fzf";
import { MCItem } from "../types/MCNodes";

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
        if (row[0] && row[1]) {
          rows.push({
            source: row[0],
            target: row[1],
            weight: Number(row[2]),
          });
        }
      })
      .on("end", () => {
        resolve(rows);
      });
  });
}

async function getFilenames() {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir("public/item_images", (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

function titleCase(name: string) {
  const str = name.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

async function buildItems(filenames: string[], ids: string[]) {
  const items: MCItem[] = [];

  for (let i = 0; i < ids.length; i++) {
    let prefill = ids[i]
      .replace("minecraft:", "")
      .replace("item.", "")
      .replaceAll(":", "");

    const opts = {
      list: filenames,
      mode: "fuzzy",
      prefill: prefill,
    };

    if (prefill.includes("stripped")) {
      prefill = "";
    }

    console.clear();
    console.log(ids[i] + "?: ");

    // if (cache[ids[i]]) {
    //   const value = cache[ids[i]] as string;
    //   items.push({
    //     itemId: ids[i],
    //     title: titleCase(value.replaceAll(".png", "").replaceAll("_", " ")),
    //     imageUrl: cache[ids[i]],
    //   });
    if (filenames.includes(prefill + ".png")) {
      items.push({
        imageUrl: prefill + ".png",
        itemId: ids[i],
        title: titleCase(prefill.replaceAll("_", " ")),
      });
    } else {
      const result = await nfzf(opts);
      if (result.input && result.input === "exit") {
        break;
      }

      if (!result.selected) {
        continue;
      }

      if (result.selected.value) {
        const value = result.selected.value as string;
        items.push({
          itemId: ids[i],
          imageUrl: result.selected.value,
          title: titleCase(value.replaceAll(".png", "").replaceAll("_", " ")),
        });
      }
    }
  }

  // await saveCache(cache);
  return items;
}

// Writes files to a json file
function saveItems(items: MCItem[]) {
  const file = fs.createWriteStream("src/hardcoded/items.json");
  file.write(JSON.stringify(items));
}

const rowPromise = parseCsv();
const filenamesPromise = getFilenames();

const [rows, filenames] = await Promise.all([rowPromise, filenamesPromise]);

const ids = new Set<string>();

rows.forEach((row) => {
  if (!row.source.startsWith("r_")) {
    ids.add(row.source);
  }

  if (!row.target.startsWith("r_")) {
    ids.add(row.target);
  }
});

const items = await buildItems(filenames, Array.from(ids));
console.log(items);
saveItems(items);

export { parseCsv, getFilenames, buildItems, saveItems };
