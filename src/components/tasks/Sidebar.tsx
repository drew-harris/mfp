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
    if (possibleOrderNode?.data.dataType == MCNodeType.order) {
      if (possibleOrderNode.data.task) {
        const task = possibleOrderNode.data.task;
        const possibleMission = findMissionFromTask(task);
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
    <div className="p-3">
      {!currentTask ? (
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
      ) : (
        <>
          <SideTaskView clearTask={clearTask} task={currentTask} />
          {data.taskComplete && data.efficiency && (
            <div className="text-center mb-4 text-lg">
              Efficiency: {data.efficiency * 100}%
            </div>
          )}
          {data.taskComplete && (
            <button
              onClick={() => alert("Assignment Submitted")}
              className="bg-mc-200 p-3 mx-auto block outset"
            >
              Submit
            </button>
          )}
          <div>
            {data.messages.map((m) => (
              <div className="bg-red-300 p-2 outset" key={m.message}>
                {m.message}
              </div>
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
    if (m.tasks.find((t) => t.id === task.id)) return true;
  });

  if (foundMissions.length != 1) return null;

  return foundMissions[0];
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

interface MissionCardProps {
  mission: Mission;
  setMission: (mission: Mission) => void;
}

const MissionCard = ({ mission, setMission }: MissionCardProps) => {
  return (
    <div
      onClick={() => setMission(mission)}
      className="p-4 mt-3 outset-4 cursor-pointer bg-mc-200"
    >
      <div className="font-bold">{mission.title}</div>
    </div>
  );
};
