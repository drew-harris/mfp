import { useEffect, useMemo, useState } from "react";
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

interface item {
  name: string,
  isHidden: boolean,
  nodeType: MCNodeType,
}

export default function Graph() {
  // todo: currentTask and orderNode may be deprecated, use to highlight order resources?
  const currentTask = useObjectiveStore((s) => s.currentTask);
  const orderNodeId = useNodeStore(
    (s) => s.nodes.find((n) => n.data.dataType === MCNodeType.order)?.id
  );

  const validNodeTypes = new Set([MCNodeType.crafter, MCNodeType.resource]);

  const nodes = useNodeStore((s) => s.nodes)
    .filter((n) => validNodeTypes
      .has(n.data.dataType));
  const edges = useNodeStore((s) => s.edges);

  const data = useMemo(() => {
    return nodes.map((n) => {
      const matchedEdge = edges
        .filter((e) => e.source === n.id)
        .find((e) => e.data.item.title === n.data.item.title);
      const graph = {
        label: n.data.item.title,
        data: hours.map(
          (hour) =>
            ({
              hour: hour,
              rate: matchedEdge?.data.outputRate * hour || 0,
              itemId: n.data.item.itemId
            } as Datum)
        )
      }
      const item: item = {
        name: n.data.item.title,
        isHidden: false,
        nodeType: n.data.dataType
      };
      return {
        graphPoint: graph,
        item: item,
      };
    });
  }, [nodes, edges]);

  // if (!currentTask) return null;
  // if (!orderNodeId) return null;

  return (
    <>
      <GraphDetails task={currentTask} orderNodeId={orderNodeId} nodeData={data} />
    </>
  );
}

interface GraphDetailsProps {
  task: Task;
  orderNodeId: string;
  nodeData: { graphPoint: { label: string; data: Datum[]; }; item: item; }[];
}

type Datum = {
  hour: number;
  rate: number;
  itemId?: string;
};

const hours = [0, 1, 2, 3, 4, 5];

function GraphDetails({ orderNodeId, task, nodeData }: GraphDetailsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [XYGraphMode, setXYGraphMode] = useState(false);
  const [visibleData, setVisibleData] = useState(nodeData);

  const data = useMemo(() => {
    return visibleData.filter((n) => !n.item.isHidden).map(n => n.graphPoint);
  }, [visibleData]);

  const primaryAxis = useMemo(
    (): AxisOptions<Datum> => ({
      getValue: (datum) => datum.hour,
      show: true,
      scaleType: "linear"
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<Datum>[] => [
      {
        getValue: (datum) => datum.rate,
        scaleType: "linear"
      }
    ],
    []
  );

  const handleOptionChange = (option: string) => {
    setVisibleData((prevData) =>
      prevData.map((node) => {
        console.log(node.item.name, "===", option, ":", node.item.isHidden, "->", !node.item.isHidden)
        if (node.item.name === option) {
          return {...node, item: { ...node.item, isHidden: !node.item.isHidden }};
        }
        return node;
      }));
  };

  const toggleXYGraphMode = () => setXYGraphMode(!XYGraphMode)

  useEffect(() => {
    setVisibleData(nodeData)
  }, [nodeData]);

  useEffect(() => {
    console.log("dialogOpen value:", dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  // TODO: Replace with shadcn dialog
  return (
    <>
      <div className="">
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
        <div className="isolate">
          <div
            onClick={() => {
              setDialogOpen(false);
              sendLog(LogType.MfpCloseGraph);
            }}
            className="fixed left-0 bottom-0 top-0 right-0 z-10 bg-black/70"
          />
          <div className="outset fixed left-96 bottom-24 top-24 right-24 z-30 bg-mc-200">
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
                          textAlign: "center"
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
                  }
                },
                interactionMode: "closest",
                data,
                primaryAxis,
                secondaryAxes,
                getSeriesStyle: () => ({
                  line: {
                    strokeWidth: "4px"
                  }
                })
              }}
            />

          </div>
          <div className="outset fixed left-24 bottom-24 top-24 right-24 z-20 bg-mc-300">
            <div className="flex flex-row gap-2">
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button className={XYGraphMode ? "bg-mc-200" : null} onClick={toggleXYGraphMode}>
                {XYGraphMode ? "Hide Equations" : "Show Equations"}
              </Button>
            </div>
            <div className="px-4 py-2">
              <div className="font-bold">Items:</div>
              {nodeData?.length > 0 && visibleData.map((node) => (
                <div key={node.item.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={node.item.name}
                    onChange={() => {
                      handleOptionChange(node.item.name);
                    }}
                    className="mr-2"
                    checked={!node.item.isHidden}
                  />
                  <label htmlFor={node.item.name} className="text-sm">
                    {node.item.name} {XYGraphMode ? (
                    <>| y = {node.graphPoint.data[1].rate}x</>
                  ) : ""}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
