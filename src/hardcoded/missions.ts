import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  // Tutorial
  {
    title: "Unit 1, Lesson 2",
    tasks: [
      {
        id: "u1l2-planks",
        description: "Produce 8 oak planks per hour",
        itemRequirements: [
          {
            itemId: "minecraft:oak_planks",
            perHour: 8,
          },
        ],
      },
      {
        id: "u1l2-sticks",
        description: "Produce 32 sticks per hour",
        itemRequirements: [
          {
            itemId: "item.minecraft:stick",
            perHour: 32,
          },
        ],
      },
      {
        id: "u1l2-diamond-axe",
        description: "Produce a diamond axe",
        itemRequirements: [
          {
            itemId: "item.minecraft:diamond_axe",
            perHour: 1,
          },
        ],
      },
      {
        id: "u1l2-chest",
        description: "Produce 10 chests per hour",
        itemRequirements: [
          {
            itemId: "minecraft:chest",
            perHour: 10,
          },
        ],
      },
    ],
  },
  {
    title: "Unit 1, Lesson 7",
    tasks: [
      {
        id: "u1l7-planks",
        description: "Produce 10 iron picks per hour",
        itemRequirements: [
          {
            itemId: "item.minecraft:iron_pickaxe",
            perHour: 10,
          },
        ],
      },
      {
        id: "u1l7-sticks",
        description: "Produce 1 furnace",
        itemRequirements: [
          {
            itemId: "minecraft:furnace",
            perHour: 1,
          },
        ],
      },
    ],
  },
  {
    title: "Tutorial",
    tasks: [
      {
        id: "tutorial-resource",
        title: "Resource Node",
        description: "Drag a diamond resource node to the canvas",
        idPool: ["item.minecraft:diamond"],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === "resource" &&
                n.data.item.itemId === "item.minecraft:diamond"
            )
          );
        },
      },
      {
        id: "tutorial-delete",
        title: "Deleting nodes",
        description:
          "Click on the resource node and use the backspace key to delete it (will update when i make button)",
        idPool: ["item.minecraft:diamond"],
        stateRequirement: (state) => {
          return !state.nodes.some(
            (n) =>
              n.data.dataType === "resource" &&
              n.data.item.itemId === "item.minecraft:diamond"
          );
        },
      },
      {
        id: "tutorial-recipe",
        title: "Recipe Node",
        description: "Pause here",
      },
    ],
  },

  {
    title: "Create Furnaces (Demo Task)",
    tasks: [
      {
        title: "Create Furnaces",
        description:
          "We need furnaces! We need at least 8 new furnaces per hour.",
        id: "test-1",
        itemRequirements: [
          {
            itemId: "minecraft:furnace",
            perHour: 8,
          },
        ],
      },
    ],
  },

  {
    title: "Enchantment Setup (Demo Task)",
    tasks: [
      {
        title: "Create Enchantment Table and Bookshelves",
        id: "test-2",
        itemRequirements: [
          {
            itemId: "minecraft:enchanting_table",
            perHour: 1,
          },
          {
            itemId: "minecraft:bookshelf",
            perHour: 4,
          },
        ],
      },
    ],
  },
];
