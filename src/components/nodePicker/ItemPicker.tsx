import { useMemo, useState } from "react";
import { crafterItems, resourceItems } from "../../hardcoded/resourceItems";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { FilterType } from "../../stores/pickerFilterStore";
import { MCNodeType } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import FilterButton from "./FilterButton";
import PickerSquare, { DraggableProps } from "./PickerSquare";

const createItemSearchList = (): DraggableProps[] => {
  const searchItems: DraggableProps[] = [
    {
      mainLabel: "Splitter",
      payload: { type: MCNodeType.splitter },
    },
    {
      mainLabel: "Builder",
      payload: {
        type: MCNodeType.builder,
      },
    },
  ];

  // Add the resource items
  searchItems.push(
    ...resourceItems.map(
      (item) =>
        ({
          payload: { item, type: MCNodeType.resource },
          mainLabel: item.title,
          topLabel: "Resource",
          image: <SpriteDisplay url={item.imageUrl} />,
        } as DraggableProps)
    ),
    // Add the crafters
    ...crafterItems.map(
      (item) =>
        ({
          payload: { item, type: MCNodeType.crafter },
          topLabel: "Crafter",
          image: <SpriteDisplay url={item.imageUrl} />,
          mainLabel: item.title,
        } as DraggableProps)
    )
  );

  return searchItems;
};

export default function ItemPicker() {
  const [search, setSearch] = useState("");
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const currentTask = useObjectiveStore((s) => s.currentTask);

  // TODO: Optimize
  const filteredItems = useMemo(() => {
    const searchables = createItemSearchList();
    return searchables.filter((prop) => {
      if (currentTask?.idPool) {
        let pool: string[] = [];
        if (currentTask.idPool === "inherit") {
          pool = currentMission?.idPool || [];
        } else {
          pool = currentTask.idPool;
        }

        if (
          (prop.payload.type === MCNodeType.resource ||
            prop.payload.type === MCNodeType.crafter) &&
          !pool.includes(prop?.payload?.item?.itemId)
        )
          return false;
      }

      if (search === "") return true;

      if (prop.topLabel.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }

      return false;
    });
  }, [currentTask, currentMission, search]);

  return (
    <>
      <div className="top-0 z-50 mb-2 flex items-center justify-between border-2 border-b-mc-600 bg-mc-200 p-2">
        <input
          className="inset bg-mc-300 p-1 text-white placeholder:text-mc-100"
          placeholder="Search for items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        {filteredItems.map((i) => (
          <PickerSquare {...i} key={JSON.stringify(i.payload)} />
        ))}
      </div>
    </>
  );
}
