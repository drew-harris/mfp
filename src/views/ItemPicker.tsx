import DraggableItem from "../components/DraggableItem";
import { outputItems, resourceItems } from "../hardcoded/resourceItems";
export default function ItemPicker() {
  return (
    <>
      <div className="grid z-20 p-2 grid-cols-6 gap-1">
        {resourceItems.map((item) => (
          <DraggableItem item={item} key={item.itemId} />
        ))}
        {outputItems.map((item) => (
          <DraggableItem item={item} key={item.itemId} />
        ))}
      </div>
    </>
  );
}
