import { useMemo, useState } from "react";
import { crafterItems, resourceItems } from "../../hardcoded/resourceItems";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { FilterType } from "../../stores/pickerFilterStore";
import DraggableItem from "../DraggableItem";
import DraggableSplitter from "../DraggableSplitter";
import FilterButton from "./FilterButton";

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
      <div className="top-0 z-50 mb-2 flex items-center justify-between border-2 border-b-mc-600 bg-mc-200 p-2">
        <input
          className="inset bg-mc-300 p-1 text-white placeholder:text-mc-100"
          placeholder="Search for items..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <div className="flex gap-2">
          <FilterButton type={FilterType.all} />
          <FilterButton type={FilterType.resource} />
          <FilterButton type={FilterType.crafter} />
          <FilterButton type={FilterType.utility} />
        </div>
      </div>

      {/* BUG:  Not sure why 1vh works */}
      <div className="z-40 grid max-h-[1vh] grid-cols-6 gap-2 px-2">
        <DraggableSplitter />
        {filteredItems.map((item) => (
          <DraggableItem item={item} key={item.itemId + item.dataType} />
        ))}
      </div>
    </>
  );
}
