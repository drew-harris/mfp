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

export function getRatioFromInputString(input: string): Map<string, number> {
  input = input.toLowerCase().replaceAll(" ", "");
  const map = new Map();
  // eslint-disable-next-line unicorn/prefer-spread
  for (const c of input.split("")) {
    if (map.has(c)) {
      map.set(c, map.get(c) + 1);
    } else {
      map.set(c, 1);
    }
  }
  const total = input.length;
  // eslint-disable-next-line prefer-const
  for (let [key, value] of map) {
    value = value / total;
    map.set(key, value);
  }
  return map;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  const setData = useSetNodeData<MCSplitterNode>(data.id);
  const updateNodeInternals = useUpdateNodeInternals();

  const incomingEdge = useNodeStore(
    (s) => s.edges.find((e) => e?.target === data.id),
    singleEdgeUpdate
  );

  // TODO: Add filter to prevent excessive re-filters
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
    console.log(ratios);
    updateNodeInternals(data.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.splitString]);

  useEffect(() => {
    for (const [i, outgoingEdge] of outgoingEdges.entries()) {
      console.log(
        `i: ${i}, ratios length: ${
          data.ratios.size
        }, outgoingEdge: ${outgoingEdges.entries()},
        sourceHandle: ${outgoingEdge.sourceHandle}`
      );
      if (incomingEdge && data.ratios.has(outgoingEdge.sourceHandle)) {
        // TODO: Actually finish rounding shhhhhhhh....
        setEdgeData(outgoingEdge.id, {
          outputRate: Math.floor(
            data.ratios.get(outgoingEdge.sourceHandle) *
              incomingEdge.data.outputRate
          ),
          item: incomingEdge.data.item,
        });
      } else {
        removeEdge(outgoingEdge.id);
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
    if (incomingEdge) {
      setData({ item: incomingEdge.data.item });
    } else {
      setData({ item: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingEdge]);

  return (
    <BaseNode
      data={data}
      leftSideNodes={<SideHandle type="target" />}
      rightSideNodes={[...data.ratios.keys()].map((l, i) => {
        return (
          <SideHandle
            className={
              outgoingEdges.filter((edge) => edge.sourceHandle === l).length ===
              0
                ? "border-black bg-red-500"
                : null /* TODO: has pretty long jank (74.5ms in worst case when n=3), maybe look into refactoring?*/
            }
            key={i}
            type="source"
            id={`${l}`}
            label={l.toUpperCase()}
          />
        );
      })}
    >
      {incomingEdge?.data && (
        <SpriteDisplay
          label={incomingEdge.data.item.title}
          url={incomingEdge.data.item.imageUrl}
        />
      )}
      <input
        type="text"
        placeholder="Enter Splitting Pattern..."
        className="rounded-xl border border-black bg-gray-300 px-5 py-1 text-xs text-black placeholder:text-gray-400"
        value={data.splitString}
        onChange={(e) => updateString(e.target.value.toUpperCase())}
      />
    </BaseNode>
  );
}
