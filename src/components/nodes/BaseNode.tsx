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
}

export const BaseNode = ({
  children,
  outerClassName,
  innerClassName,
  data,
  leftSideNode,
}: BaseNodeProps) => {
  const outerClass = cva(
    ["p-1", "text-white", "shadow", "outset-4", outerClassName],
    {
      variants: {
        nodeType: {
          [MCNodeType.resource]: "bg-green-300",
          [MCNodeType.crafter]: "bg-blue-200",
          [MCNodeType.order]: "bg-red-500",
          [MCNodeType.splitter]: "bg-gray-200",
          [MCNodeType.info]: "bg-gray-200",
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
          "flex flex-col items-center py-4 px-8 text-black bg-gray-100 " +
          innerClassName
        }
      >
        {children}
      </div>
      <div className="absolute top-0 bottom-0 left-0">{leftSideNode}</div>
    </div>
  );
};
