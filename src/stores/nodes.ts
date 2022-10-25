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
import { MCNode, MCNodeType } from "../types/MCNodes";

type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<MCNode>) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const nodeStore = create<RFState>((set, get) => ({
  nodes: [
    {
      type: MCNodeType.resource,
      data: {
        dataType: MCNodeType.resource,
        id: "firstnode",
        spriteIndex: 1,
        itemId: 1,
        outputRate: 23,
        title: "Grass",
      },
      id: "grass1",
      position: {
        x: 40,
        y: 30,
      },
    },
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
    set({
      edges: addEdge(
        { ...connection, animated: true, style: { strokeWidth: "4px" } },
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
}));
