import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  // {
  //   title: "Tutorial",
  //   idPool: ["minecraft:cobblestone", "minecraft:furnace"],
  //   tasks: [
  //     {
  //       id: "tut-1",
  //       title: "Get cobblestone",
  //       description: "Drag a cobblestone resource to the canvas",
  //       nodeRequirements: [
  //         {
  //           nodeType: MCNodeType.resource,
  //           amount: 1,
  //         },
  //       ],
  //
  //       idPool: "inherit",
  //     },
  //
  //     {
  //       id: "tut-2",
  //       description: "Drag a furnace crafter to the canvas",
  //       nodeRequirements: [
  //         {
  //           amount: 1,
  //           nodeType: MCNodeType.crafter,
  //         },
  //       ],
  //       idPool: "inherit",
  //     },
  //
  //     {
  //       id: "tut-3",
  //       description: "Connect the cobblestone resource to the furnace",
  //       itemRequirements: [
  //         {
  //           itemId: "minecraft:furnace",
  //           perHour: 1,
  //         },
  //       ],
  //       idPool: "inherit",
  //     },
  //   ],
  // },

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
];
