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
import { MCEdge, MCNode, MCNodeType, MCSplitterNode } from "../types/MCNodes";

type RFState = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateTree: (sourceId: string) => void;
  addNode: (node: Node<MCNode>) => void;
  setResourceOutputRate: (id: string, newRate: number) => void;
  setRatioForSplitter: (id: string, newPartCount: number) => void;
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
    const nodes = get().nodes;
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);
    if (!targetNode || !sourceNode) {
      return;
    }
    console.log(targetNode);
    if (
      !targetNode?.data &&
      targetNode?.data.item &&
      sourceNode?.data?.item?.itemId !== targetNode?.data?.item.itemId
    ) {
      console.log("RETURNING EARLY");
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
    if (targetNode.data.dataType === MCNodeType.splitter) {
      set({
        nodes: get().nodes.map((node) => {
          if (
            node.id === targetNode.id &&
            node.data.dataType === MCNodeType.splitter
          ) {
            return {
              ...node,
              data: {
                ...(node.data as MCSplitterNode),
                item: sourceNode.data.item,
              },
            };
          }
          return node;
        }),
      });
    }
  },

  addNode: (node: Node<MCNode>) => {
    const nodes = get().nodes;
    set({
      nodes: [...nodes, node],
    });
  },

  setResourceOutputRate: (id: string, newRate: number) => {
    const setRateForOutputEdges = (sourceId: string, newRate: number) => {
      console.log(`Setting rates for id: ${sourceId} `);
      const possibleSplitter = get().nodes.find(
        (node) =>
          node.data.dataType === MCNodeType.splitter && node.id === sourceId
      ) as Node<MCSplitterNode> | undefined;

      let possibleSplitterValue: number | undefined;
      if (possibleSplitter) {
        console.log("POSSIBLE", possibleSplitter);
        possibleSplitterValue = possibleSplitter
          ? possibleSplitter.data.ratio[0] * newRate
          : newRate;
      }

      const edges = get().edges;
      set({
        edges: edges.map((edge) => {
          if (!edge.data?.item) {
            return edge;
          }
          if (edge.source === sourceId) {
            return {
              ...edge,
              label: possibleSplitterValue || newRate,
              data: {
                ...edge.data,
                outputRate: possibleSplitterValue || newRate,
              },
            };
          } else {
            return edge;
          }
        }),
      });

      // Get all new source nodes
      const newSourceIds = edges
        .filter((edge) => edge.source === sourceId)
        .map((edge) => edge.target);

      console.log("NEXT SOURCE IDS", newSourceIds);

      newSourceIds.forEach((id) => setRateForOutputEdges(id, newRate));
    };

    setRateForOutputEdges(id, newRate);
  },

  updateTree(sourceId: string) {
    const nodes = get().nodes;
  },

  setRatioForSplitter(id: string, newPartCount: number) {
    const newValue = 1 / newPartCount;
    console.log("NEW VALUE", newValue);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ratio: [...Array(newPartCount)].map(() =>
                parseFloat(newValue.toFixed(1))
              ),
            },
          };
        }
        return node;
      }),
    });
  },
}));
