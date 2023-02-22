import { useEffect } from "react";
import { allMissions } from "../../hardcoded/missions";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { Mission, Task } from "../../types/tasks";
import { DroppableOrder } from "./DroppableOrder";
import { SidebarTaskChecks } from "./SidebarTaskChecks";

export const Sidebar = () => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  // const currentMission = useObjectiveStore((s) => s.currentMission);
  const removeOrder = useNodeStore((state) => state.removeOrderNode);
  const cancelMission = useObjectiveStore((s) => s.cancelMission);
  const beginMission = useObjectiveStore((s) => s.beginMission);

  const possibleOrderNode = useNodeStore((state) =>
    state.nodes.find((n) => n.data.dataType === MCNodeType.order)
  );

  // TODO: Fix saving states of tasks
  useEffect(() => {
    if (possibleOrderNode?.data.dataType == MCNodeType.order) {
      if (possibleOrderNode.data.task) {
        const task = possibleOrderNode.data.task;
        const possibleMission = findMissionFromTask(task, allMissions);
        if (possibleMission) {
          beginMission(possibleMission);
        }
      }
    }
  }, [possibleOrderNode]);

  const clearTask = () => {
    cancelMission();
    removeOrder();
  };

  return (
    <div>
      {!currentTask ? (
        <>
          <div className="text-lg font-bold">Tasks</div>
          <div>
            {allMissions.map((mission) => (
              <MissionCard
                setMission={beginMission}
                key={mission.title}
                mission={mission}
              />
            ))}
          </div>
        </>
      ) : (
        <SideTaskView clearTask={clearTask} task={currentTask} />
      )}
    </div>
  );
};

export function findMissionFromTask(
  task: Task,
  missions: Mission[]
): Mission | null {
  const foundMissions = missions.filter((m) => {
    if (m.tasks.find((t) => t.id === task.id)) return true;
  });

  if (foundMissions.length != 1) return null;

  return missions[0];
}

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
      <SidebarTaskChecks task={task} />
      <DroppableOrder task={task} />
    </div>
  );
};

interface TaskCardProps {
  mission: Mission;
  setMission: (task: Mission) => void;
}

const MissionCard = ({ mission: task, setMission }: TaskCardProps) => {
  return (
    <div
      onClick={() => setMission(task)}
      className="p-4 mt-3 cursor-pointer bg-mc-200"
    >
      <div className="font-bold">{task.title}</div>
    </div>
  );
};
