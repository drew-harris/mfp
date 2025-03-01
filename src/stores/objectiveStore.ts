import create from "zustand";
import { Mission, Task } from "../types/tasks";
import { useNodeStore } from "./nodes";
import { sendLog } from "../api/logs";
import { LogType } from "../__generated__/graphql";

export type ObjectiveState = {
  currentMission: Mission | null;
  currentTask: Task | null;

  beginMission: (mission: Mission) => void;
  nextTask: () => void;
  previousTask: () => void;
  cancelMission: () => void;
  hasNextTask: () => boolean;
  hasPreviousTask: () => boolean;
};

export const useObjectiveStore = create<ObjectiveState>((set, get) => ({
  currentMission: null,
  currentTask: null,

  beginMission: (mission: Mission) => {
    useNodeStore.getState().clearAllNodes();
    sendLog(LogType.MfpLessonBegin, { lesson: mission.id });
    if (mission.tasks.length === 0) {
      throw new Error("Mission must have at least one task");
    }
    set({
      currentMission: mission,
      currentTask: mission.tasks[0],
    });
  },

  nextTask: () => {
    console.log("next task");
    const { currentMission, currentTask } = get();

    if (!currentMission || !currentTask) {
      return;
    }

    const currentIndex = currentMission?.tasks.indexOf(currentTask);
    console.log("Current index", currentIndex);

    if (currentIndex + 1 >= currentMission.tasks.length) {
      return;
    }
    set({
      currentTask: currentMission.tasks[currentIndex + 1],
    });

    const reqString = currentMission.tasks[currentIndex + 1].itemRequirements.map(
      req => `${req.itemId}: ${req.rate}`
    ).join(', ');

    sendLog(LogType.MfpNextTask, {
      task: currentMission.tasks[currentIndex + 1].id,
      requirements: reqString,
    });
  },

  previousTask() {
    console.log("previous task");
    const { currentMission, currentTask } = get();

    if (!currentMission || !currentTask) {
      return;
    }

    const currentIndex = currentMission?.tasks.indexOf(currentTask);
    console.log("Current index", currentIndex);

    if (currentIndex - 1 < 0) {
      return;
    }
    set({
      currentTask: currentMission.tasks[currentIndex - 1],
    });
    sendLog(LogType.MfpTaskBack, {
      task: currentMission.tasks[currentIndex - 1].id,
    });
  },

  hasNextTask: () => {
    const { currentMission, currentTask } = get();
    if (!currentMission || !currentTask) {
      return false;
    }
    const currentIndex = currentMission?.tasks.indexOf(currentTask);
    if (currentIndex + 1 >= currentMission.tasks.length) {
      return false;
    }
    console.log("has next task");
    return true;
  },

  hasPreviousTask() {
    const { currentMission, currentTask } = get();
    if (!currentMission || !currentTask) {
      return false;
    }
    const currentIndex = currentMission?.tasks.indexOf(currentTask);
    if (currentIndex - 1 < 0) {
      return false;
    }
    console.log("has previous task");
    return true;
  },

  cancelMission: () => {
    set({
      currentMission: null,
      currentTask: null,
    });
  },
}));
