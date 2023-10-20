import { useNodeStore } from "../../stores/nodes";
import { MCBuilderNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";

interface BuilderNodeProps {
  data: MCBuilderNode;
}

export default function BuilderNode({ data }: BuilderNodeProps) {
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
  );

  return (
    <BaseNode leftSideNodes={<SideHandle type="target" />} data={data}>
      {incomingEdge?.data ? (
        <div className="flex flex-col items-center">
          {incomingEdge?.data?.item?.imageUrl && (
            <SpriteDisplay url={incomingEdge.data.item.imageUrl} />
          )}
          {incomingEdge?.data?.item?.title && (
            <div>{incomingEdge.data?.item?.title}</div>
          )}
          {incomingEdge.data.outputRate && (
            <div>Rate: {incomingEdge.data.outputRate.toFixed(2)}</div>
          )}
        </div>
      ) : (
        <div>No Connected Nodes</div>
      )}
    </BaseNode>
  );
}
