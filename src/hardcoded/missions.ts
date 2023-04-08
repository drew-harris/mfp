import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  // Tutorial
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
