import { itemFromId } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { MCCustomNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";

interface CustomNodeProps {
  data: MCCustomNode;
}

export default function CustomNode({ data }: CustomNodeProps) {
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
  );

  const items = data.recipies.map((r) => r.item);

  return (
    <BaseNode leftSideNodes={<SideHandle type="target" />} data={data}>
      {items.map((i) => (
        <div key={i.itemId}>
          <div>{i.title}</div>
          <SpriteDisplay url={i.imageUrl} />
        </div>
      ))}
    </BaseNode>
  );
}
