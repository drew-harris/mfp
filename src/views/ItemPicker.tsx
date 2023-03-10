import { useMemo, useState } from "react";
import DraggableInfoSquare from "../components/DraggableInfo";
import DraggableItem from "../components/DraggableItem";
import DraggableSplitter from "../components/DraggableSplitter";
import { crafterItems, resourceItems } from "../hardcoded/resourceItems";
import { useObjectiveStore } from "../stores/objectiveStore";

export default function ItemPicker() {
  const allItems = [...resourceItems, ...crafterItems];
  const [input, setInput] = useState("");
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const currentTask = useObjectiveStore((s) => s.currentTask);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (currentTask?.idPool) {
        let pool: string[] = [];
        if (currentTask.idPool === "inherit") {
          pool = currentMission?.idPool || [];
        } else {
          pool = currentTask.idPool;
        }

        if (!pool.includes(item.itemId)) return false;
      }

      if (input === "") return true;

      if (item.title.toLowerCase().includes(input.toLowerCase())) {
        return true;
      }

      return false;
    });
  }, [currentTask, currentMission, input]);

  return (
    <>
      <div className="mb-2 bg-mc-300 border-2  border-b-mc-600 z-50 p-2 sticky top-0">
        {/* TODO: Make input sticky */}
        <input
          className="p-1 inset"
          placeholder="Search for items"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>

      {/* BUG:  Not sure why 1vh works */}
      <div className="grid z-40 grid-cols-6 gap-2 px-2 max-h-[1vh]">
        <DraggableInfoSquare />
        <DraggableSplitter />
        {filteredItems.map((item) => (
          <DraggableItem item={item} key={item.itemId + item.dataType} />
        ))}
      </div>
    </>
  );
}
