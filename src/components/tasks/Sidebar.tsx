/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { allMissions } from "../../hardcoded/missions";
import { useHasNextStep } from "../../hooks/useHasNextStep";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { Mission, Task } from "../../types/tasks";
import { Button } from "../basic/Button";
import { TaskCompleteContext } from "../contexts/TaskCompleteProvider";
import { DroppableOrder } from "./DroppableOrder";

export const TaskSidebar = () => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const removeOrder = useNodeStore((state) => state.removeOrderNode);
  const cancelMission = useObjectiveStore((s) => s.cancelMission);
  const beginMission = useObjectiveStore((s) => s.beginMission);
  const nextTask = useObjectiveStore((s) => s.nextTask);
  const previousTask = useObjectiveStore((s) => s.previousTask);
  const hasPreviousTask = useObjectiveStore((s) => s.hasPreviousTask);
  const hasNextTask = useHasNextStep();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const missionId = searchParams.get("assignment");
    if (missionId) {
      beginMission(allMissions.find((m) => m.id === missionId));
    }
  }, [searchParams.get("assignment")]);

  const data = useContext(TaskCompleteContext);

  const clearTask = () => {
    cancelMission();
    removeOrder();
  };

  const NextButton = () => {
    if (!data.taskComplete) return null;
    if (hasNextTask) {
      return (
        <div className="flex gap-2">
          {hasPreviousTask() && (
            <Button onClick={() => previousTask()}>Back</Button>
          )}
          <Button onClick={() => nextTask()}>Next</Button>
        </div>
      );
    } else {
      return (
        <Button
          className="mx-auto"
          onClick={() => {
            alert(currentMission.completeMessage ?? "Assignment Submitted!");
            cancelMission();
          }}
        >
          Submit
        </Button>
      );
    }
  };

  if (currentTask) {
    return (
      <div className="flex flex-col items-center p-3">
        <div className="mb-4 w-full text-left text-xl text-black/50">
          {currentMission?.title}
        </div>
        <SideTaskView clearTask={clearTask} task={currentTask} />
        {data.taskComplete && data.efficiency > 0 && (
          <div className="mb-4">
            <div className="text-center text-lg">
              Efficiency: {(Number(data.efficiency) * 100).toFixed(2)}%
            </div>
            {data.efficiency > 1 && (
              <div className="text-sm text-black/75">
                You are producing too much!
              </div>
            )}
            {data.efficiency < 1 && (
              <div className="text-sm text-black/75">
                You are not producing enough!
              </div>
            )}
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

const SideTaskView = ({ task }: SideTaskViewProperties) => {
  return (
    <div className="p-2">
      <div className="text-center text-xl font-bold">{task.title}</div>
      <div className="text-center text-mc-700">{task.description}</div>
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

// const IdDebugView = () => {
//   const id = useUserStore((s) => s.id);
//   const [searchParams] = useSearchParams();
//   return (
//     <div className="absolute bottom-2 right-2 text-black/20">
//       <div>{id}</div>
//       <div>{searchParams.get("assignment")}</div>
//     </div>
//   );
// };
