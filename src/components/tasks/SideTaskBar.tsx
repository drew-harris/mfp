import { useEffect, useState } from "react";
import { allTasks } from "../../hardcoded/tasks";
import { useFullItem } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { MCNodeType } from "../../types/MCNodes";
import { ItemRequirement, Task } from "../../types/tasks";
import { SpriteDisplay } from "../SpriteDisplay";
import { DroppableOrder } from "./DroppableOrder";

export const SideTaskBar = () => {
  const [task, setTask] = useState<Task | null>(null);
  const removeOrder = useNodeStore((state) => state.removeOrderNode);
  const possibleOrderNode = useNodeStore((state) =>
    state.nodes.find((n) => n.data.dataType === MCNodeType.order)
  );

  useEffect(() => {
    if (possibleOrderNode?.data.dataType == MCNodeType.order) {
      if (possibleOrderNode.data.task) {
        setTask(possibleOrderNode.data.task);
      }
    }
  }, [possibleOrderNode]);

  const clearTask = () => {
    removeOrder();
    setTask(null);
  };

  return (
    <div>
      {!task ? (
        <>
          <div className="text-lg font-bold">Tasks</div>
          <div>
            {allTasks.map((task) => (
              <TaskCard setTask={setTask} key={task.id} task={task} />
            ))}
          </div>
        </>
      ) : (
        <>
          <SideTaskView clearTask={clearTask} task={task} />
        </>
      )}
    </div>
  );
};

interface SideTaskViewProps {
  task: Task;
  clearTask: () => void;
}

const SideTaskView = ({ task, clearTask }: SideTaskViewProps) => {
  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">Current Task:</div>
        <button onClick={clearTask}>Clear Task</button>
      </div>
      <div className="text-xl font-bold text-center">{task.title}</div>
      <div className="text-center text-mc-700">{task.description}</div>
      <div className="flex flex-wrap gap-y-3 justify-around items-center p-3 m-auto mt-3 bg-mc-200">
        {task.itemRequirements?.map((requirement) => (
          <RequirementView key={requirement.itemId} requirement={requirement} />
        ))}
      </div>
      <DroppableOrder task={task} />
    </div>
  );
};

export const RequirementView = ({
  requirement,
  className,
}: {
  requirement: ItemRequirement;
  className?: string;
}) => {
  const item = useFullItem(requirement.itemId);
  return (
    <div className={`flex ${className}`}>
      <div className="flex gap-4 items-center">
        <SpriteDisplay spriteIndex={item?.spriteIndex} />
        <div>x {requirement.perHour}</div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  setTask: (task: Task) => void;
}

const TaskCard = ({ task, setTask }: TaskCardProps) => {
  return (
    <div
      onClick={() => setTask(task)}
      className="p-4 mt-3 cursor-pointer bg-mc-200"
    >
      <div className="font-bold">{task.title}</div>
    </div>
  );
};
