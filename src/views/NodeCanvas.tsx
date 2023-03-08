import { useDroppable } from "@dnd-kit/core";
import ReactFlow, { Background, BackgroundVariant } from "reactflow";
import "reactflow/dist/style.css";
import CrafterNode from "../components/nodes/CrafterNode";
import InfoNode from "../components/nodes/InfoNode";
import OrderNode from "../components/nodes/OrderNode";
import ResourceNode from "../components/nodes/ResourceNode";
import SplitterNode from "../components/nodes/SplitterNode";
import { useNodeStore } from "../stores/nodes";

const nodeTypes = {
  resource: ResourceNode,
  splitter: SplitterNode,
  order: OrderNode,
  crafter: CrafterNode,
  info: InfoNode,
};

export default function NodeCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useNodeStore();

  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? "border-green-400" : "border-transparent"
      } border-4 h-full`}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background
          color="#808080"
          gap={48}
          lineWidth={2}
          variant={BackgroundVariant.Lines}
        ></Background>
      </ReactFlow>
    </div>
  );
}
