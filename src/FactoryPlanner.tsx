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

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex h-[100vh] max-h-screen flex-col pt-2">
        <div className="grid flex-grow grid-cols-[2fr_2fr_1.3fr] grid-rows-[1.8fr_1fr] gap-2 pr-2 pb-2 pl-2">
          <div className="outset-4 col-span-2 border-4 bg-mc-300">
            <NodeCanvas />
          </div>
          <div className="outset-4 row-span-2 border-4 bg-mc-300">
            <Sidebar />
          </div>
          <div className="outset-4 col-span-2 overflow-y-scroll border-4 bg-mc-300">
            <ItemPicker />
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{draggedItem}</DragOverlay>
    </DndContext>
  );
}

export default FactoryPlanner;
