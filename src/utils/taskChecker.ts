import { Task } from "../types/tasks";

const buildChecksFromTask = (task: Task): (() => boolean[]) => {
  const checks: ((state: RFState) => boolean)[] = [];

  if (task.itemRequirements) {
    task.itemRequirements.forEach((req) => {
      checks.push((state) => { });
    });
  }
};
