import DraggableItem from "../components/DraggableItem";
import { outputItems, resourceItems } from "../hardcoded/resourceItems";
export default function ItemPicker() {
  return (
    <>
      <div className="grid p-2 grid-cols-3 gap-2">
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
