import { Edge, Node } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCBuilderNode, MCEdge } from "../../types/MCNodes";
import { edgeArrayUpdate } from "../../utils/updates";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import { useEffect, useState } from "react";
import {
  findCoefficients,
  FindCoefficientsResult,
  Ratios,
} from "../../utils/builder";
import { getNodeById } from "../../utils/nodes";

interface BuilderNodeProps {
  data: MCBuilderNode;
}

export default function BuilderNode({ data }: BuilderNodeProps) {
  const [result, setResult] = useState<Ratios | null>(null);
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
  );

  const setEdgeColors = useNodeStore((s) => s.setEdgeColors);
  // Coloring connected edges
  const allConnectedEdges = useNodeStore((s) => {
    // BFS of edges conntected
    const connected = [];
    const toSearch: Edge<MCEdge>[] = [];
    toSearch.push(...s.edges.filter((e) => e.target === data.id));
    while (toSearch.length > 0) {
      const edge = toSearch.pop();
      if (edge) {
        connected.push(edge);
        toSearch.push(...s.edges.filter((e) => e.target === edge.source));
      }
    }

    return connected;
  }, edgeArrayUpdate);

  useEffect(() => {
    console.log("UPDATE!!!");
    setEdgeColors(
      allConnectedEdges.map((e) => e.id),
      "#ff00ff"
    );
  }, [allConnectedEdges, setEdgeColors]);

  useEffect(() => {
    // TODO: Figure out cool type system
    const nodeRef = getNodeById(data.id) as unknown as Node<MCBuilderNode>;
    const result = findCoefficients(nodeRef);
    if (result.status === "success") {
      setResult(result.data);
    } else {
      setResult(null);
    }
  }, [allConnectedEdges, setEdgeColors, data.id]);

  return (
    <BaseNode leftSideNodes={<SideHandle type="target" />} data={data}>
      {incomingEdge?.data ? (
        <div className="flex flex-col items-center">
          {incomingEdge?.data?.item?.imageUrl && (
            <SpriteDisplay url={incomingEdge.data.item.imageUrl} />
          )}
          {incomingEdge?.data?.item?.title && (
            <div>{incomingEdge.data?.item?.title}</div>
          )}
          {JSON.stringify(result)}
        </div>
      ) : (
        <div>No Connected Nodes</div>
      )}
    </BaseNode>
  );
}
