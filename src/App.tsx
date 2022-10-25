import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { Node, ReactFlowProvider } from "reactflow";
import { useStore } from "zustand";
import { nodeStore } from "./stores/nodes";
import {
  MCItem,
  MCNode,
  MCNodeType,
  MCOutputNode,
  MCResourceNode,
} from "./types/MCNodes";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";

function App() {
  const [isDropped, setIsDropped] = useState(false);

  const addNode = useStore(nodeStore, (state) => state.addNode);

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === "droppable") {
      console.log(event.active.data.current?.item);
      const itemInfo = event.active.data.current?.item as MCItem;
      let data;

      if (itemInfo.dataType === MCNodeType.resource) {
        data = {
          ...itemInfo,
          outputRate: 0,
        };
      } else if (itemInfo.dataType === MCNodeType.output) {
        data = {
          ...itemInfo,
          outputRate: 0,
        };
      }

      if (data) {
        const node: Node<MCNode> = {
          id: event.delta.x.toString(),
          position: {
            x: 30,
            y: 40,
          },
          data,
          type: itemInfo.dataType,
        };
        addNode(node);
      }
      setIsDropped(true);
    }
  }

  return (
    <ReactFlowProvider>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-rows-[1.8fr_1fr] h-full absolute top-0 bottom-0 left-0 right-0 p-2 gap-2 grid-cols-[2fr_2fr_1.3fr]">
          <div className="bg-mc-300 border-4 border-mc-800 col-span-2">
            <NodeCanvas dropped={isDropped} />
          </div>
          <div className="bg-mc-600  row-span-2">test2</div>
          <div className="bg-mc-600 ">
            <ItemPicker />
          </div>
          <div className="bg-mc-600 ">test4</div>
        </div>
      </DndContext>
    </ReactFlowProvider>
  );
}

export default App;
