import { MCNodeType } from "../types/MCNodes";
import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  {
    id: "tutorial",
    title: "Tutorial",
    completeMessage: "Well done! You completed the tutorial!",
    tasks: [
      {
        id: "tutorial-resource",
        title: "Resource Node",
        description: "Drag a diamond resource node to the canvas.",
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
        id: "tutorial-resource-desc",
        title: "Resource Node",
        description:
          "This is a resource node. It represents an infinite supply of a basic item needed for crafting.\n\nYou can" +
          " adjust the output amount by entering a number into its input box.",
        idPool: ["item.minecraft:diamond"],
        continuation: true,
      },
      {
        id: "tutorial-delete",
        title: "Deleting Nodes",
        description:
          "Delete the resource node.\n\nTo do this, click the node to select it. Then, click the trash can button" +
          " in the bottom right or press the backspace key to delete it.",
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
        title: "Crafter Node",
        description:
          "Crafter nodes create new items by using resources. In this example, we will craft a furnace using 8" +
          " cobblestone.\n\nDrag the furnace crafter node to the canvas.",
        idPool: ["minecraft:furnace"],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some((n) => n.data.dataType === MCNodeType.crafter)
          );
        },
      },
      {
        id: "tutorial-recipe-multiple",
        title: "Crafter Node",
        description:
          "Some items can be crafted from different resources by using different crafting recipes. You can change" +
          " the recipe by clicking the arrows at the top of the node.\n\nFor now, just use the cobblestone recipe.",
        idPool: ["minecraft:furnace"],
        continuation: true,
      },
      {
        id: "tutorial-recipe-bring-in",
        title: "Connecting Nodes",
        description: "Drag a cobblestone node to the canvas.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === MCNodeType.resource &&
                n.data.item.itemId === "minecraft:cobblestone"
            )
          );
        },
      },
      {
        id: "tutorial-recipe-connect",
        title: "Connecting Nodes",
        description:
          "Find the circle icon on the right side of the resource node. This is the resource node's output.\n\n" +
          "Then, find the circle icon on the left side of the crafter node. This is the crafter node's input.\n\n" +
          "Click and drag the output of the resource node to the input of the crafter node.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.edges.some(
              (n) => (n.data.item.itemId === "minecraft:cobblestone")
            )
          );
        },
      },
      {
        id: "tutorial-recipe-connect",
        title: "Adjusting the Rate",
        description:
          "Try adjusting the rate of cobblestone in the resource node by in a number.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.edges.some(
              (n) => (n.data.item.itemId === "minecraft:cobblestone" && n.data.outputRate)
            )
          );
        },
      },
      {
        id: "tutorial-info-mode",
        title: "Info Mode",
        description:
          "Info mode shows the flow of items on the canvas and other additional details. You can turn it on by " +
          "clicking the \"Info Mode\" button at the top left of the canvas.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-edge-delete",
        title: "Deleting Edges",
        description:
          "Now, let's modify our factory plan to craft cobblestone slabs.\n\nLet's start by selecting and deleting " +
          "the path between the nodes.\n\nRemember that you can delete nodes using the backspace key or the trash " +
          "can button in the bottom right.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return state.edges.length === 0;
        },
      },
      {
        id: "tutorial-splitter-delete",
        title: "Splitter Node",
        description:
          "Drag the splitter node to the canvas and place it between the two nodes.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.nodes.some((n) => n.data.dataType === MCNodeType.splitter)
          );
        },
      },
      {
        id: "tutorial-splitter-crafter",
        title: "Splitter Node",
        description: "Drag the cobblestone slab crafter to the canvas and place it under the furnace crafter.",
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        stateRequirement(state) {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === MCNodeType.crafter &&
                n.data.item.itemId === "minecraft:cobblestone_slab"
            )
          );
        },
      },
      {
        id: "tutorial-splitter-connect",
        title: "Splitter Node",
        description:
          "You can use the input box of the splitter node to adjust the ratio of items that the outputs receive. For" +
          " example, the splitting pattern \"AAABB\" will allocate three cobblestone to output \"A\" for every two" +
          " cobblestone given to output \"B\".\n\nEnter the splitting pattern into the splitter node and connect all" +
          " 4 nodes.",
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        stateRequirement(state) {
          return state.edges.length === 3 && state.nodes.some(
            (n) =>
              n.data.dataType === MCNodeType.crafter &&
              n.data.item.itemId === "minecraft:cobblestone_slab"
          ) && state.nodes.some(
            (n) =>
              n.data.dataType === MCNodeType.crafter &&
              n.data.item.itemId === "minecraft:furnace"
          );
        },
      },
      {
        id: "tutorial-splitter-order",
        title: "Order Node",
        description:
          "An order node shows the amount of items your factory plan should make.",
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        continuation: true,
      },
      {
        id: "tutorial-splitter-finish",
        title: "Order Node",
        description:
          "Drag the order node below to" +
          " the canvas and connect it to the crafter nodes. Adjust the resource rate and the splitting pattern until" +
          " the Xs on the order node change to check marks. Then click the submit button to complete the tutorial.",
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        itemRequirements: [
          {
            rate: 1,
            itemId: "minecraft:furnace",
          },
          {
            rate: 8,
            itemId: "minecraft:cobblestone_slab",
          },
        ],
      },
    ],
  },
  {
    title: "Unit 1, Lesson 2",
    id: "u1l2",
    tasks: [
      {
        id: "u1l2-planks",
        title: "Planks",
        description: "Produce 8 oak planks per minute",
        itemRequirements: [
          {
            itemId: "minecraft:oak_planks",
            rate: 8,
          },
        ],
      },
      {
        id: "u1l2-stick",
        title: "Sticks",
        description: "Produce 32 sticks per minute",
        itemRequirements: [
          {
            itemId: "item.minecraft:stick",
            rate: 32,
          },
        ],
      },
      {
        id: "u1l2-diamond-axe",
        title: "Diamond Axe",
        description: "Produce 1 diamond axe per minute",
        itemRequirements: [
          {
            itemId: "item.minecraft:diamond_axe",
            rate: 1,
          },
        ],
      },
      {
        id: "u1l2-chest",
        title: "Chests",
        description: "Produce 10 chests per minute",
        itemRequirements: [
          {
            itemId: "minecraft:chest",
            rate: 10,
          },
        ],
      },
    ],
  },
  {
    title: "Unit 1, Lesson 7",
    id: "u1l7",
    tasks: [
      {
        id: "u1l7-iron-pickaxe",
        title: "Iron Pickaxe",
        description: "Produce 10 iron pickaxes per minute",
        itemRequirements: [
          {
            itemId: "item.minecraft:iron_pickaxe",
            rate: 10,
          },
        ],
      },
      {
        id: "u1l7-furnace",
        title: "Furnace",
        description: "Produce 1 furnace",
        itemRequirements: [
          {
            itemId: "minecraft:furnace",
            rate: 1,
          },
        ],
      },
    ],
  },

  {
    title: "Unit 2, Lesson 3",
    id: "u2l3",
    tasks: [
      {
        id: "u2l3-o1",
        title: "First Order",
        description: "Produce 14 crafting tables and 24 ladders per minute.",
        itemRequirements: [
          {
            itemId: "minecraft:crafting_table",
            rate: 14,
          },
          {
            itemId: "minecraft:ladder",
            rate: 24,
          },
        ],
      },
      {
        id: "u2l3-o2",
        title: "Second Order",
        description: "Produce 5 chests, and 15 oak signs per minute",
        itemRequirements: [
          {
            itemId: "minecraft:chest",
            rate: 5,
          },
          {
            itemId: "item.minecraft:oak_sign",
            rate: 15,
          },
        ],
      },
      {
        id: "u2l3-o3",
        title: "Third Order",
        description: "Produce 48 oak fences and 8 fence gates per minute.",
        itemRequirements: [
          {
            itemId: "minecraft:oak_fence",
            rate: 48,
          },
          {
            itemId: "minecraft:fence_gate",
            rate: 8,
          },
        ],
      },
      {
        id: "u2l3-o4",
        title: "Fourth Order",
        description: "Produce 48 oak fences and 8 fence gates per minute.",
        itemRequirements: [
          {
            itemId: "item.minecraft:wooden_axe",
            rate: 30,
          },
          {
            itemId: "item.minecraft:wooden_shovel",
            rate: 30,
          },
          {
            itemId: "item.minecraft:wooden_pickaxe",
            rate: 30,
          },
        ],
      },
    ],
  },
  // {
  //   title: "test",
  //   id: "test",
  //   tasks: [
  //     {
  //       id: "test-1",
  //       title: "Create Nether Brick",
  //       itemRequirements: [
  //         {
  //           itemId: "item.minecraft:netherbrick",
  //           perHour: 8,
  //         },
  //         // {
  //         //   itemId: "item.minecraft:quartz",
  //         //   perHour: 8,
  //         // },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   title: "Enchantment Setup (Demo Task)",
  //   tasks: [
  //     {
  //       title: "Create Enchantment Table and Bookshelves",
  //       id: "test-2",
  //       itemRequirements: [
  //         {
  //           itemId: "minecraft:enchanting_table",
  //           perHour: 1,
  //         },
  //         {
  //           itemId: "minecraft:bookshelf",
  //           perHour: 4,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
