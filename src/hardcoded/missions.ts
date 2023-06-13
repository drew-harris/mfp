import { MCNodeType } from "../types/MCNodes";
import { Mission } from "../types/tasks";

export const allMissions: Mission[] = [
  {
    id: "tutorial",
    title: "Tutorial",
    completeMessage: "Well done! You completed the Tutorial",
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
        id: "tutorial-resource-desc",
        title: "Resource Node",
        description:
          "This is a resource node, it represents an infinite supply of a basic item needed for crafting. You can adjust how many are being output by entering in an amount",
        idPool: ["item.minecraft:diamond"],
        continuation: true,
      },
      {
        id: "tutorial-delete",
        title: "Deleting nodes",
        description:
          "Click on the resource node and use the backspace key or the delete icon in the lower right corner to delete it",
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
        title: "Crafting Node",
        description:
          "Crafting nodes are a way to turn a resource into a new item with a crafting recipe. In this example, we will craft a furnace, which requires 9 cobblestone to build, drag the furnace crafting node to the canvas.",
        idPool: ["minecraft:furnace"],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some((n) => n.data.dataType === MCNodeType.crafter)
          );
        },
      },
      {
        id: "tutorial-recipe-multiple",
        title: "Crafting Node",
        description:
          "Notice that you can use the arrows at the top of the crafter to select different recipes, for this tutorial we use recipe 1/3 which uses cobblestone",
        idPool: ["minecraft:furnace"],
        continuation: true,
      },
      {
        id: "tutorial-recipe-bring-in",
        title: "Crafting Node",
        description: "Now, drag a cobblestone resource node to the canvas",
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
        title: "Crafting Node",
        description:
          "Connect the resource node to the crafter by dragging the circle to create a path.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.edges.some(
              (n) => (n.data.item.itemId = "minecraft:cobblestone")
            )
          );
        },
      },
      {
        id: "tutorial-recipe-connect",
        title: "Crafting Node",
        description:
          "Try adjusting the amount of cobblestone in the resource node",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-info-mode",
        title: "Info mode",
        description:
          'In order to see the flow of items on the canvas, we need to use info mode. You can turn it on and off by using the "Info Mode" button at the top of the canvas',
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-info-mode",
        title: "Info mode",
        description:
          'In order to see the flow of items on the canvas, we need to use info mode. You can turn it on and off by using the "Info Mode" button at the top of the canvas',
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-splitter-delete",
        title: "Splitter Node",
        description:
          "We also need to craft some cobblestone slabs. First delete the path between the resource node and the crafter node. Select it with the mouse and use the delete button on the bottom right of the canvas.",
        idPool: ["minecraft:furnace", "minecraft:cobblestone"],
        stateRequirement(state) {
          return state.edges.length === 0;
        },
      },
      {
        id: "tutorial-splitter-delete",
        title: "Splitter Node",
        description:
          "Drag the splitter node to the canvas between the two other nodes.",
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
        description: "Drag the cobblestone slab crafter to the canvas. ",
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
          'You can use the input on the splitter node to adjust the ratio of items that the outputs recieve. For example, "AAB" will allocate twice as many materials to the first output than the second. Enter a splitting pattern (AAB) on the splitter node and connect all 4 nodes.',
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        stateRequirement(state) {
          return state.edges.length === 3;
        },
      },
      {
        id: "tutorial-splitter-finish",
        title: "Splitter Node",
        description:
          "Drag the order node from the right side to the canvas and connect the crafter nodes to complete the tutorial",
        idPool: [
          "minecraft:furnace",
          "minecraft:cobblestone",
          "minecraft:cobblestone_slab",
        ],
        itemRequirements: [
          {
            perHour: 1,
            itemId: "minecraft:furnace",
          },
          {
            perHour: 8,
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
        description: "Produce 8 oak planks per second",
        itemRequirements: [
          {
            itemId: "minecraft:oak_planks",
            perHour: 8,
          },
        ],
      },
      {
        id: "u1l2-sticks",
        description: "Produce 32 sticks per second",
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
        description: "Produce 10 chests per second",
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
    id: "u1l7",
    tasks: [
      {
        id: "u1l7-planks",
        description: "Produce 10 iron picks per second",
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
    title: "Unit 2, Lesson 3",
    id: "u2l3",
    tasks: [
      {
        id: "u2l3-o1",
        title: "First Order",
        itemRequirements: [
          {
            itemId: "minecraft:crafting_table",
            perHour: 5,
          },
          {
            itemId: "minecraft:oak_fence",
            perHour: 42,
          },
          {
            itemId: "minecraft:fence_gate",
            perHour: 10,
          },
          {
            itemId: "item.minecraft:oak_sign",
            perHour: 12,
          },
        ],
      },
      {
        id: "u2l3-o2",
        title: "Second Order",
        itemRequirements: [
          {
            itemId: "item.minecraft:wooden_pickaxe",
            perHour: 20,
          },
          {
            itemId: "minecraft:torch",
            perHour: 20,
          },
          {
            itemId: "minecraft:chest",
            perHour: 5,
          },
        ],
      },
      {
        id: "u2l3-o3",
        title: "Third Order",
        itemRequirements: [
          {
            itemId: "minecraft:oak_stairs",
            perHour: 12,
          },
          {
            itemId: "minecraft:ladder",
            perHour: 24,
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
  //         {
  //           itemId: "item.minecraft:quartz",
  //           perHour: 8,
  //         },
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
