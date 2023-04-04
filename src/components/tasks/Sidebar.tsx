import { useContext, useEffect } from "react";
import { allMissions } from "../../hardcoded/missions";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { Mission, Task } from "../../types/tasks";
import { TaskCompleteContext } from "../contexts/TaskCompleteProvider";
import { DroppableOrder } from "./DroppableOrder";
import { SidebarTaskChecks } from "./SidebarTaskChecks";

export const Sidebar = () => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const removeOrder = useNodeStore((state) => state.removeOrderNode);
  const cancelMission = useObjectiveStore((s) => s.cancelMission);
  const beginMission = useObjectiveStore((s) => s.beginMission);
  // const nextTask = useObjectiveStore((s) => {
  //   s.nextTask;
  // });

  const data = useContext(TaskCompleteContext);

  const possibleOrderNode = useNodeStore((state) =>
    state.nodes.find((n) => n.data.dataType === MCNodeType.order)
  );

  useEffect(() => {
    if (
      possibleOrderNode?.data.dataType === MCNodeType.order &&
      possibleOrderNode.data.task
    ) {
      const task = possibleOrderNode.data.task;
      const possibleMission = findMissionFromTask(task);
      if (possibleMission) {
        beginMission(possibleMission);
      }
    }
  }, [possibleOrderNode, beginMission]);

  const clearTask = () => {
    cancelMission();
    removeOrder();
  };

  return (
    <div className="p-3">
      {currentTask ? (
        <>
          <SideTaskView clearTask={clearTask} task={currentTask} />
          {data.taskComplete && data.efficiency && (
            <div className="mb-4 text-center text-lg">
              Efficiency: {data.efficiency * 100}%
            </div>
          )}
          {data.taskComplete && (
            <button
              onClick={() => alert("Assignment Submitted")}
              className="outset mx-auto block bg-mc-200 p-3"
            >
              Submit
            </button>
          )}
          <div>
            {data.messages.map((m) => (
              <div className="outset bg-red-300 p-2" key={m.message}>
                {m.message}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-bold">Missions</div>
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
      )}
    </div>
  );
};

export function findMissionFromTask(
  task: Task,
  missions: Mission[] = allMissions
): Mission | null {
  const foundMissions = missions.filter((m) => {
    if (m.tasks.some((t) => t.id === task.id)) return true;
    return false;
  });

  if (foundMissions.length !== 1) return null;

  return foundMissions[0] || null;
}

interface SideTaskViewProperties {
  task: Task;
  clearTask: () => void;
}

const SideTaskView = ({ task, clearTask }: SideTaskViewProperties) => {
  return (
    <div className="p-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-bold">Current Task:</div>
        <button onClick={clearTask}>Clear Task</button>
      </div>
      <div className="text-center text-xl font-bold">{task.title}</div>
      <div className="text-center text-mc-700">{task.description}</div>
      <SidebarTaskChecks task={task} />
      <DroppableOrder task={task} />
    </div>
  );
};

interface MissionCardProperties {
  mission: Mission;
  setMission: (mission: Mission) => void;
}

const MissionCard = ({ mission, setMission }: MissionCardProperties) => {
  return (
    <div
      onClick={() => setMission(mission)}
      className="outset-4 mt-3 cursor-pointer bg-mc-200 p-4"
    >
      <div className="font-bold">{mission.title}</div>
    </div>
  );
};
