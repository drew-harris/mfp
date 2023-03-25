import { useNodeStore } from "../stores/nodes";
import { MCNode } from "../types/MCNodes";

export function useSetNodeData<D extends MCNode>(id: string) {
  const updateData = useNodeStore((s) => s.setNodeData);

  const realUpdate = (newData: Partial<D>) => {
    updateData<D>(id, newData);
  };

  return realUpdate;
}
