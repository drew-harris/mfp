import { useState } from "react";
import DraggableInfoSquare from "../components/DraggableInfo";
import DraggableItem from "../components/DraggableItem";
import { crafterItems, resourceItems } from "../hardcoded/resourceItems";

export default function ItemPicker() {
  const allItems = [...resourceItems, ...crafterItems];
  const [input, setInput] = useState("");

  const filteredItems = allItems.filter((item) => {
    if (input === "") return true;

    console.log(input.toLowerCase(), item.title.toLowerCase());
    if (item.title.toLowerCase().includes(input.toLowerCase())) {
      return true;
    }

    return false;
  });

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
        {/* <DraggableSplittter /> */}
        <DraggableInfoSquare />
        {filteredItems.map((item) => (
          <DraggableItem item={item} key={item.itemId + item.dataType} />
        ))}
      </div>
    </>
  );
}
