import { useReactFlow } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { Button } from "../basic/Button";

export const MenuBar = () => {
  const instance = useReactFlow();
  // const id = useUserStore((s) => s.id);
  const [infoMode, toggleInfo] = useNodeStore((r) => [
    r.infoModeEnabled,
    r.toggleInfoMode,
  ]);

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
    <div className="flex gap-2">
      <Button onClick={save}>Save</Button>
      <Button onClick={restoreFlow}>Load</Button>
      <Button className={infoMode ? "bg-mc-200" : null} onClick={toggleInfo}>
        Info Mode
      </Button>
    </div>
  );
};
