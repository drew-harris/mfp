import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { Node } from "reactflow";
import { useStore } from "zustand";
import DraggableItem from "./components/DraggableItem";
import { nodeStore } from "./stores/nodes";
import {
  DraggableData,
  MCNode,
  MCNodeType,
  MCPickerItem,
  MCSplitterNode,
} from "./types/MCNodes";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";

function App() {
  const [isDropped, setIsDropped] = useState(false);
  const [active, setActive] = useState<Active | null>(null);

  const addNode = useStore(nodeStore, (state) => state.addNode);

  function handleDragStart(event: DragStartEvent) {
    setActive(event.active);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActive(null);
    if (event.over && event.over.id === "droppable") {
      const data = event.active.data.current as DraggableData;
      if (data.type === MCNodeType.splitter) {
        console.log("Creating splitter.");
        const node: Node<MCSplitterNode> = {
          id: event.delta.x.toString(),
          position: {
            x: 30,
            y: 40,
          },
          data: {
            ratio: [1],
            dataType: MCNodeType.splitter,
            id: event.delta.x.toString(),
          },
          type: data.type,
        };
        addNode(node);
        setIsDropped(true);
        return;
      }

      const itemInfo = event.active.data.current?.item as MCPickerItem;
      const node: Node<MCNode> = {
        id: event.delta.x.toString(),
        position: {
          x: 30,
          y: 30,
        },
        data: {
          item: {
            itemId: itemInfo.itemId,
            spriteIndex: itemInfo.spriteIndex,
            title: itemInfo.title,
          },
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
      <div className="grid grid-rows-[1.8fr_1fr] h-full absolute top-0 bottom-0 left-0 right-0 p-2 gap-2 grid-cols-[2fr_2fr_1.3fr]">
        <div className="bg-mc-300 border-4 border-mc-800 col-span-2">
          <NodeCanvas />
        </div>
        <div className="bg-mc-600 row-span-2">test2</div>
        <div className="bg-mc-600 overflow-y-scroll col-span-2">
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
