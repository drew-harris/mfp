import { useDraggable } from "@dnd-kit/core";
import { DraggableOrder, Task } from "../../types/tasks";

export interface DroppableOrderProps {
  task: Task;
}

export const DroppableOrder = ({ task }: DroppableOrderProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task } as DraggableOrder,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div className="mt-5">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={`text-center grid p-3 place-items-center border-4 border-dashed bg-mc-200 border-mc-400 ${
          isDragging ? "min-h-[150px] drop-shadow-sm" : null
        }`}
      >
        <div>Drag To Canvas To Start</div>
      </div>
    </div>
  );
};
