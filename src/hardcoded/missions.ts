import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  {
    title: "Tutorial",
    tasks: [
      {
        id: "tut-1",
        itemRequirements: [
          {
            itemId: "minecraft:spruce_log",
            perHour: 432,
          },
        ],
      },
    ],
  },
];
