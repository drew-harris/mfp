import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import ReactFlow, { Node, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { useStore } from "zustand";
import ResourceNode from "../components/nodes/ResourceNode";
import { nodeStore } from "../stores/nodes";

export default function NodeCanvas({ dropped }: { dropped: boolean }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useStore(nodeStore);

  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const nodeTypes = useMemo(() => ({ resource: ResourceNode }), []);

  return (
    <div
      ref={setNodeRef}
      className={`${isOver ? "border-green-700" : null} border-2 h-full`}
    >
      <ReactFlow
        className=""
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      ></ReactFlow>
    </div>
  );
}
