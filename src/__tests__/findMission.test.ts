import { describe, expect, it } from "vitest";
import { findMissionFromTask } from "../components/tasks/TaskSidebar";
import { allMissions } from "../hardcoded/missions";
import { Mission, Task } from "../types/tasks";

describe("Finds the correct mission based on a task", () => {
  it("returns null with random task", () => {
    const randomTask: Task = {
      id: "random-task",
    };
    const mission = findMissionFromTask(randomTask, allMissions);
    expect(mission).toBe(null);
  });

  it("returns the correct mission for a task", () => {
    const mission = allMissions[0];
    const task = mission.tasks[0];

    expect(findMissionFromTask(task, allMissions)).toBe(mission);
  });

  it("does not return tasks if multiple missions match", () => {
    const missions: Mission[] = [
      { title: "Mission 1", id: "m1", tasks: [{ id: "tut-1" }] },
      { title: "Mission 2", id: "m2", tasks: [{ id: "tut-1" }] },
    ];
    const matchedMission = findMissionFromTask(missions[0].tasks[0], missions);

    expect(matchedMission).toBe(null);
  });
});
