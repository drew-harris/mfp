import { useEffect } from "react";
import { useSetNodeData } from "../../hooks/useSetNodeData";
import { MCSplitterNode } from "../../types/MCNodes";
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

  const updateString = (s: string) => {
    setData({ splitString: s });
  };

  // Handle string changes into ratios
  useEffect(() => {
    const ratios = getRatioFromInputString(data.splitString);
    setData({ ratios });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.splitString]);

  return (
    <BaseNode
      data={data}
      rightSideNode={data.ratios.map((_, i) => (
        <SideHandle key={i} type="source" id={`output-${i}`} />
      ))}
    >
      <input
        type="text"
        className="inset"
        value={data.splitString}
        onChange={(e) => updateString(e.target.value)}
      />
    </BaseNode>
  );
}
