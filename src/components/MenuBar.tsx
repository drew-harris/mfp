import { useReactFlow } from "reactflow";

export const MenuBar = () => {
  const instance = useReactFlow();

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
    </>
  );
};
