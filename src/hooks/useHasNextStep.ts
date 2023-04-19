import { useObjectiveStore } from "../stores/objectiveStore";

export const useHasNextStep = (): boolean => {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const currentMission = useObjectiveStore((s) => s.currentMission);
  if (!currentMission || !currentTask) {
    return false;
  }
  const currentIndex = currentMission?.tasks.indexOf(currentTask);
  if (currentIndex + 1 >= currentMission.tasks.length) {
    return false;
  }
  return true;
};
