import { MCItem } from "../types/MCNodes";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface DraggableItemProps {
  item: MCItem;
}

export default function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.itemId,
    data: { item },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="border-4 bg-mc-400 flex flex-col items-center border-mc-700 p-3"
    >
      <div>{item.title}</div>
      <img src="/grass.png"></img>
    </div>
  );
}
