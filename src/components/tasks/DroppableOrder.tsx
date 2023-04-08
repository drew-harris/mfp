import { useDraggable } from "@dnd-kit/core";
import { useNodeStore } from "../../stores/nodes";
import { MCNodeType } from "../../types/MCNodes";
import { DraggableOrderData, Task } from "../../types/tasks";
import { RequirementView } from "./RequirementView";

export interface DroppableOrderProps {
  task: Task;
}

export const DroppableOrder = ({ task }: DroppableOrderProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task, type: MCNodeType.order } as DraggableOrderData,
  });

  const nodes = useNodeStore((s) => s.nodes);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : null;

  // Only show if the grid does not have any order nodes on it

  const hasNodeAlready =
    nodes.findIndex((node) => node.data.dataType === MCNodeType.order) > -1;

  if (hasNodeAlready) {
    return null;
  }

  if (!task.itemRequirements) {
    return null;
  }

  return (
    <>
      <div className="mt-6 mb-4 text-center text-sm text-mc-700">
        Drag the order onto the canvas to begin.
      </div>
      <div className="flex justify-center">
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          className="bg-orange-300 p-1 text-white shadow"
        >
          <div className="text-center text-black">Order</div>
          <div className="bg-white p-2 text-black">
            {task.itemRequirements?.map((requirement) => (
              <div className="flex items-center gap-3" key={requirement.itemId}>
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
