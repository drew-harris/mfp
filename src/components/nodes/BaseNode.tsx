import { cva } from "cva";
import { ReactNode } from "react";
import { MCNode, MCNodeType } from "../../types/MCNodes";
import { getNodeName } from "../../utils/nodes";

interface BaseNodeProps {
  data: MCNode;
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;

  leftSideNode?: ReactNode;
  rightSideNode?: ReactNode;
}

export const BaseNode = ({
  children,
  outerClassName,
  innerClassName,
  data,
  leftSideNode,
  rightSideNode,
}: BaseNodeProps) => {
  const outerClass = cva(
    ["p-1", "text-white", "shadow", "outset-4", outerClassName],
    {
      variants: {
        nodeType: {
          [MCNodeType.resource]: "bg-green-400",
          [MCNodeType.crafter]: "bg-blue-300",
          [MCNodeType.order]: "bg-red-400",
          [MCNodeType.splitter]: "bg-yellow-300",
          [MCNodeType.info]: "bg-gray-300",
          other: "bg-red-500",
        },
      },
      defaultVariants: {
        nodeType: "other",
      },
    }
  );

  return (
    <div className={outerClass({ nodeType: data.dataType })}>
      <div className="text-center text-black">{getNodeName(data.dataType)}</div>
      <div
        className={
          "flex flex-col items-center bg-gray-100 py-4 px-8 text-black " +
          innerClassName
        }
      >
        {children}
      </div>
      <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-center gap-8">
        {leftSideNode}
      </div>
      <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-center gap-8">
        {rightSideNode}
      </div>
    </div>
  );
};
