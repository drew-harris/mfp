import ReactFlow, { Controls, Node, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";

export default function NodeCanvas() {
  const internals = useReactFlow();
  const nodes: Node[] = [
    {
      id: "1", // required
      position: { x: 0, y: 0 }, // required
      data: { label: "Hello" },
    },
  ];
  return (
    <>
      <ReactFlow className="" nodes={nodes}></ReactFlow>
    </>
  );
}
