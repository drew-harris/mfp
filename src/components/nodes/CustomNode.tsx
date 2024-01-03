import { useState } from "react";
import { itemFromId } from "../../hooks/useFullItem";
import { MCCustomNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import { Button } from "../basic/Button";

interface CustomNodeProps {
  data: MCCustomNode;
}

export default function CustomNode({ data }: CustomNodeProps) {
  const items = data.recipes.map((r) => r.item);
  const [showRequired, setShowRequired] = useState(false);

  const collapsed = data.recipes.map((r) => r.inputs).flatMap((r) => r.flat());

  const leftSideNodes = collapsed.map((i) => (
    <SideHandle type="target" id={`${data.id}-input-${i}`} key={i.itemId} />
  ));

  return (
    <BaseNode leftSideNodes={leftSideNodes} data={data}>
      {items.map((i) => (
        <div key={i.itemId}>
          <div>{i.title}</div>
          <SpriteDisplay url={i.imageUrl} />
        </div>
      ))}
      <Button className="my-2" onClick={() => setShowRequired((s) => !s)}>
        Toggle requirements (DEBUG)
      </Button>
      {showRequired && (
        <>
          <div className="my-10">Requires</div>
          {collapsed.map((i) => {
            const item = itemFromId(i.itemId);
            return (
              <div key={i.itemId}>
                <div>{item.title}</div>
                <SpriteDisplay url={item.imageUrl} />
              </div>
            );
          })}
        </>
      )}
    </BaseNode>
  );
}
