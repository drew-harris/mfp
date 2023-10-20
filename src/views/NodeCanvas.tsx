import { useDroppable } from "@dnd-kit/core";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { MenuBar } from "../components/panels/MenuBar";
import CrafterNode from "../components/nodes/CrafterNode";
import InfoNode from "../components/nodes/InfoNode";
import OrderNode from "../components/nodes/OrderNode";
import ResourceNode from "../components/nodes/ResourceNode";
import SplitterNode from "../components/nodes/SplitterNode";
import { useNodeStore } from "../stores/nodes";
import DeleteButton from "../components/panels/DeleteButton";
import InfoEdge from "../components/nodes/edges/InfoEdge";
import BuilderNode from "../components/nodes/BuilderNode";

const nodeTypes = {
  resource: ResourceNode,
  splitter: SplitterNode,
  order: OrderNode,
  crafter: CrafterNode,
  info: InfoNode,
  builder: BuilderNode,
};

const edgeTypes = {
  default: InfoEdge,
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
      } h-full border-4`}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls
          style={{
            margin: 4,
          }}
          className="outset bg-mc-100"
        />
        <Background
          color="#808080"
          gap={48}
          lineWidth={2}
          variant={BackgroundVariant.Lines}
        ></Background>
        <Panel
          style={{
            margin: 4,
          }}
          position="top-left"
        >
          <MenuBar />
        </Panel>
        <Panel
          style={{
            margin: 4,
          }}
          position="top-right"
        >
          <div className="opacity-20">v{APP_VERSION}</div>
        </Panel>
        <Panel
          position="bottom-right"
          style={{
            margin: 4,
          }}
        >
          <DeleteButton />
        </Panel>
      </ReactFlow>
    </div>
  );
}
