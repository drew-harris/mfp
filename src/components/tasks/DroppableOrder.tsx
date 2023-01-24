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
    <>
      <div className="mt-6 mb-4 text-sm text-center text-mc-700">
        Drag the order onto the canvas to begin.
      </div>
      <div className="flex justify-center">
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          className="p-1 text-white bg-orange-300 shadow"
        >
          <div className="text-center text-black">Order</div>
          <div className="p-2 text-black bg-white">
            {task.itemRequirements?.map((requirement) => (
              <div className="flex gap-3 items-center" key={requirement.itemId}>
                <RequirementView
                  className="my-2 text-black"
                  requirement={requirement}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
