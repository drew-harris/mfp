import { useReactFlow } from "reactflow";
import { pullMFPData, pushMFPData } from "../utils/gqlqueries";
import { Button } from "./basic/Button";
import { useUserStore } from "../stores/userStore";

export const MenuBar = () => {
  const instance = useReactFlow();
  const id = useUserStore((s) => s.id);
  // const id = useUserStore((s) => s.id);

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

      <div>{/* <div className="text-white">Logged in as: {id}</div> */}</div>
    </div>
  );
};
