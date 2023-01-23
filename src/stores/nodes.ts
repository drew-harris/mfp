import create from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";

type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<MCNode>) => void;
  setResourceOutputRate: (id: string, newRate: number) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const nodeStore = create<RFState>((set, get) => ({
  nodes: [
    {
      type: MCNodeType.resource,
      data: {
        dataType: MCNodeType.resource,
        id: "firstnode",
        item: {
          spriteIndex: 1,
          itemId: 1,
          title: "Grass",
        },
      },
      id: "firstnode",
      position: {
        x: 40,
        y: 30,
      },
    } as Node<MCNode>,
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    console.log(connection);
    const nodes = get().nodes;
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!targetNode || !sourceNode) {
      return;
    }
    if (
      !targetNode?.data &&
      targetNode?.data.item &&
      sourceNode?.data?.item?.itemId !== targetNode?.data?.item.itemId // Items must be the same type
    ) {
      return;
    }
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          data: {
            item: sourceNode?.data.item,
            outputRate: 0,
          },
          label: "0",
          style: { strokeWidth: "4px" },
        } as Edge<MCEdge>,
        get().edges
      ),
    });
  },

  addNode: (node: Node<MCNode>) => {
    const nodes = get().nodes;
    set({
      nodes: [...nodes, node],
    });
  },

  setResourceOutputRate: (id: string, newRate: number) => {
    console.log(`Setting rates for id: ${id} `);

    const edges = get().edges;
    set({
      edges: edges.map((edge) => {
        if (!edge.data?.item) {
          return edge;
        }
        if (edge.source === id) {
          return {
            ...edge,
            label: newRate,
            data: {
              ...edge.data,
              outputRate: newRate,
            },
          };
        } else {
          return edge;
        }
      }),
    });
  },
}));
