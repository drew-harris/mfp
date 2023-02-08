import { useReactFlow } from "reactflow";
import { useTutorialStore } from "../stores/tutorialStore";

export const MenuBar = () => {
  const instance = useReactFlow();
  const toggle = useTutorialStore((s) => s.toggleTutorial);
  const tutorialEnabled = useTutorialStore((s) => s.enabled);

  const save = () => {
    const copy = instance.toObject();
    localStorage.setItem("rfsave", JSON.stringify(copy));
    return;
  };

  const restoreFlow = async () => {
    const item = localStorage.getItem("rfsave");
    if (item) {
      const flow = JSON.parse(item);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        instance.setNodes(flow.nodes || []);
        instance.setEdges(flow.edges || []);
        instance.setViewport({ x, y, zoom });
      }
    }
  };

  return (
    <>
      <button className="button" onClick={save}>
        Save
      </button>
      <button className="button" onClick={restoreFlow}>
        Load
      </button>
      <button className="button" onClick={toggle}>
        {tutorialEnabled ? "Disable Tutorial" : "Enable Tutorial"}
      </button>
    </>
  );
};
