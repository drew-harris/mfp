import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  EdgeRemoveChange,
  getConnectedEdges,
  Node,
  NodeChange,
  NodeRemoveChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import create from "zustand";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";
import { Task } from "../types/tasks";
import {
  animationDurationFromPerHour,
  checkIfNodesConnect,
} from "./nodeStoreUtils";

export type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<MCNode>) => void;
  removeNodeById: (nodeId: string) => void;
  removeEdgeById: (edgeId: string) => void;
  updateEdgeSpeeds: () => void;
  setResourceOutputRate: (id: string, newRate: number) => void;

  setNodeData: <T extends MCNode>(id: string, newData: Partial<T>) => void;
  setEdgeData: <T extends MCEdge>(id: string, newData: Partial<T>) => void;
  removeOrderNode: () => void;

  infoModeEnabled: boolean;
  toggleInfoMode: () => void;

  queries: {
    hasNodeType: (nodeType: MCNodeType) => boolean;
  };
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useNodeStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  infoModeEnabled: false,
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

  updateEdgeSpeeds() {
    const edges = get().edges;
    const newEdges: Edge<MCEdge>[] = edges.map((e) => {
      return {
        ...e,
        style: {
          ...e.style,
          animationDuration: `${animationDurationFromPerHour(
            e.data?.outputRate || 0
          )}ms`,
        },
      };
    });

    set({
      edges: newEdges,
    });
  },

  onConnect: (connection: Connection) => {
    const nodes = get().nodes;
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!targetNode || !sourceNode) {
      return;
    }

    if (
      sourceNode.data.dataType === MCNodeType.order ||
      sourceNode.data.dataType === MCNodeType.info
    ) {
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
          style: {
            strokeWidth: "4px",
            color: "white",
            animationDuration: "0ms",
            transform: "translateY(5px)",
          },
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
    console.log("Setting output rate", newRate);
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
    get().updateEdgeSpeeds();
  },

  setNodeData(id, newData) {
    console.log("Setting node data", id, newData);
    const nodes = get().nodes;
    set({
      nodes: nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        } else {
          return node;
        }
      }),
    });
  },

  setEdgeData(id, newData) {
    console.log("Setting edge data", id, newData);
    const edges = get().edges;
    set({
      edges: edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              ...newData,
            },
          };
        } else {
          return edge;
        }
      }),
    });
    get().updateEdgeSpeeds();
  },

  removeNodeById(nodeId: string) {
    console.log("Removing node by id", nodeId);
    const nodes = get().nodes;
    const possibleNode = nodes.find((n) => n.id === nodeId);

    if (possibleNode) {
      const change: NodeRemoveChange = {
        id: possibleNode.id,
        type: "remove",
      };
      const edges = getConnectedEdges([possibleNode], get().edges);
      const changes: EdgeRemoveChange[] = edges.map((e) => ({
        type: "remove",
        id: e.id,
      }));
      get().onEdgesChange(changes);
      get().onNodesChange([change]);
    }
  },

  removeEdgeById(edgeId) {
    const change: EdgeRemoveChange = {
      type: "remove",
      id: edgeId,
    };
    get().onEdgesChange([change]);
  },

  removeOrderNode() {
    const nodes = get().nodes;
    const possibleOrder = nodes.find(
      (n) => n.data.dataType === MCNodeType.order
    );
    if (possibleOrder) {
      get().removeNodeById(possibleOrder.id);
    }
  },

  queries: {
    hasNodeType(type: MCNodeType) {
      const nodes = get().nodes;
      return nodes.some((n) => n.data.dataType === type);
    },

    debugQuery(task: Task) {
      const nodes = get().nodes;
      return (task?.title || "no task") + JSON.stringify(nodes);
    },
  },

  toggleInfoMode() {
    set({
      infoModeEnabled: !get().infoModeEnabled,
    });
  },
}));
