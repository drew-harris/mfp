import { useTutorialStore } from "../../stores/tutorialStore";
import { TutorialPanel } from "../tutorial/TutorialPanel";
import { SideTaskBar } from "./SideTaskBar";

export const Sidebar = () => {
  const tutorialEnabled = useTutorialStore((s) => s.enabled);

  return (
    <div className="p-3">
      {tutorialEnabled ? <TutorialPanel /> : <SideTaskBar />}
    </div>
  );
};
