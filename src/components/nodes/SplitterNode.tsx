import { useEffect } from "react";
import { useUpdateNodeInternals } from "reactflow";
import { useSetNodeData } from "../../hooks/useSetNodeData";
import { useNodeStore } from "../../stores/nodes";
import { MCSplitterNode } from "../../types/MCNodes";
import { singleEdgeUpdate } from "../../utils/updates";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";

interface SplitterNodeProps {
  data: MCSplitterNode;
}

// Exported for testing
export function getRatioFromInputString(input: string): number[] {
  input = input.toLowerCase().replaceAll(" ", "");
  const map = new Map();
  input.split("").forEach((c) => {
    if (map.has(c)) {
      map.set(c, map.get(c) + 1);
    } else {
      map.set(c, 1);
    }
  });
  const total = input.length;
  const ratios = Array.from(map.values()).map((v) => v / total);
  return ratios;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  const setData = useSetNodeData<MCSplitterNode>(data.id);
  const updateNodeInternals = useUpdateNodeInternals();

  const incomingEdge = useNodeStore(
    (s) => s.edges.find((e) => e?.target === data.id),
    singleEdgeUpdate
  );

  const outgoingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e?.source === data.id)
  );

  const setEdgeData = useNodeStore((s) => s.setEdgeData);
  const removeEdge = useNodeStore((s) => s.removeEdgeById);

  const updateString = (s: string) => {
    setData({ splitString: s });
  };

  // Handle string changes into ratios
  useEffect(() => {
    const ratios = getRatioFromInputString(data.splitString);
    setData({ ratios });
    updateNodeInternals(data.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.splitString]);

  useEffect(() => {
    for (let i = 0; i < outgoingEdges.length; i++) {
      if (!incomingEdge) {
        removeEdge(outgoingEdges[i].id);
      } else {
        setEdgeData(outgoingEdges[i].id, {
          outputRate: data.ratios[i] * incomingEdge.data.outputRate,
          item: incomingEdge.data.item,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    incomingEdge,
    data.ratios,
    removeEdge,
    setEdgeData,
    outgoingEdges.length,
  ]);

  useEffect(() => {
    if (!incomingEdge) {
      setData({ item: null });
    } else {
      setData({ item: incomingEdge.data.item });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingEdge]);

  return (
    <BaseNode
      data={data}
      leftSideNode={<SideHandle type="target" />}
      rightSideNode={data.ratios.map((_, i) => (
        <SideHandle
          className={
            i >= outgoingEdges.length ? "border-black bg-red-500" : null
          }
          key={i}
          type="source"
          id={`output-${i}`}
        />
      ))}
    >
      {incomingEdge?.data && (
        <SpriteDisplay className="mb-4" url={incomingEdge.data.item.imageUrl} />
      )}
      <input
        type="text"
        placeholder="Enter Splitting Pattern..."
        className="rounded-xl border border-black bg-gray-300 pl-4 text-xs text-black placeholder:text-gray-400"
        value={data.splitString}
        onChange={(e) => updateString(e.target.value.toUpperCase())}
      />
    </BaseNode>
  );
}
