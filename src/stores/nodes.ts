import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeRemoveChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import create from "zustand";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";

type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<MCNode>) => void;
  setResourceOutputRate: (id: string, newRate: number) => void;
  removeOrderNode: () => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const nodeStore = create<RFState>((set, get) => ({
  nodes: [],
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

    if (sourceNode.data.dataType === MCNodeType.order) {
      return;
    }

    if (!checkIfNodesConnect(sourceNode, targetNode, connection)) {
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
          // label: "0",
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
            // label: newRate,
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

  removeOrderNode() {
    const nodes = get().nodes;
    const possibleOrder = nodes.find(
      (n) => n.data.dataType === MCNodeType.order
    );

    if (possibleOrder) {
      const change: NodeRemoveChange = {
        id: possibleOrder.id,
        type: "remove",
      };
      set({
        nodes: applyNodeChanges([change], get().nodes),
      });
    }
  },
}));

function checkIfNodesConnect(
  source: Node<MCNode>,
  target: Node<MCNode>,
  connection: Connection
): boolean {
  // Source should always have an item to pass
  if (
    source.data.dataType === MCNodeType.order ||
    source.data.dataType === MCNodeType.output
  ) {
    return false;
  }

  // The source node must have an item
  const sourceItem = source.data.item;
  if (!sourceItem) {
    return false;
  }

  if (target.data.dataType == MCNodeType.output) {
    if (target.data.item.itemId !== sourceItem.itemId) {
      return false;
    }
  }

  if (target.data.dataType === MCNodeType.order) {
    const requirements = target.data.task.itemRequirements;

    if (
      requirements &&
      !requirements.some((req) => req.itemId === sourceItem.itemId)
    ) {
      return false;
    }
  }

  if (connection.targetHandle) {
    if (sourceItem.itemId.toString() !== connection.targetHandle) {
      return false;
    }
  }

  return true;
}
