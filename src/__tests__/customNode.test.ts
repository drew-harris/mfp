/* eslint-disable no-undefined */
import { describe, expect, it } from "vitest";
import { MCEdge } from "../types/MCNodes";
import {
  CustomNodeResult,
  _testGetResults,
} from "../components/nodes/CustomNode";

const recipes = [
  {
    item: {
      title: "Orange Dye",
      itemId: "item.minecraft:orange_dye",
      imageUrl: "orange_dye.png",
    },
    inputs: [{ num: 1, itemId: "item.minecraft:orange_dye" }],
  },
  {
    item: {
      title: "Quartz Block",
      itemId: "minecraft:quartz_block",
      imageUrl: "quartz_block.png",
    },
    inputs: [{ num: 4, itemId: "item.minecraft:quartz" }],
  },
  {
    item: {
      title: "Quartz",
      itemId: "item.minecraft:quartz",
      imageUrl: "quartz.png",
    },
    inputs: [{ num: 1, itemId: "item.minecraft:quartz" }],
  },
];

const createItemCount = (id: string, amount: number) => {
  return {
    outputRate: amount,
    item: {
      itemId: id,
      title: id,
      imageUrl: id,
    },
  };
};

describe("works", () => {
  it("denys no input", () => {
    const result = _testGetResults([], recipes);
    expect(result).toEqual([]);
  });

  it("accepts pass through", () => {
    let result = _testGetResults(
      [createItemCount("item.minecraft:quartz", 4)],
      [recipes[2]]
    );
    expect(result).toEqual([
      { amount: 4, itemId: "item.minecraft:quartz" } as CustomNodeResult,
    ]);

    result = _testGetResults(
      [createItemCount("item.minecraft:quartz", 1)],
      [recipes[2]]
    );
    expect(result).toEqual([
      { amount: 1, itemId: "item.minecraft:quartz" } as CustomNodeResult,
    ]);
  });

  it("multiplies output properly", () => {
    const result = _testGetResults(
      [createItemCount("item.minecraft:quartz", 4)],
      [recipes[1]]
    );
    expect(result).toEqual([
      { amount: 1, itemId: "minecraft:quartz_block" } as CustomNodeResult,
    ]);
  });

  it("handles not enough", () => {
    const result = _testGetResults(
      [createItemCount("item.minecraft:quartz", 3)],
      [recipes[1]]
    );
    expect(result).toEqual([]);
  });

  // Dye
  it("has multiple output", () => {
    const result = _testGetResults(
      [createItemCount("item.minecraft:orange_dye", 9)],
      [recipes[0]]
    );
    expect(result).toEqual([
      { amount: 9, itemId: "item.minecraft:orange_dye" } as CustomNodeResult,
    ]);
  });

  it("hanndles multiple recipies", () => {
    const result = _testGetResults(
      [createItemCount("item.minecraft:orange_dye", 9)],
      recipes
    );
    expect(result).toEqual([
      { amount: 9, itemId: "item.minecraft:orange_dye" } as CustomNodeResult,
    ]);
  });

  it("hanndles multiple recipies", () => {
    let result = _testGetResults(
      [
        createItemCount("item.minecraft:orange_dye", 9),
        createItemCount("item.minecraft:quartz", 4),
      ],
      [recipes[0], recipes[1]]
    );
    expect(result).toEqual([
      { amount: 9, itemId: "item.minecraft:orange_dye" } as CustomNodeResult,
      { amount: 1, itemId: "minecraft:quartz_block" } as CustomNodeResult,
    ]);

    result = _testGetResults(
      [
        createItemCount("item.minecraft:orange_dye", 9),
        createItemCount("item.minecraft:quartz", 3),
      ],
      [recipes[0], recipes[1]]
    );
    expect(result).toEqual([
      { amount: 9, itemId: "item.minecraft:orange_dye" } as CustomNodeResult,
      // { amount: 1, itemId: "minecraft:quartz_block" } as CustomNodeResult,
    ]);
  });
});
