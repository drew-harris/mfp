import { MCNodeType } from "../types/MCNodes";
import { Task } from "../types/tasks";

export const allTasks: Task[] = [
  {
    title: "Make Some Dirt",
    id: "dirt-1",
    description: `We need some dirt fast!!!!!
      Requires 20 dirt per hour and at least one output node.`,
    itemRequirements: [
      {
        itemId: 2,
        perHour: 20,
      },
      {
        itemId: 3,
        perHour: 40,
      },
      {
        itemId: 4,
        perHour: 10,
      },
      {
        itemId: 1,
        perHour: 25,
      },
    ],

    nodeRequirements: [
      {
        nodeType: MCNodeType.output,
        amount: 1,
      },
    ],
  },
];
