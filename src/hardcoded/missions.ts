import { MCNodeType } from "../types/MCNodes";
import { Mission } from "../types/tasks";
import { getNodeById } from "../utils/nodes";

export const allMissions: Mission[] = [
  {
    title: "Tutorial: Beginner",
    id: "tutorial",
    completeMessage: "Well done! You completed the beginner tutorial!",
    tasks: [
      {
        id: "tutorial-resource",
        title: "Resource Node",
        description: "Drag a diamond resource node to the canvas.",
        idPool: ["diamond"],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === "resource" &&
                n.data.item.itemId === "diamond"
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
        idPool: ["diamond"],
        continuation: true,
      },
      {
        id: "tutorial-delete",
        title: "Deleting Nodes",
        description:
          "Delete the resource node.\n\nTo do this, click the node to select it. Then, click the trash can button" +
          " in the bottom right or press the backspace key to delete it.",
        idPool: ["diamond"],
        stateRequirement: (state) => {
          return !state.nodes.some(
            (n) =>
              n.data.dataType === "resource" &&
              n.data.item.itemId === "diamond"
          );
        },
      },
      {
        id: "tutorial-recipe",
        title: "Crafter Node",
        description:
          "Crafter nodes create new items by using resources. In this example, we will craft a furnace using 8" +
          " cobblestone.\n\nDrag the furnace crafter node to the canvas.",
        idPool: ["furnace"],
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
        idPool: ["furnace"],
        continuation: true,
      },
      {
        id: "tutorial-recipe-bring-in",
        title: "Connecting Nodes",
        description: "Drag a cobblestone node to the canvas.",
        idPool: ["furnace", "cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === MCNodeType.resource &&
                n.data.item.itemId === "cobblestone"
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
        idPool: ["furnace", "cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.edges.some(
              (n) => (n.data.item.itemId === "cobblestone")
            )
          );
        },
      },
      {
        id: "tutorial-recipe-connect",
        title: "Adjusting the Rate",
        description:
          "Try adjusting the rate of cobblestone in the resource node by entering a number.",
        idPool: ["furnace", "cobblestone"],
        stateRequirement(state) {
          return Boolean(
            state.edges.some(
              (n) => (n.data.item.itemId === "cobblestone" && n.data.outputRate)
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
        idPool: ["furnace", "cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-edge-delete",
        title: "Deleting Edges",
        description:
          "Now, let's modify our factory plan to craft cobblestone slabs.\n\nStart by clicking and deleting " +
          "the path between the nodes.\n\nRemember that you can delete nodes using the backspace key or the trash " +
          "can button in the bottom right.",
        idPool: ["furnace", "cobblestone"],
        stateRequirement(state) {
          return state.edges.length === 0;
        },
      },
      {
        id: "tutorial-splitter-delete",
        title: "Splitter Node",
        description:
          "Drag the splitter node to the canvas and place it between the two nodes.",
        idPool: ["furnace", "cobblestone"],
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
          "furnace",
          "cobblestone",
          "cobblestone_slab",
        ],
        stateRequirement(state) {
          return Boolean(
            state.nodes.some(
              (n) =>
                n.data.dataType === MCNodeType.crafter &&
                n.data.item.itemId === "cobblestone_slab"
            )
          );
        },
      },
      {
        id: "tutorial-splitter-connect",
        title: "Splitter Node",
        description:
          "You can use the input box of the splitter node to adjust the ratio of items that the outputs receive.\n\n" +
          "For example, the splitting pattern \"AAABB\" will allocate three cobblestone to output \"A\" for every two" +
          " cobblestone given to output \"B\".\n\nEnter a splitting pattern into the splitter node and connect all" +
          " 4 nodes.",
        idPool: [
          "furnace",
          "cobblestone",
          "cobblestone_slab",
        ],
        stateRequirement(state) {
          return state.edges.length === 3 && state.nodes.some(
            (n) =>
              n.data.dataType === MCNodeType.crafter &&
              n.data.item.itemId === "cobblestone_slab"
          ) && state.nodes.some(
            (n) =>
              n.data.dataType === MCNodeType.crafter &&
              n.data.item.itemId === "furnace"
          );
        },
      },
      {
        id: "tutorial-graph",
        title: "Graph",
        description:
          "The graph shows the production rate of every item on the canvas. You can turn it on by " +
          "clicking the \"Open Graph\" button at the top left of the canvas.\n\nIndividual items can be hidden by " +
          "pressing the checkbox next to an item's name.",
        idPool: ["furnace", "cobblestone"],
        continuation: true,
      },
      {
        id: "tutorial-splitter-order",
        title: "Order Node",
        description:
          "An order node shows the amount of items your factory plan should make.",
        idPool: [
          "furnace",
          "cobblestone",
          "cobblestone_slab",
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
          "furnace",
          "cobblestone",
          "cobblestone_slab",
        ],
        itemRequirements: [
          {
            rate: 1,
            itemId: "furnace",
          },
          {
            rate: 24,
            itemId: "cobblestone_slab",
          },
        ],
      },
    ],
  },

  {
    title: "Tutorial: Advanced",
    id: "tutorial2",
    completeMessage: "Well done! You completed the advanced tutorial!",
    tasks: [
      {
        id: "tutorial2-start",
        title: "Builder Node",
        description: "Sometimes, you want to condense a whole part of your factory into one node. This can be done " +
          "with custom nodes.\n\nTo make a custom node, we have to use a builder node. Let's make a custom node that " +
          "can make iron tools.\n\nTo start, create a chain of nodes that makes sticks",
        idPool: ["oak_log", "oak_planks", "stick"],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some((n) => n?.data.item?.itemId === "oak_log") &&
            state.nodes.some((n) => n?.data.item?.itemId === "oak_planks") &&
            state.nodes.some((n) => n?.data.item?.itemId === "stick") &&
            state.edges.length >= 2
          );
        },
      },
      {
        id: "tutorial2-drag",
        title: "Builder Node",
        description: "The builder node takes all the nodes that are connected to it and condenses it into a custom " +
          "node that has the same inputs and outputs.\n\nDrag a builder node onto the canvas now.",
        idPool: [],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some(
              (n) =>
                n?.data.dataType === "builder"
            )
          );
        },
      },
      {
        id: "tutorial2-builder",
        title: "Builder Node",
        description: "Now, connect the sticks to the builder.",
        idPool: [],
        stateRequirement: (state) => {
          return Boolean(
            state.edges.some((e) =>
              (e?.data.item.itemId === "stick")
            )
          );
        },
      },
      {
        id: "tutorial2-builder2",
        title: "Builder Node",
        description: "Notice that the builder has gained a new output. The builder gains inputs and outputs " +
          "for each node \"chain\" it has. Add a new node chain that adds iron ingots to the builder node.",
        idPool: ["iron_ingot", "iron_nugget"],
        stateRequirement: (state) => {
          return Boolean(
            state.edges.some((e) =>
              (e?.data.item.itemId === "iron_nugget")
            )
          );
        },
      },
      {
        id: "tutorial2-save",
        title: "Save System",
        description: "Now that we have done a decent amount of work, try creating a save of what you've done so far. " +
          "You can do so by clicking the \"Saves\" tab on the top right and clicking the \"New Saves\" button. " +
          "This saves the layout of the board to be loaded later. To load a save, click a save on the save list.",
        idPool: [],
        continuation: true,
      },
      {
        id: "tutorial2-custom",
        title: "Creating Custom Nodes",
        description: "Now click save on the builder node to finalize your custom node. Give it a name that describes " +
          "it well.",
        idPool: [],
        stateRequirement: (state) => {
          return Boolean(
            state.nodes.some((n) => n.data.dataType === MCNodeType.custom)
          );
        },
      },
      {
        id: "tutorial2-custom2",
        title: "Using Custom Nodes",
        description: "Now use your new custom node to make some iron pickaxes.",
        idPool: ["iron_pickaxe"],
        stateRequirement: (state) => {
          return Boolean(
            state.edges.some((e) =>
              (e?.data.item.itemId === "iron_ingot")
            ) &&
            state.edges.some((e) =>
              (e?.data.item.itemId === "stick")
            )
          );
        },
      },
      {
        id: "tutorial2-edit",
        title: "Edit Custom Nodes",
        description: "We're also going to need some diamond tools to complete our final order. Let's make another " +
          "custom node but for diamonds this time. Instead of starting from scratch, we can edit our iron tools node " +
          "and modify a copy of it.\n\nWhen you click \"edit node\", you will be brought to another tab with the recipe " +
          "of your iron tools node. Replace the iron ingots for diamonds, save the new node, then come back here to use " +
          "it to make some diamond axes.",
        idPool: ["diamond_axe"],
        stateRequirement: (state) => {
          return Boolean(
            state.edges.some((e) =>
              (e?.data.item.itemId === "diamond")
            ) &&
            state.edges.some((e) =>
              (e?.data.item.itemId === "stick")
            )
          );
        },
      },
      {
        id: "tutorial2-finish",
        title: "Tools",
        description: "Now, use your two custom nodes to produce 4 iron pickaxes and 10 diamond axes. Then submit " +
          "your factory plan to finish the tutorial.",
        itemRequirements: [
          {
            itemId: "iron_pickaxe",
            rate: 8,
          },
          {
            itemId: "diamond_axe",
            rate: 16,
          },
        ],
      },
    ]
  },

  // Unit 1
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
            itemId: "oak_planks",
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
            itemId: "stick",
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
            itemId: "diamond_axe",
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
            itemId: "chest",
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
            itemId: "iron_pickaxe",
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
            itemId: "furnace",
            rate: 1,
          },
        ],
      },
    ],
  },

  // Unit 2
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
            itemId: "crafting_table",
            rate: 14,
          },
          {
            itemId: "ladder",
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
            itemId: "chest",
            rate: 5,
          },
          {
            itemId: "oak_sign",
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
            itemId: "oak_fence",
            rate: 48,
          },
          {
            itemId: "fence_gate",
            rate: 8,
          },
        ],
      },
      {
        id: "u2l3-o4",
        title: "Fourth Order",
        description: "Produce 30 wooden axes, 30 wooden pickaxes, and 30 wooden shovels per minute",
        itemRequirements: [
          {
            itemId: "wooden_axe",
            rate: 30,
          },
          {
            itemId: "wooden_shovel",
            rate: 30,
          },
          {
            itemId: "wooden_pickaxe",
            rate: 30,
          },
        ],
      },
    ],
  },

  // Unit 3
  //TODO LESSON NOT FINALIZED
  // {
  //   title: "Unit 3, Lesson 1",
  //   id: "u3l1",
  //   tasks: [
  //     {
  //       id: "u3l1-o1",
  //       title: "First Order",
  //       description: "Produce 30 beacons per minute.",
  //       itemRequirements: [
  //         {
  //           itemId: "beacon",
  //           rate: 30,
  //         }
  //       ],
  //     },
  //     {
  //       id: "u3l1-o2",
  //       title: "Second Order",
  //       description: "Produce 270 iron blocks.",
  //       itemRequirements: [
  //         {
  //           itemId: "iron_block",
  //           rate: 270,
  //         }
  //       ],
  //     },
  //     {
  //       id: "u3l1-o3",
  //       title: "Third Order",
  //       description: "Produce 10 blue, red, and brown stained glass panes per minute.",
  //       itemRequirements: [
  //         {
  //           itemId: "blue_stained_glass_pane",
  //           rate: 10,
  //         },
  //         {
  //           itemId: "red_stained_glass_pane",
  //           rate: 10,
  //         },
  //         {
  //           itemId: "brown_stained_glass_pane",
  //           rate: 10,
  //         },
  //       ],
  //     },
  //   ],
  // },

  {
    title: "Unit 3, Lesson 2",
    id: "u3l2",
    tasks: [
      {
        id: "u3l2-o1",
        title: "First Order",
        description: "Produce 1 beacon per minute.",
        itemRequirements: [
          {
            itemId: "beacon",
            rate: 1,
          }
        ],
      },
      {
        id: "u3l2-o2",
        title: "Second Order",
        description: "Produce 9 iron blocks.",
        itemRequirements: [
          {
            itemId: "iron_block",
            rate: 9,
          }
        ],
      },
      {
        id: "u3l2-o3",
        title: "Third Order",
        description: "Produce 10 blue, red, and brown stained glass pane per minute.",
        itemRequirements: [
          {
            itemId: "blue_stained_glass_pane",
            rate: 1,
          },
          {
            itemId: "red_stained_glass_pane",
            rate: 1,
          },
          {
            itemId: "brown_stained_glass_pane",
            rate: 1,
          },
        ],
      },
    ],
  },

  {
    title: "Unit 3, Lesson 3",
    id: "u3l3",
    tasks: [
      {
        id: "u3l3-o1",
        title: "First Order",
        description: "Produce 30 beacon per minute.",
        itemRequirements: [
          {
            itemId: "beacon",
            rate: 30,
          }
        ],
      },
      {
        id: "u3l2-o2",
        title: "Second Order",
        description: "Produce 270 iron blocks.",
        itemRequirements: [
          {
            itemId: "iron_block",
            rate: 270,
          }
        ],
      },
      {
        id: "u3l2-o3",
        title: "Third Order",
        description: "Produce 10 blue, red, and brown stained glass pane per minute.",
        itemRequirements: [
          {
            itemId: "blue_stained_glass_pane",
            rate: 10,
          },
          {
            itemId: "red_stained_glass_pane",
            rate: 10,
          },
          {
            itemId: "brown_stained_glass_pane",
            rate: 10,
          },
        ],
      },
    ],
  },

  //TODO LESSON NOT FINALIZED
  {
    title: "Unit 3, Lesson 4",
    id: "u3l4",
    tasks: [
      {
        id: "u3l4-o1",
        title: "First Order",
        description: "Produce red, orange, yellow, green, blue, cyan, purple, gray, and brown dyes." +
          " Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "red_dye",
            rate: 10,
          },
          {
            itemId: "orange_dye",
            rate: 10,
          },
          {
            itemId: "yellow_dye",
            rate: 10,
          },
          {
            itemId: "green_dye",
            rate: 10,
          },
          {
            itemId: "blue_dye",
            rate: 10,
          },
          {
            itemId: "cyan_dye",
            rate: 10,
          },
          {
            itemId: "purple_dye",
            rate: 10,
          },
          {
            itemId: "brown_dye",
            rate: 10,
          },
          {
            itemId: "gray_dye",
            rate: 10,
          }
        ],
      },
      {
        id: "u3l4-o2",
        title: "Second Order",
        description: "Produce red, orange, yellow, green, blue, cyan, purple, gray, and brown dyes." +
          " Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "red_concrete_powder",
            rate: 10,
          },
          {
            itemId: "orange_concrete_powder",
            rate: 10,
          },
          {
            itemId: "yellow_concrete_powder",
            rate: 10,
          },
          {
            itemId: "green_concrete_powder",
            rate: 10,
          },
          {
            itemId: "blue_concrete_powder",
            rate: 10,
          },
          {
            itemId: "cyan_concrete_powder",
            rate: 10,
          },
          {
            itemId: "purple_concrete_powder",
            rate: 10,
          },
          {
            itemId: "brown_concrete_powder",
            rate: 10,
          },
          {
            itemId: "gray_concrete_powder",
            rate: 10,
          }
        ],
      },
      {
        id: "u3l4-o3",
        title: "Third Order",
        description: "Produce iron shovels, iron pickaxes, and diamond axes. Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "iron_shovel",
            rate: 10,
          },
          {
            itemId: "iron_pickaxe",
            rate: 10,
          },
          {
            itemId: "diamond_axe",
            rate: 10,
          },
        ],
      },
      {
        id: "u3l4-o4",
        title: "Fourth Order",
        description: "Produce 5 beacons per minute.",
        itemRequirements: [
          {
            itemId: "beacons",
            rate: 5,
          },
        ],
      },
      {
        id: "u3l4-o5",
        title: "Fifth Order",
        description: "Produce 164 iron blocks.",
        itemRequirements: [
          {
            itemId: "iron_block",
            rate: 164,
          },
        ],
      },
    ],
  },

  {
    title: "Unit 3, Lesson 5",
    id: "u3l5",
    tasks: [
      {
        id: "u3l5-o1",
        title: "First Order",
        description: "Produce red, orange, yellow, green, blue, cyan, purple, brown, and gray dyes." +
          " Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "red_dye",
            rate: 10,
          },
          {
            itemId: "orange_dye",
            rate: 10,
          },
          {
            itemId: "yellow_dye",
            rate: 10,
          },
          {
            itemId: "green_dye",
            rate: 10,
          },
          {
            itemId: "blue_dye",
            rate: 10,
          },
          {
            itemId: "cyan_dye",
            rate: 10,
          },
          {
            itemId: "purple_dye",
            rate: 10,
          },
          {
            itemId: "brown_dye",
            rate: 10,
          },
          {
            itemId: "gray_dye",
            rate: 10,
          }
        ],
      },
      {
        id: "u3l5-o2",
        title: "Second Order",
        description: "Produce red, orange, yellow, green, blue, cyan, purple, gray, and brown concrete powders." +
          " Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "red_concrete_powder",
            rate: 10,
          },
          {
            itemId: "orange_concrete_powder",
            rate: 10,
          },
          {
            itemId: "yellow_concrete_powder",
            rate: 10,
          },
          {
            itemId: "green_concrete_powder",
            rate: 10,
          },
          {
            itemId: "blue_concrete_powder",
            rate: 10,
          },
          {
            itemId: "cyan_concrete_powder",
            rate: 10,
          },
          {
            itemId: "purple_concrete_powder",
            rate: 10,
          },
          {
            itemId: "brown_concrete_powder",
            rate: 10,
          },
          {
            itemId: "gray_concrete_powder",
            rate: 10,
          }
        ],
      },
    ],
  },

  {
    title: "Unit 3, Lesson 6",
    id: "u3l6",
    tasks: [
      {
        id: "u3l6-o1",
        title: "First Order",
        description: "Produce iron shovels, iron pickaxes, and diamond axes. Produce 10 of each per minute.",
        itemRequirements: [
          {
            itemId: "iron_shovel",
            rate: 10,
          },
          {
            itemId: "iron_pickaxe",
            rate: 10,
          },
          {
            itemId: "diamond_axe",
            rate: 10,
          },
        ],
      },
      {
        id: "u3l6-o2",
        title: "Second Order",
        description: "Produce 5 beacons per minute.",
        itemRequirements: [
          {
            itemId: "beacons",
            rate: 5,
          },
        ],
      },
      {
        id: "u3l6-o3",
        title: "Third Order",
        description: "Produce 164 iron blocks.",
        itemRequirements: [
          {
            itemId: "iron_block",
            rate: 164,
          },
        ],
      },
    ],
  },

  {
    title: "Unit 3, Lesson 7",
    id: "u3l7",
    tasks: [
      {
        id: "u3l7-o1",
        title: "First Order",
        description: "Produce red, blue, green, yellow, purple, orange, and cyan concrete powders." +
          " Produce 162 of each per minute.",
        itemRequirements: [
          {
            itemId: "red_concrete_powder",
            rate: 162,
          },
          {
            itemId: "blue_concrete_powder",
            rate: 162,
          },
          {
            itemId: "green_concrete_powder",
            rate: 162,
          },
          {
            itemId: "yellow_concrete_powder",
            rate: 162,
          },
          {
            itemId: "purple_concrete_powder",
            rate: 162,
          },
          {
            itemId: "orange_concrete_powder",
            rate: 162,
          },
          {
            itemId: "cyan_concrete_powder",
            rate: 162,
          },
        ],
      },
      {
        id: "u3l7-o2",
        title: "Second Order",
        description: "This order requires 3 water, fire, earth, wood, and metal beacons. " +
          "To do that, produce 3 blue, red, green, brown, and black stained glass blocks, as well as 15 beacons.",
        itemRequirements: [
          {
            itemId: "blue_stained_glass",
            rate: 3,
          },
          {
            itemId: "red_stained_glass",
            rate: 3,
          },
          {
            itemId: "green_stained_glass",
            rate: 3,
          },
          {
            itemId: "brown_stained_glass",
            rate: 3,
          },
          {
            itemId: "black_stained_glass",
            rate: 3,
          },
          {
            itemId: "beacons",
            rate: 15,
          },
        ],
      },
      {
        id: "u3l7-o3",
        title: "Third Order",
        description: "Produce 2460 diamond blocks per minute.",
        itemRequirements: [
          {
            itemId: "diamond_block",
            rate: 2460,
          },
        ],
      },
      {
        id: "u3l7-o4",
        title: "Fourth Order",
        description: "Produce 108 iron pickaxes, axes, shovels, and hoes and " +
          "produce 50 diamond pickaxes, axes, shovels, and hoes.",
        itemRequirements: [
          {
            itemId: "iron_pickaxe",
            rate: 108,
          },
          {
            itemId: "iron_axe",
            rate: 108,
          },
          {
            itemId: "iron_shovel",
            rate: 108,
          },
          {
            itemId: "iron_hoe",
            rate: 108,
          },
          {
            itemId: "diamond_pickaxe",
            rate: 50,
          },
          {
            itemId: "diamond_axe",
            rate: 50,
          },
          {
            itemId: "diamond_shovel",
            rate: 50,
          },
          {
            itemId: "diamond_hoe",
            rate: 50,
          },
        ],
      },
    ],
  },

  // //Todo: Dummy objs, DELETE!!!!!!
  // {
  //   title: "Unit 1, Lesson 2",
  //   id: "u1l2",
  //   tasks: [
  //     {
  //       id: "u1l2-planks",
  //       title: "Planks",
  //       description: "Produce 8 oak planks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "oak_planks",
  //           rate: 8,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-stick",
  //       title: "Sticks",
  //       description: "Produce 32 sticks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "stick",
  //           rate: 32,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-diamond-axe",
  //       title: "Diamond Axe",
  //       description: "Produce 1 diamond axe per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "diamond_axe",
  //           rate: 1,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-chest",
  //       title: "Chests",
  //       description: "Produce 10 chests per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "chest",
  //           rate: 10,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Unit 1, Lesson 2",
  //   id: "u1l2",
  //   tasks: [
  //     {
  //       id: "u1l2-planks",
  //       title: "Planks",
  //       description: "Produce 8 oak planks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "oak_planks",
  //           rate: 8,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-stick",
  //       title: "Sticks",
  //       description: "Produce 32 sticks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "stick",
  //           rate: 32,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-diamond-axe",
  //       title: "Diamond Axe",
  //       description: "Produce 1 diamond axe per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "diamond_axe",
  //           rate: 1,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-chest",
  //       title: "Chests",
  //       description: "Produce 10 chests per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "chest",
  //           rate: 10,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Unit 1, Lesson 2",
  //   id: "u1l2",
  //   tasks: [
  //     {
  //       id: "u1l2-planks",
  //       title: "Planks",
  //       description: "Produce 8 oak planks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "oak_planks",
  //           rate: 8,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-stick",
  //       title: "Sticks",
  //       description: "Produce 32 sticks per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "stick",
  //           rate: 32,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-diamond-axe",
  //       title: "Diamond Axe",
  //       description: "Produce 1 diamond axe per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "diamond_axe",
  //           rate: 1,
  //         },
  //       ],
  //     },
  //     {
  //       id: "u1l2-chest",
  //       title: "Chests",
  //       description: "Produce 10 chests per minute",
  //       itemRequirements: [
  //         {
  //           itemId: "chest",
  //           rate: 10,
  //         },
  //       ],
  //     },
  //   ],
  // },




  // {
  //   title: "test",
  //   id: "test",
  //   tasks: [
  //     {
  //       id: "test-1",
  //       title: "Create Nether Brick",
  //       itemRequirements: [
  //         {
  //           itemId: "netherbrick",
  //           perHour: 8,
  //         },
  //         // {
  //         //   itemId: "quartz",
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
  //           itemId: "enchanting_table",
  //           perHour: 1,
  //         },
  //         {
  //           itemId: "bookshelf",
  //           perHour: 4,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
