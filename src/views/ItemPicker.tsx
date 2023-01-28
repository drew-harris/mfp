import DraggableItem from "../components/DraggableItem";
import DraggableSplittter from "../components/DraggableSplitter";
import {
  outputItems,
  resourceItems,
  crafterItems,
} from "../hardcoded/resourceItems";
export default function ItemPicker() {
  return (
    <div className="grid z-50 grid-cols-6 gap-1 p-2 max-h-[1vh]">
      {/* <DraggableSplittter /> */}
      {resourceItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
      {outputItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
      {crafterItems.map((item) => (
        <DraggableItem item={item} key={item.itemId} />
      ))}
    </div>
  );
}
