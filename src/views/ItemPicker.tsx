import { useMemo, useState } from "react";
import DraggableInfoSquare from "../components/DraggableInfo";
import DraggableItem from "../components/DraggableItem";
import DraggableSplitter from "../components/DraggableSplitter";
import { crafterItems, resourceItems } from "../hardcoded/resourceItems";
import { useObjectiveStore } from "../stores/objectiveStore";

export default function ItemPicker() {
  const [input, setInput] = useState("");
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const currentTask = useObjectiveStore((s) => s.currentTask);

  const filteredItems = useMemo(() => {
    const allItems = [...resourceItems, ...crafterItems];
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
      <div className="sticky top-0 z-50 mb-2 border-2 border-b-mc-600 bg-mc-200 p-2">
        {/* TODO: Make input sticky */}
        <input
          className="inset p-1"
          placeholder="Search for items"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>

      {/* BUG:  Not sure why 1vh works */}
      <div className="z-40 grid max-h-[1vh] grid-cols-6 gap-2 px-2">
        <DraggableInfoSquare />
        <DraggableSplitter />
        {filteredItems.map((item) => (
          <DraggableItem item={item} key={item.itemId + item.dataType} />
        ))}
      </div>
    </>
  );
}
