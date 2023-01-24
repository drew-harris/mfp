import { useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { useStore } from "zustand";
import OrderNode from "../components/nodes/OrderNode";
import OutputNode from "../components/nodes/OutputNode";
import ResourceNode from "../components/nodes/ResourceNode";
import SplitterNode from "../components/nodes/SplitterNode";
import { nodeStore } from "../stores/nodes";

const nodeTypes = {
  resource: ResourceNode,
  "custom-output": OutputNode,
  splitter: SplitterNode,
  order: OrderNode,
};

export default function NodeCanvas() {
  const {
    // updateEdgeSpeeds,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(nodeStore);

  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  // useEffect(() => {
  //   updateEdgeSpeeds();
  // }, [edges]);

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? "border-green-400" : "border-none"
      } border-4 h-full`}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      ></ReactFlow>
    </div>
  );
}
