import { Handle, Position } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCInfoNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";

interface InfoNodeProps {
  data: MCInfoNode;
}

export default function InfoNode({ data }: InfoNodeProps) {
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
  );

  return (
    <BaseNode data={data}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
      />
      {incomingEdge?.data ? (
        <div className="flex flex-col items-center">
          <SpriteDisplay url={incomingEdge.data.item.imageUrl} />
          <div>{incomingEdge.data.item.title}</div>
          <div>Rate: {incomingEdge.data.outputRate.toFixed(2)}</div>
        </div>
      ) : (
        <div>No Connected Node</div>
      )}
    </BaseNode>
  );
}
