import { ReactNode } from "react";
import { MCNode } from "../../types/MCNodes";

interface BaseNodeProps {
  data: MCNode;
  children: ReactNode;
  className?: string;
}
export const BaseNode = ({ children, className }: BaseNodeProps) => {
  return (
    <div className={`p-1 text-white bg-orange-200 shadow ${className}`}>
      <div className="text-center text-black">Output</div>
      <div className="flex flex-col items-center py-4 px-8 text-black bg-gray-100">
        {children}
      </div>
    </div>
  );
};
