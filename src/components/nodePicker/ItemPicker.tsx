import {
  faArrowsSplitUpAndLeft,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { crafterItems, resourceItems } from "../../hardcoded/resourceItems";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import PickerSquare, { DraggableProps } from "./PickerSquare";
import { PickerSelect } from "./TypeSelect";
import { useCustomNodeList } from "../../hooks/useCustomNodeList";

export type SelectOption =
  | "all"
  | "resource"
  | "crafter"
  | "utility"
  | "custom";

const createItemSearchList = (
  customNodes: ReturnType<typeof useCustomNodeList>
): DraggableProps[] => {
  const searchItems: DraggableProps[] = [
    {
      topLabel: "Utility",
      mainLabel: "Splitter",
      payload: { type: MCNodeType.splitter },
      image: <FontAwesomeIcon icon={faArrowsSplitUpAndLeft} size="2x" />,
    },
    {
      topLabel: "Utility",
      mainLabel: "Builder",
      payload: {
        type: MCNodeType.builder,
      },
      image: <FontAwesomeIcon icon={faGears} size="2x" />,
    },
    ...customNodes.map((cn) => {
      return {
        payload: {
          type: MCNodeType.custom,
          queryData: cn
        },
        topLabel: "Custom Node",
        mainLabel: cn.name
      } satisfies DraggableProps;
    }),
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
  const [selectOption, setSelectOption] = useState<SelectOption>("all");
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const customNodes = useCustomNodeList();

  // TODO: Optimize
  const filteredItems = useMemo(() => {
    const searchables = createItemSearchList(customNodes);
    return searchables.filter((prop) => {
      if (currentTask?.idPool) {
        let pool: string[];
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

      if (selectOption !== "all") {
        switch (selectOption) {
          case "resource": {
            if (prop.payload.type === MCNodeType.resource) return true;
            return false;
          }
          case "crafter": {
            if (prop.payload.type === MCNodeType.crafter) return true;
            return false;
          }
          case "utility": {
            if (prop.payload.type === MCNodeType.splitter) return true;
            if (prop.payload.type === MCNodeType.builder) return true;
            return false;
          }
          case "custom": {
            if (prop.payload.type === MCNodeType.custom) return true;
            break;
          }
        }
        return false;
      }

      if (search === "") return true;

      if (prop.topLabel?.toLowerCase().includes(search?.toLowerCase())) {
        return true;
      }

      if (prop?.mainLabel?.toLowerCase()?.includes(search?.toLowerCase())) {
        return true;
      }

      return false;
    });
  }, [currentTask, currentMission, search, selectOption, customNodes]);

  return (
    <>
      <div className="sticky top-0 z-50 mb-2 flex items-center justify-between border-2 border-b-mc-600 bg-mc-200 p-2">
        <input
          className="inset bg-mc-300 p-1 text-white placeholder:text-mc-100"
          placeholder="Search for items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <PickerSelect selected={selectOption} setSelected={setSelectOption} />
      </div>

      {/* BUG:  Not sure why 1vh works */}
      <div className="grid max-h-[1vh] grid-cols-6 gap-2 px-2">
        {filteredItems.map((i) => (
          <PickerSquare {...i} key={JSON.stringify(i.payload)} />
        ))}
      </div>
    </>
  );
}
