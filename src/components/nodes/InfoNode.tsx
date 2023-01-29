import { Handle, Position } from "reactflow";
import { MCInfoNode } from "../../types/MCNodes";
import { BaseNode } from "./BaseNode";

interface InfoNodeProps {
  data: MCInfoNode;
}

export default function InfoNode({ data }: InfoNodeProps) {
  return (
    <BaseNode data={data}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
      />
    </BaseNode>
  );
}
