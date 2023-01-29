import { useEffect } from "react";
import DraggableInfoSquare from "../components/DraggableInfo";
import DraggableItem from "../components/DraggableItem";
import { crafterItems, resourceItems } from "../hardcoded/resourceItems";

export default function ItemPicker() {
  useEffect(() => {
    console.log(crafterItems);
  }, []);
  return (
    // BUG:  Not sure why 1vh works
    <div className="grid z-50 grid-cols-6 gap-1 p-2 max-h-[1vh]">
      {/* <DraggableSplittter /> */}
      <DraggableInfoSquare />
      {resourceItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
      {crafterItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
    </div>
  );
}
