import { useNodeStore } from "../../stores/nodes";
import { MCInfoNode } from "../../types/MCNodes";

interface InfoNodeProps {
  data: MCInfoNode;
}

export default function InfoNode({ data }: InfoNodeProps) {
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
  );

  return <div>Null Delete me</div>;
}
