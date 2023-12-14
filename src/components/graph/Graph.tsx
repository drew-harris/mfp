import { useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { sendLog } from "../../api/logs";
import { itemFromId } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { Task } from "../../types/tasks";
import { Button } from "../basic/Button";
import { SpriteDisplay } from "../SpriteDisplay";
import { LogType } from "../../__generated__/graphql";

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
  itemId?: string;
};

const hours = [0, 1, 2, 3, 4, 5];

function GraphDetails({ orderNodeId, task }: GraphDetailsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

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
                itemId: r.itemId,
              } as Datum)
          ),
        };
      } else {
        return {
          label: itemFromId(r.itemId).title,
          data: hours.map((h) => ({
            rate: 0,
            hour: h,
            itemId: r.itemId,
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

  // TODO: Replace with shadcn dialog
  return (
    <>
      <div className="m-2">
        <Button
          className="w-full"
          onClick={() => {
            setDialogOpen(true);
            sendLog(LogType.MfpOpenGraph);
          }}
        >
          Open Graph
        </Button>
      </div>
      {dialogOpen && (
        <>
          <div
            onClick={() => setDialogOpen(false)}
            className="fixed left-0 bottom-0 top-0 right-0 z-[60] bg-black/70"
          />
          <div className="fixed left-24 bottom-24 top-24 right-24 z-[70] bg-mc-200">
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Chart
              options={{
                padding: 40,
                tooltip: {
                  render: ({ focusedDatum, anchor }) => {
                    if (!anchor.style.top) {
                      return null;
                    }
                    const item = itemFromId(
                      focusedDatum?.originalDatum.itemId || ""
                    );
                    const data = focusedDatum?.originalDatum;
                    if (!data) return null;
                    return (
                      <div
                        style={{
                          position: "fixed",
                          left: anchor.style.left,
                          top: anchor.style.top,
                          textAlign: "center",
                        }}
                        className="m-2 rounded-md bg-mc-300 p-2"
                      >
                        <div className="text-sm">{item.title || "No Item"}</div>
                        <SpriteDisplay size={34} url={item.imageUrl} />
                        <div className="text-xs">
                          {data?.rate || 0} produced after {data?.hour} minutes
                        </div>
                      </div>
                    );
                  },
                },
                interactionMode: "closest",
                data,
                primaryAxis,
                secondaryAxes,
                getSeriesStyle: () => ({
                  line: {
                    strokeWidth: "4px",
                  },
                }),
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
