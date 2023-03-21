import { useSetNodeData } from "../../hooks/useSetNodeData";
import { MCSplitterNode } from "../../types/MCNodes";
import { BaseNode } from "./BaseNode";

interface SplitterNodeProps {
  data: MCSplitterNode;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  const setData = useSetNodeData<MCSplitterNode>(data.id);

  const updateString = (s: string) => {
    setData({ splitString: s });
  };

  return (
    <BaseNode data={data}>
      <div>WIP</div>
      <div>{data.splitString}</div>
      <input
        type="text"
        value={data.splitString}
        onChange={(e) => updateString(e.target.value)}
      />
    </BaseNode>
  );
}
