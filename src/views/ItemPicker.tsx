import DraggableItem from "../components/DraggableItem";
import { crafterItems, resourceItems } from "../hardcoded/resourceItems";

export default function ItemPicker() {
  return (
    <div className="grid z-50 grid-cols-6 gap-1 p-2 max-h-[1vh]">
      {/* <DraggableSplittter /> */}
      {resourceItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
      {crafterItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
    </div>
  );
}
