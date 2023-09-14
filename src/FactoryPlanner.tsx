/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import SplitPane from "react-split-pane";
import { useReactFlow } from "reactflow";
import DraggableInfoSquare from "./components/DraggableInfo";
import DraggableItem from "./components/DraggableItem";
import DraggableSplitter from "./components/DraggableSplitter";
import Graph from "./components/graph/Graph";
import ItemPicker from "./components/nodePicker/ItemPicker";
import Notifications from "./components/Notifications";
import Sidebar from "./components/Sidebar";
import { useNodeStore } from "./stores/nodes";
import { DraggableData, DraggableType, MCNodeType } from "./types/MCNodes";
import { processPickerItem } from "./utils/processPickerItem";
import NodeCanvas from "./views/NodeCanvas";

function FactoryPlanner() {
  const [active, setActive] = useState<Active | null>(null);
  const { project } = useReactFlow();

  const addNode = useNodeStore((state) => state.addNode);

  function handleDragStart(event: DragStartEvent) {
    setActive(event.active);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    if (event.over && event.over.id === "droppable") {
      const projection = project({
        x: event.active.rect.current.translated?.left || 0,
        y: event.active.rect.current.translated?.top || 0,
      });
      const item = event.active.data.current as unknown as DraggableData;
      const node = processPickerItem(item, projection);
      if (node) {
        addNode(node);
      } else {
        console.log("No node returned");
      }
    }
  }

  let draggedItem = null;

  if (active) {
    console.log(active.data.current);
    const data = active.data.current as unknown as DraggableData;
    if (data.draggableType === DraggableType.item) {
      draggedItem = <DraggableItem item={data.item} higher />;
    } else if (active.data.current["type"] === MCNodeType.order) {
      // The draggable order is translated directly in the component so it does not
      // render a duplicate
      draggedItem = null;
    } else if (data.draggableType === DraggableType.info) {
      console.log("Dragging info");
      draggedItem = <DraggableInfoSquare />;
    } else {
      draggedItem = <DraggableSplitter />;
    }
  }

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="relative h-[100vh]">
        {/*@ts-ignore*/}
        <SplitPane
          resizerStyle={{
            border: "2px solid #5d5d5d",
            cursor: "col-resize",
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
              border: "2px solid #5d5d5d",
              cursor: "row-resize",
            }}
            defaultSize={screenHeight * 0.7}
            minSize={200}
            maxSize={screenHeight * 0.9}
          >
            <div className="outset-4 relative col-span-2 h-full w-full border-4 bg-mc-300">
              <NodeCanvas />
              <Notifications className="absolute top-0 right-0 z-30 p-2" />
            </div>
            <div className="outset-4 col-span-2 h-full overflow-y-scroll border-4 bg-mc-300">
              <ItemPicker />
            </div>
          </SplitPane>
          <div className="outset-4 relative row-span-2 flex h-full flex-col justify-between border-4 bg-mc-300">
            <div className="h-full pb-11">
              <Sidebar />
              <Graph />
            </div>
          </div>
        </SplitPane>
      </div>

      <DragOverlay dropAnimation={null}>{draggedItem}</DragOverlay>
    </DndContext>
  );
}

export default FactoryPlanner;
