import { useReactFlow } from "reactflow";
import { pullMFPData, pushMFPData } from "../../utils/gqlqueries";
import { Button } from "../basic/Button";
import { useUserStore } from "../..//stores/userStore";
import { useNodeStore } from "../../stores/nodes";

export const MenuBar = () => {
  const instance = useReactFlow();
  const id = useUserStore((s) => s.id);
  const [infoMode, toggleInfo] = useNodeStore((r) => [
    r.infoModeEnabled,
    r.toggleInfoMode,
  ]);

  // This is a test comment
  const save = async () => {
    const copy = instance.toObject();
    await pushMFPData(id, copy);
    return;
  };

  const restoreFlow = async () => {
    if (!id) return;
    const data = await pullMFPData(id);
    if (data) {
      console.log("data", data);
      const { x = 0, y = 0, zoom = 1 } = data.viewport;
      instance.setNodes(data.nodes || []);
      instance.setEdges(data.edges || []);
      instance.setViewport({ x, y, zoom });
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={save}>Save</Button>
      <Button onClick={restoreFlow}>Load</Button>
      <Button className={infoMode ? "bg-mc-200" : null} onClick={toggleInfo}>
        Info Mode: {infoMode ? "ON" : "OFF"}
      </Button>
    </div>
  );
};
