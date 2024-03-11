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
import { MCEdge, MCItem, MCNode, MCNodeType } from "../types/MCNodes";
import { Task } from "../types/tasks";
import {
  animationDurationFromPerHour,
  checkIfNodesConnect,
} from "./nodeStoreUtils";
import { sendLog } from "../api/logs";
import { LogType } from "../__generated__/graphql";
import { SaveData } from "../api/saves";
import { itemFromId } from "../hooks/useFullItem";
import { getNodeById, getEdgeById } from "../utils/nodes";
import { logNode, logEdge } from "../api/logs"

export type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<MCNode>) => void;
  removeNodeById: (nodeId: string) => void;
  removeEdgeById: (edgeId: string) => void;
  removeEdgesAndNodes: (nodeIds: string[], edgeIds: string[]) => void;
  updateEdgeSpeeds: () => void;

  setEdgeColors: (edgeIds: string[], color: string) => void;

  setResourceOutputRate: (id: string, newRate: number) => void;

  setNodeData: <T extends MCNode>(id: string, newData: Partial<T>) => void;
  setEdgeData: <T extends MCEdge>(id: string, newData: Partial<T>) => void;
  removeOrderNode: () => void;

  clearAllNodes: () => void;

  infoModeEnabled: boolean;
  toggleInfoMode: () => void;

  workDone: boolean;

  lastSave: SaveData;
  lastTimeSaved: Date;
  unsavedNotifSent: boolean;
  setNotifSentTrue: () => void;

  queries: {
    hasNodeType: (nodeType: MCNodeType) => boolean;
  };

  internal: {
    appendNodes: (nodes: Node<MCNode>[]) => void;
    appendEdges: (edges: Edge<MCEdge>[]) => void;
    setNodesAndEdges: (nodes: Node<MCNode>[], edges: Edge<MCEdge>[]) => void;
  };
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useNodeStore = create<RFState>((set, get)=> ({
  nodes: [],
  edges: [],
  infoModeEnabled: false,
  workDone: false,
  lastSave: { nodes: [], edges: [] },
  lastTimeSaved: new Date(),
  unsavedNotifSent: false,
  onNodesChange: (changes: NodeChange[]) => {
    for (const change of changes) {
      let node

      if (change.type === "remove") {
        const node = getNodeById(change.id);
      }

      if (!node) continue;
      logNode(LogType.MfpDeleteNode, node)
    }
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      workDone: true,
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    // for (const change of changes) {
    //   let edge;
    //
    //   if (change.type === "remove") {
    //     edge = getEdgeById(change.id);
    //   } else if (change.type === "add") {
    //     edge = change.item;
    //   }
    //
    //   if (!edge) continue;
    //   logEdge(LogType.MfpBreakNodeConnection, edge);
    // }
    console.log("add edge")
    for (const change of changes) {

      if (change.type === "add") {
        if (!change.item) continue;
        logEdge(LogType.MfpConnectNodes, change.item);
      }
    }
    set({
      edges: applyEdgeChanges(changes, get().edges),
      workDone: true,
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

  setEdgeColors(edgeIds, color) {
    // Reset

    const edges = get().edges;

    const newEdges = edges.map((e) => {
      if (!edgeIds.includes(e.id)) {
        return {
          ...e,
          style: {
            ...e.style,
            color: "white",
          },
          data: {
            ...e.data,
            builderColor: null,
          },
        };
      }
      return {
        ...e,
        data: {
          ...e.data,
          builderColor: color,
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
      console.log("connection aborted")
      return;
    }

    if (
      sourceNode.data.dataType === MCNodeType.order ||
      sourceNode.data.dataType === MCNodeType.builder
    ) {
      console.log("connection aborted")
      return;
    }

    console.log("item:", sourceNode?.data)

    let edgeItem: MCItem;

    if (sourceNode.data.dataType === MCNodeType.custom) {
      edgeItem = itemFromId(connection.sourceHandle);
    } else {
      edgeItem = sourceNode?.data?.item;
    }

    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          data: {
            item: edgeItem,
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

    if (!checkIfNodesConnect(sourceNode, targetNode, connection)) {
      console.log("connection aborted")
      return;
    }
  },

  addNode: (node: Node<MCNode>) => {
    const nodes = get().nodes;
    set({
      nodes: [...nodes, node],
    });
  },

  removeEdgesAndNodes(nodeIds, edgeIds) {
    const nodes = get().nodes;
    const edges = get().edges;

    const newNodes = nodes.filter((n) => !nodeIds.includes(n.id));
    const newEdges = edges.filter((e) => !edgeIds.includes(e.id));

    set({
      nodes: newNodes,
      edges: newEdges,
    });
  },

  setResourceOutputRate: (id: string, newRate: number) => {
    // console.log("Setting output rate", newRate);
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

  resetSave() {
    set({
      lastSave: {nodes: this.nodes, edges: this.edges},
      lastTimeSaved: new Date(),
      unsavedNotifSent: false,
    })
  },

  setNotifSentTrue() {
    set({
      unsavedNotifSent: true,
    })
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
    sendLog(LogType.MfpToggleInfoMode);
    set({
      infoModeEnabled: !get().infoModeEnabled,
    });
  },

  internal: {
    appendNodes(nodes) {
      set({
        nodes: [...get().nodes, ...nodes],
      });
    },

    appendEdges(edges) {
      set({
        edges: [...get().edges, ...edges],
      });
    },

    setNodesAndEdges(nodes, edges) {
      set({
        nodes,
        edges,
      });
    },
  },

  clearAllNodes() {
    sendLog(LogType.MfpClearCanvas);
    set({
      nodes: [],
      edges: [],
    });
  },
}));
