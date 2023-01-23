import { MCOrderNode, MCSplitterNode } from "../../types/MCNodes";

interface OrderNodeProps {
  data: MCOrderNode;
}

export default function OrderNode({ data }: OrderNodeProps) {
  return (
    <>
      <div className="p-1 text-white bg-orange-300 shadow">
        <div className="text-center text-black">Order</div>
        <div className="flex flex-col items-center py-4 px-8 text-black bg-gray-100">
          Test
        </div>
      </div>
    </>
  );
}
