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
import { MenuBar } from "./components/MenuBar";
import { SideTaskBar } from "./components/tasks/SideTaskBar";
import { useNodeStore } from "./stores/nodes";
import { DraggableData, MCNodeType } from "./types/MCNodes";
import { processPickerItem } from "./utils/processPickerItem";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";

function App() {
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
    if (active.data?.current?.item) {
      draggedItem = <DraggableItem item={active.data.current.item} higher />;
    } else if (active.data.current?.type == MCNodeType.order) {
      // The draggable order is translated directly in the component so it does not
      // render a duplicate
      draggedItem = null;
    } else {
      draggedItem = <DraggableInfoSquare />;
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col max-h-screen h-[100vh]">
        <div className="flex gap-2 items-center p-2">
          <MenuBar />
        </div>
        <div className="grid flex-grow gap-2 pr-2 pb-2 pl-2 grid-rows-[1.8fr_1fr] grid-cols-[2fr_2fr_1.3fr]">
          <div className="col-span-2 border-4 bg-mc-300 border-mc-800">
            <NodeCanvas />
          </div>
          <div className="row-span-2 border-4 bg-mc-300 border-mc-800">
            <SideTaskBar />
          </div>
          <div className="overflow-y-scroll col-span-2 border-4 border-mc-800 bg-mc-300">
            <ItemPicker />
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{draggedItem}</DragOverlay>
    </DndContext>
  );
}

export default App;
