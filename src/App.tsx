import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";
import { useStore } from "zustand";
import DraggableItem from "./components/DraggableItem";
import { DroppableOrderProps } from "./components/tasks/DroppableOrder";
import { SideTaskBar } from "./components/tasks/SideTaskBar";
import { nodeStore } from "./stores/nodes";
import { MCNodeType, MCOrderNode, MCPickerItem } from "./types/MCNodes";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";

function App() {
  const [isDropped, setIsDropped] = useState(false);
  const [active, setActive] = useState<Active | null>(null);

  const { project } = useReactFlow();

  const addNode = useStore(nodeStore, (state) => state.addNode);

  function handleDragStart(event: DragStartEvent) {
    setActive(event.active);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    if (event.over && event.over.id === "droppable") {
      console.log("EVENT: ", event.active.rect.current.translated);
      const projection = project({
        x: event.active.rect.current.translated?.left || 0,
        y: event.active.rect.current.translated?.top || 0,
      });
      // Check if its an order
      if (event.active.data.current?.task) {
        const data = event.active.data.current as DroppableOrderProps;
        const orderNode: Node<MCOrderNode> = {
          id: data.task.id,
          position: {
            x: projection.x,
            y: projection.y,
          },
          data: {
            task: data.task,
            id: data.task.id,
            dataType: MCNodeType.order,
          },
          type: MCNodeType.order,
        };
        addNode(orderNode);
        setIsDropped(true);
        return;
      }

      const itemInfo = event.active.data.current?.item as MCPickerItem;
      const node = {
        id: event.delta.x.toString(),
        position: {
          x: projection.x,
          y: projection.y,
        },
        data: {
          item: {
            itemId: itemInfo.itemId,
            spriteIndex: itemInfo.spriteIndex,
            title: itemInfo.title,
          },
          ratio: [1],
          dataType: itemInfo.dataType,
          id: event.delta.x.toString(),
        },
        type: itemInfo.dataType,
      };
      addNode(node);
      setIsDropped(true);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="grid absolute top-0 right-0 bottom-0 left-0 gap-2 p-2 h-full grid-rows-[1.8fr_1fr] grid-cols-[2fr_2fr_1.3fr]">
        <div className="col-span-2 border-4 bg-mc-300 border-mc-800">
          <NodeCanvas />
        </div>
        <div className="row-span-2 border-4 bg-mc-300 border-mc-800">
          <SideTaskBar />
        </div>
        <div className="overflow-y-scroll col-span-2 bg-mc-600">
          <ItemPicker />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {active && active.data.current?.item && isDropped ? (
          <DraggableItem higher item={active.data.current.item} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
