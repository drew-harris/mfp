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
        outputRate: 23,
      },
      id: "firstnode",
      position: {
        x: 40,
        y: 30,
      },
    },
  ],
  edges: [] as Edge<MCNode>[],
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
    if (sourceNode?.data.item.itemId !== targetNode?.data.item.itemId) {
      return;
    }
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          data: {
            item: sourceNode?.data.item,
          },
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

  // TODO: Make recursive
  setResourceOutputRate: (id: string, newRate: number) => {
    const nodes = get().nodes;
    let updateIds: string[] = [];
    get().edges.forEach((edge) => {
      if (edge.source === id) {
        updateIds = nodes
          .filter((node) => node.id === edge.source || node.id === edge.target)
          .map((node) => node.id);
      }
    });

    const newNodes = nodes.map((node) => {
      if (updateIds.includes(node.id)) {
        return {
          ...node,
          data: {
            ...node.data,
            outputRate: newRate,
          },
        };
      } else {
        return {
          ...node,
        };
      }
    });
    set({
      nodes: newNodes,
    });
  },
}));
