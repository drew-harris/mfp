import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Edge } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCEdge, MCNodeType } from "../../types/MCNodes";
import { Task } from "../../types/tasks";
import { RequirementView } from "./RequirementView";

interface SidebarTaskChecksProps {
  task: Task;
}

const actualEdgeUpdate = (
  oldEdges: Edge<MCEdge>[],
  newEdges: Edge<MCEdge>[]
): boolean => {
  const datas = oldEdges.map((e) => e.data);
  const newDatas = newEdges.map((e) => e.data);

  if (datas.length !== newDatas.length) {
    return false;
  }

  for (const [i, data] of datas.entries()) {
    if (data?.item.itemId !== newDatas[i]?.item.itemId) {
      return false;
    }
    if (data?.outputRate !== newDatas[i]?.outputRate) {
      return false;
    }
  }

  return true;
};

export const SidebarTaskChecks = ({ task }: SidebarTaskChecksProps) => {
  const incomingEdgesToOrder = useNodeStore((s) => {
    return s.edges.filter(
      (e) =>
        s.nodes.find((n) => n.id === e.target)?.data.dataType ===
        MCNodeType.order
    );
  }, actualEdgeUpdate);

  useEffect(() => {
    setItemRequirementsMapped((i) =>
      i.map((req) => {
        return {
          ...req,
          completed: incomingEdgesToOrder.some(
            (e) =>
              e?.data?.item.itemId === req.itemId &&
              e?.data?.outputRate >= req.perHour
          ),
        };
      })
    );
  }, [incomingEdgesToOrder]);

  const [itemRequirementsMapped, setItemRequirementsMapped] = useState(
    task.itemRequirements?.map((req) => {
      return { ...req, completed: false };
    }) || []
  );

  return (
    <div className="flex flex-col items-center">
      {itemRequirementsMapped.map((req) => (
        <ItemCheck key={req.itemId} req={req} />
      ))}
    </div>
  );
};

export const ItemCheck = ({
  req,
}: {
  req: { completed: boolean; itemId: string; perHour: number };
}) => {
  return (
    <div
      className="outset m-3 flex items-center gap-3 bg-mc-200 p-2"
      key={req.itemId}
    >
      <RequirementView requirement={req} />
      <div className="mx-3">
        {req.completed ? (
          <FontAwesomeIcon icon={faCheck} color="green" />
        ) : (
          <FontAwesomeIcon icon={faX} color="red" />
        )}
      </div>
    </div>
  );
};
