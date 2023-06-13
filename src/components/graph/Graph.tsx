import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { itemFromId } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { Task } from "../../types/tasks";

export default function Graph() {
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const orderNodeId = useNodeStore(
    (s) => s.nodes.find((n) => n.data.dataType === MCNodeType.order)?.id
  );
  if (!currentTask) return null;
  if (!orderNodeId) return null;

  return <GraphDetails task={currentTask} orderNodeId={orderNodeId} />;
}

interface GraphDetailsProps {
  task: Task;
  orderNodeId: string;
}

type Datum = {
  hour: number;
  rate: number;
};

const hours = [0, 1, 2, 3, 4, 5];

function GraphDetails({ orderNodeId, task }: GraphDetailsProps) {
  const incomingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e.target === orderNodeId)
  );

  const data = useMemo(() => {
    return task.itemRequirements.map((r) => {
      const matchedEdge = incomingEdges.find(
        (e) => e.data.item.itemId === r.itemId
      );
      if (matchedEdge) {
        return {
          label: matchedEdge.data.item.title,
          data: hours.map(
            (hour) =>
              ({
                hour: hour,
                rate: matchedEdge.data.outputRate * hour,
              } as Datum)
          ),
        };
      } else {
        return {
          label: itemFromId(r.itemId).title,
          data: hours.map((h) => ({
            rate: 0,
            hour: h,
          })),
        };
      }
    });
  }, [incomingEdges, task]);

  const primaryAxis = useMemo(
    (): AxisOptions<Datum> => ({
      getValue: (datum) => datum.hour,
      show: true,
      scaleType: "linear",
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<Datum>[] => [
      {
        getValue: (datum) => datum.rate,
        scaleType: "linear",
      },
    ],
    []
  );

  return (
    <div className="outset-4 m-2 h-40">
      <Chart
        options={{
          padding: 10,
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
}
