import { useDraggable } from "@dnd-kit/core";
import { useStore } from "zustand";
import { nodeStore } from "../../stores/nodes";
import { MCNodeType } from "../../types/MCNodes";
import { DraggableOrderData, Task } from "../../types/tasks";
import { RequirementView } from "./SideTaskBar";

export interface DroppableOrderProps {
  task: Task;
}

export const DroppableOrder = ({ task }: DroppableOrderProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task } as DraggableOrderData,
    });

  const { nodes } = useStore(nodeStore);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Only show if the grid does not have any order nodes on it

  const hasNodeAlready =
    nodes.findIndex((node) => node.data.dataType === MCNodeType.order) > -1;

  if (hasNodeAlready) {
    return null;
  }
  return (
    <div className="flex justify-center mt-5">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="p-1 text-white bg-orange-300 shadow"
      >
        <div className="text-center text-black">Order</div>
        <div className="p-2 bg-white">
          {task.itemRequirements?.map((requirement) => (
            <RequirementView
              className="text-black"
              requirement={requirement}
              key={requirement.itemId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
