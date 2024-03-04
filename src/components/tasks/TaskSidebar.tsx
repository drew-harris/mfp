/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { allMissions } from "../../hardcoded/missions";
import { useHasNextStep } from "../../hooks/useHasNextStep";
import { useNodeStore } from "../../stores/nodes";
import { useNotifications } from "../../stores/notifications";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { Mission, Task } from "../../types/tasks";
import { Button } from "../basic/Button";
import { TaskCompleteContext } from "../contexts/TaskCompleteProvider";
import PickerSquare from "../nodePicker/PickerSquare";
import { RequirementView } from "./RequirementView";
import { MCNodeType } from "../../types/MCNodes";
import { LogType } from "../../__generated__/graphql";
import { sendLog } from "../../api/logs";

export const TaskSidebar = () => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const currentMission = useObjectiveStore((s) => s.currentMission);
  const removeOrder = useNodeStore((s) => s.removeOrderNode);
  const cancelMission = useObjectiveStore((s) => s.cancelMission);
  const beginMission = useObjectiveStore((s) => s.beginMission);
  const nextTask = useObjectiveStore((s) => s.nextTask);
  const [completeNotificationSent, setCompleteNotificationSent] =
    useState(false);
  const previousTask = useObjectiveStore((s) => s.previousTask);
  const hasPreviousTask = useObjectiveStore((s) => s.hasPreviousTask);
  const hasNextTask = useHasNextStep();
  const sendNotification = useNotifications((s) => s.sendNotification);
  const infoModeEnabled = useNodeStore((s) => s.infoModeEnabled);

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

  useEffect(() => {
    if (data.taskComplete && !completeNotificationSent) {
      setCompleteNotificationSent(true);
      if (hasNextTask) {
        // NOTE: Happens too often
        // sendNotification("Task Complete!");
        sendLog(LogType.MfpTaskComplete, {
          task: currentTask.id,
        });
      } else {
        sendNotification("Lesson Complete", "success");
      }
    } else {
      setCompleteNotificationSent(false);
    }
  }, [data.taskComplete]);

  const NextBackButtonSet = () => {
    const disabled = "cursor-not-allowed opacity-50 pointer-events-none";
    return (
      <div className="flex gap-5">
        {
          <Button
            onClick={() => previousTask()}
            className={!hasPreviousTask() && disabled}
          >
            Back
          </Button>
        }
        <Button
          onClick={() => {
            nextTask();
            removeOrder();
          }}
          className={!data.taskComplete && disabled}
        >
          Next
        </Button>
        {!hasNextTask && (
          <Button
            className="mx-auto"
            onClick={() => {
              alert(currentMission.completeMessage ?? "Assignment Submitted!");
              sendLog(LogType.MfpAssignmentSubmitted, {
                task: currentMission.id,
              });
              cancelMission();
            }}
          >
            Submit
          </Button>
        )}
      </div>
    );
  };

  const orderNodeOnCanvas = useNodeStore((s) =>
    Boolean(s.nodes.some((n) => n.data.dataType === MCNodeType.order))
  );

  if (currentTask) {
    return (
      <div className="flex h-full flex-col items-center">
        <div className="mb-2 w-full text-left text-xl text-black/50">
          {currentMission?.title}
        </div>
        <SideTaskView clearTask={clearTask} task={currentTask} />
        {orderNodeOnCanvas && (
          <div className="mb-4 text-center">
            <div className="text-lg">
              Efficiency:{" "}
              {data.efficiency ? (data.efficiency * 100).toFixed(2) : 0}%
            </div>
            { data.efficiency < 1 && infoModeEnabled && (
              <div className="text-sm text-black/75">
                Deficit:{" "}
                {Number.isNaN(data.deficit)
                  ? 0
                  : (data.deficit * 100).toFixed(2)}
                % | Excess:{" "}
                {Number.isNaN(data.excess)
                  ? 0
                  : (data.excess * 100).toFixed(2)}
                %
              </div>
            )}
          </div>
        )}
        <div className="mt-auto">
          <NextBackButtonSet />
        </div>
        <div>
          {
            data.messages.map((m) => (
              <div className="outset bg-red-300 p-2" key={m.message}>
                {m.message}
              </div>
            )) /*todo: This doesn't seem to do anything*/
          }
        </div>
      </div>
    );
  } else {
    return (
      <div className="">
        <div className="flex flex-col gap-2">
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

interface SideTaskViewProperties {
  task: Task;
  clearTask: () => void;
}

const SideTaskView = ({ task }: SideTaskViewProperties) => {
  const hasOrderNodeAlready = useNodeStore((n) =>
    n.nodes.some((n) => n.data.dataType === MCNodeType.order)
  );
  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="text-center text-xl font-bold">{task.title}</div>
      <div className="text-left text-mc-700 whitespace-pre-line">{task.description}</div>
      {!hasOrderNodeAlready && task.itemRequirements?.length > 0 && (
        <PickerSquare
          className="max-w-[200px]"
          topLabel="Order"
          image={task.itemRequirements?.map((requirement) => (
            <div className="flex items-center gap-3" key={requirement.itemId}>
              <RequirementView
                className="my-2 text-black"
                requirement={requirement}
              />
            </div>
          ))}
          payload={{
            task: task,
            type: MCNodeType.order,
          }}
        />
      )}
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
      className="outset-4 cursor-pointer bg-mc-200 p-4"
    >
      <div className="font-bold">{mission.title}</div>
    </div>
  );
};
