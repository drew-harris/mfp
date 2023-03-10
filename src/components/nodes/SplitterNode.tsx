import { MCSplitterNode } from "../../types/MCNodes";
import { BaseNode } from "./BaseNode";

interface SplitterNodeProps {
  data: MCSplitterNode;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  return (
    <BaseNode data={data}>
      <div>WIP</div>
    </BaseNode>
  );
}
