import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Edge } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCEdge, MCNodeType } from "../../types/MCNodes";
import { Task } from "../../types/tasks";
import { Button } from "../basic/Button";
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

  for (let i = 0; i < datas.length; i++) {
    if (datas[i]?.item.itemId !== newDatas[i]?.item.itemId) {
      return false;
    }
    if (datas[i]?.outputRate !== newDatas[i]?.outputRate) {
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
    // console.log("Incoming edges to order: ", incomingEdgesToOrder);
    setItemRequirementsMapped(
      itemRequirementsMapped.map((req) => {
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
      {itemRequirementsMapped.every((r) => r.completed) && (
        <Button>Submit</Button>
      )}
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
      className="flex gap-3 m-3 items-center p-2 bg-mc-200 outset"
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
