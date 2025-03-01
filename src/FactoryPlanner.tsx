/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Active, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import SplitPane from "react-split-pane";
import { useReactFlow } from "reactflow";
import { GetCustomNodeQuery, LogType } from "./__generated__/graphql";
import Notifications from "./components/Notifications";
import Sidebar from "./components/Sidebar";
import ItemPicker from "./components/nodePicker/ItemPicker";
import PickerSquare, { DraggableProps } from "./components/nodePicker/PickerSquare";
import { useNodeStore } from "./stores/nodes";
import { processPickerItem } from "./utils/processPickerItem";
import NodeCanvas from "./views/NodeCanvas";
import { logNode, sendLog } from "./api/logs";
import { useObjectiveStore } from "./stores/objectiveStore";
import { MCNodeType } from "./types/MCNodes";
import { allRecipes } from "./hardcoded/recipes";

interface FactoryPlannerProps {
  customNodeEdit?: boolean;
}

function handleResize(): null {
  sendLog(LogType.MfpResizeWindow);
  return null
}

function FactoryPlanner(props: FactoryPlannerProps) {
  const currentTask = useObjectiveStore((s) => s.currentTask)?.id || "no task";
  const [active, setActive] = useState<Active | null>(null);
  const { project } = useReactFlow();

  const addNode = useNodeStore((state) => state.addNode);
  const setNodesAndEdges = useNodeStore((s) => s.internal.setNodesAndEdges);

  function handleDragStart(event: DragStartEvent) {
    setActive(event.active);
  }

  const data = useLoaderData() as GetCustomNodeQuery["customNode"];

  useEffect(() => {
    console.log("oloader data", data);
    if (data) {
      setNodesAndEdges(data.graphData.nodes, data.graphData.edges);
    }
  }, [data, setNodesAndEdges]);

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    if (event.over && event.over.id === "droppable") {
      const projection = project({
        x: event.active.rect.current.translated?.left || 0,
        y: event.active.rect.current.translated?.top || 0
      });
      const item = event.active.data.current as unknown as DraggableProps;
      const node = processPickerItem(item.payload, projection);

      logNode(LogType.MfpDropNode, node)

      if (node) {
        addNode(node);
      } else {
        console.log("No node returned");
      }
    }
  }

  let draggedItem = null;

  if (active) {
    const data = active.data.current as unknown as DraggableProps;
    draggedItem = <PickerSquare {...data} />;
  }

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="relative h-[100vh]">
        {/*@ts-ignore*/}
        <SplitPane
          resizerStyle={{
            border: "2px solid #343a40",
            cursor: "col-resize"
          }}
          split="vertical"
          primary="second"
          minSize={300}
          maxSize={screenWidth * 0.5}
          defaultSize={300}
        >
          {/*@ts-ignore*/}
          <SplitPane
            split="horizontal"
            resizerStyle={{
              border: "2px solid #343a40",
              cursor: "row-resize"
            }}
            defaultSize={screenHeight * 0.7}
            minSize={200}
            maxSize={screenHeight * 0.9}
          >
            <div className="outset-4 relative col-span-2 h-full w-full border-4 bg-mc-300 z-50">
              <NodeCanvas />
              <Notifications className="absolute top-0 right-0 z-30 p-2" />
            </div>
            <div className="outset-4 col-span-2 h-full overflow-y-scroll border-4 bg-mc-300">
            <ItemPicker />
            </div>
          </SplitPane>
          <div className="outset-4 relative row-span-2 flex h-full flex-col justify-between border-4 bg-mc-300">
            <div className="h-full">
              <Sidebar />
            </div>
          </div>
        </SplitPane>
      </div>

      <DragOverlay dropAnimation={null}>{draggedItem}</DragOverlay>
    </DndContext>
  );
}

export default FactoryPlanner;
