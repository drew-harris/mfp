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
    <div className="p-2">
      <div className="mb-2">
        <input
          className="p-1"
          placeholder="Search for items"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>

      {/* BUG:  Not sure why 1vh works */}
      <div className="grid z-50 grid-cols-6 gap-1 max-h-[1vh]">
        {/* <DraggableSplittter /> */}
        <DraggableInfoSquare />
        {filteredItems.map((item) => (
          <DraggableItem item={item} key={item.itemId + item.dataType} />
        ))}
      </div>
    </div>
  );
}
