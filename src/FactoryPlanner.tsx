/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useReactFlow } from "reactflow";
import DraggableInfoSquare from "./components/DraggableInfo";
import DraggableItem from "./components/DraggableItem";
import DraggableSplitter from "./components/DraggableSplitter";
import { Sidebar } from "./components/tasks/Sidebar";
import { useNodeStore } from "./stores/nodes";
import { DraggableData, DraggableType, MCNodeType } from "./types/MCNodes";
import { processPickerItem } from "./utils/processPickerItem";
import ItemPicker from "./components/nodePicker/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";
import SplitPane from "react-split-pane";

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

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="debug relative h-[100vh]">
        {/*@ts-ignore*/}
        <SplitPane
          resizerStyle={{
            border: "2px solid #5d5d5d",
            cursor: "col-resize",
          }}
          split="vertical"
          primary="second"
          minSize={300}
          defaultSize={"20%"}
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
            <div className="outset-4 col-span-2 h-full w-full border-4 bg-mc-300">
              <NodeCanvas />
            </div>
            <div className="outset-4 col-span-2 h-full overflow-y-scroll border-4 bg-mc-300">
              <ItemPicker />
            </div>
          </SplitPane>
          <div className="outset-4 relative row-span-2 h-full border-4 bg-mc-300">
            <Sidebar />
          </div>
        </SplitPane>
      </div>

      <DragOverlay dropAnimation={null}>{draggedItem}</DragOverlay>
    </DndContext>
  );
}

export default FactoryPlanner;
