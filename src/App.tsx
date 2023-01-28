import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useReactFlow } from "reactflow";
import { useStore } from "zustand";
import DraggableItem from "./components/DraggableItem";
import { MenuBar } from "./components/MenuBar";
import { SideTaskBar } from "./components/tasks/SideTaskBar";
import { nodeStore } from "./stores/nodes";
import { DraggableData } from "./types/MCNodes";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";
import { processPickerItem } from "./views/utils/processPickerItem";

function App() {
  const [active, setActive] = useState<Active | null>(null);
  const { project } = useReactFlow();

  const addNode = useStore(nodeStore, (state) => state.addNode);

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
      <DragOverlay dropAnimation={null}>
        {active && active.data.current?.item ? (
          <DraggableItem higher item={active.data.current.item} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
