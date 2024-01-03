import { cva } from "cva";
import { ReactNode } from "react";
import { useNodeStore } from "../../stores/nodes";
import { MCNode, MCNodeType } from "../../types/MCNodes";
import { getNodeName } from "../../utils/nodes";

interface BaseNodeProps {
  data: MCNode;
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;

  leftSideNodes?: ReactNode;
  rightSideNodes?: ReactNode;
}

export const BaseNode = ({
  children,
  outerClassName,
  innerClassName,
  data,
  leftSideNodes: leftSideNode,
  rightSideNodes: rightSideNode,
}: BaseNodeProps) => {
  const realNodeData = useNodeStore((s) =>
    s.nodes.find((n) => n.id === data.id)
  );
  const outerClass = cva(
    ["p-1", "text-white", "shadow", "outset-4", outerClassName],
    {
      variants: {
        nodeType: {
          [MCNodeType.resource]: "bg-green-400",
          [MCNodeType.crafter]: "bg-blue-300",
          [MCNodeType.order]: "bg-red-400",
          [MCNodeType.splitter]: "bg-yellow-300",
          [MCNodeType.builder]: "bg-purple-400",
          [MCNodeType.custom]: "bg-purple-400",
          other: "bg-red-500",
        },
        selected: {
          true: "border-4 border-white/75 shadow-lg",
          false: null,
        },
      },
      defaultVariants: {
        nodeType: "other",
        selected: false,
      },
    }
  );

  return (
    <div
      className={outerClass({
        nodeType: data.dataType,
        selected: realNodeData?.selected || false,
      })}
    >
      <div className="text-center text-black">{getNodeName(data.dataType)}</div>
      <div
        className={
          "flex flex-col items-center bg-gray-100 py-4 px-8 text-black " +
          innerClassName
        }
      >
        {children}
      </div>
      <div className="ldft absolute top-0 bottom-0 flex flex-col justify-around py-2">
        {leftSideNode}
      </div>
      <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around py-2">
        {rightSideNode}
      </div>
    </div>
  );
};
