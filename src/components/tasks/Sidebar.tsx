import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { allMissions } from "../../hardcoded/missions";
import { useHasNextStep } from "../../hooks/useHasNextStep";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { useUserStore } from "../../stores/userStore";
import { Mission, Task } from "../../types/tasks";
import { Button } from "../basic/Button";
import { TaskCompleteContext } from "../contexts/TaskCompleteProvider";
import { DroppableOrder } from "./DroppableOrder";
import { SidebarTaskChecks } from "./SidebarTaskChecks";

export const Sidebar = () => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const removeOrder = useNodeStore((state) => state.removeOrderNode);
  const cancelMission = useObjectiveStore((s) => s.cancelMission);
  const beginMission = useObjectiveStore((s) => s.beginMission);
  const nextTask = useObjectiveStore((s) => s.nextTask);

  const hasNextTask = useHasNextStep();

  const data = useContext(TaskCompleteContext);

  const clearTask = () => {
    cancelMission();
    removeOrder();
  };

  const NextButton = () => {
    if (!data.taskComplete) return null;
    if (hasNextTask) {
      return <Button onClick={() => nextTask()}>Next</Button>;
    } else {
      return (
        <Button
          className="mx-auto"
          onClick={() => alert("Assignment Submitted")}
        >
          Submit
        </Button>
      );
    }
  };

  if (currentTask) {
    return (
      <div className="flex flex-col items-center p-3">
        <SideTaskView clearTask={clearTask} task={currentTask} />
        {data.taskComplete && data.efficiency > 0 && (
          <div className="mb-4 text-center text-lg">
            Efficiency: {Number(data.efficiency.toFixed(2) || 0) * 100}%
          </div>
        )}
        <NextButton />
        <div>
          {data.messages.map((m) => (
            <div className="outset bg-red-300 p-2" key={m.message}>
              {m.message}
            </div>
          ))}
        </div>
        <IdDebugView />
      </div>
    );
  } else {
    return (
      <div className="p-3">
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
        <IdDebugView />
      </div>
    );
  }
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

const IdDebugView = () => {
  const id = useUserStore((s) => s.id);
  const [searchParams] = useSearchParams();
  return (
    <div className="absolute bottom-2 right-2 text-black/20">
      <div>{id}</div>
      <div>{searchParams.get("assignment")}</div>
    </div>
  );
};
