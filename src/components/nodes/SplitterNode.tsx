import { useEffect } from "react";
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

export default function SplitterNode({ data }: SplitterNodeProps) {
  const setData = useSetNodeData<MCSplitterNode>(data.id);

  const incomingEdge = useNodeStore(
    (s) => s.edges.find((e) => e?.target === data.id),
    singleEdgeUpdate
  );

  const outgoingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e?.source === data.id)
  );

  const setEdgeData = useNodeStore((s) => s.setEdgeData);
  const removeEdge = useNodeStore((s) => s.removeEdgeById);

  const updateRatio = (ratio: number) => {
    console.log("updating ratio", ratio);
    setData({ ratio: ratio / 16 });
  };

  useEffect(() => {
    for (let i = 0; i < outgoingEdges.length; i++) {
      if (!incomingEdge) {
        removeEdge(outgoingEdges[i].id);
      } else {
        setEdgeData(outgoingEdges[i].id, {
          outputRate:
            incomingEdge.data.outputRate *
            (i === 0 ? data.ratio : 1 - data.ratio),
          item: incomingEdge.data.item,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingEdge, data.ratio, removeEdge, setEdgeData, outgoingEdges.length]);

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
      leftSideNodes={<SideHandle type="target" />}
      rightSideNodes={
        <>
          <SideHandle type="source" id="output-0" />
          <SideHandle type="source" id="output-1" />
        </>
      }
    >
      {incomingEdge?.data && (
        <SpriteDisplay
          label={incomingEdge.data.item.title}
          url={incomingEdge.data.item.imageUrl}
        />
      )}
      <input
        onChange={(e) => {
          updateRatio(parseFloat(e.target.value));
        }}
        className="nodrag"
        type="range"
        min={0}
        max={16}
        value={data.ratio * 16}
      />
    </BaseNode>
  );
}
