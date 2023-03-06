import create from "zustand";
import { Mission, Task } from "../types/tasks";

export type ObjectiveState = {
  currentMission: Mission | null;
  currentTask: Task | null;

  beginMission: (mission: Mission) => void;
  nextTask: () => void;
  cancelMission: () => void;
  isTaskComplete: () => boolean;
};

export const useObjectiveStore = create<ObjectiveState>((set, get) => ({
  currentMission: null,
  currentTask: null,

  beginMission: (mission: Mission) => {
    if (mission.tasks.length === 0) {
      throw new Error("Mission must have at least one task");
    }
    set({
      currentMission: mission,
      currentTask: mission.tasks[0],
    });
  },

  nextTask: () => {
    const { currentMission, currentTask } = get();
    if (!currentMission || !currentTask) {
      return;
    }
    const currentIndex = currentMission?.tasks.indexOf(currentTask);
    if (!currentIndex) {
      return;
    }
    if (currentIndex + 1 >= currentMission.tasks.length) {
      return;
    }
    set({
      currentTask: currentMission.tasks[currentIndex + 1],
    });
  },

  isTaskComplete: () => {
    return false;
  },

  cancelMission: () => {
    set({
      currentMission: null,
      currentTask: null,
    });
  },
}));
