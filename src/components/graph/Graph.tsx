import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import { sendLog } from "../../api/logs";
import { itemFromId } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCItem, MCNodeType } from "../../types/MCNodes";
import { Task } from "../../types/tasks";
import { Button } from "../basic/Button";
import { SpriteDisplay } from "../SpriteDisplay";
import { LogType } from "../../__generated__/graphql";
import SplitPane from "react-split-pane";

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

  const itemList = useMemo(() => {
    return nodes.map((n) => {
      const item: item = {
        name: n.data.item.title,
        isHidden: false,
        nodeType: n.data.dataType
      };
      //console.log("item: " + item.name)
      return item;
    });
  }, [nodes]);

  const data = useMemo(() => {
    return nodes.map((n) => {
      const matchedEdge = edges
        .filter((e) => e.source === n.id)
        .find((e) => e.data.item.title === n.data.item.title);
      return {
        label: n.data.item.title,
        data: hours.map(
          (hour) =>
            ({
              hour: hour,
              rate: matchedEdge?.data.outputRate * hour || 0,
              itemId: n.data.item.itemId
            } as Datum)
        )
      };
    });
  }, [nodes, edges]);

  // if (!currentTask) return null;
  // if (!orderNodeId) return null;

  return (
    <>
      <GraphDetails task={currentTask} orderNodeId={orderNodeId} nodeData={data} itemList={itemList} />
    </>
  );
}

interface GraphDetailsProps {
  task: Task;
  orderNodeId: string;
  nodeData: { label: string, data: Datum[], itemId?: string }[];
  itemList: item[];
}

type Datum = {
  hour: number;
  rate: number;
  itemId?: string;
};

const hours = [0, 1, 2, 3, 4, 5];

function GraphDetails({ orderNodeId, task, nodeData, itemList }: GraphDetailsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemList, setNewItemList] = useState(itemList);
  const [data, setData] =
    useState(nodeData.filter(
      (datum) => newItemList
        ?.find((item) => item.name === datum.label)
        ?.isHidden === false));

  const incomingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e.target === orderNodeId)
  );

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
    setNewItemList((prevItemList) =>
      prevItemList.map((item) => {
        if (item.name === option) {
          return { ...item, isHidden: !item.isHidden };
        }
        return item;
      }));
    console.log(newItemList)
  };

  useEffect(() => {
    console.log("dialogOpen value:", dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  useEffect(() => {
    setNewItemList(itemList)
  }, [itemList]);

  useEffect(() => {
    setData(nodeData.filter(
      (datum) => newItemList?.find(
        (item) => item.name === datum.label).isHidden === false))
  }, [nodeData, newItemList]);

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
        <>
          <div
            onClick={() => setDialogOpen(false)}
            className="fixed left-0 bottom-0 top-0 right-0 z-10 bg-black/70"
          />
          <div className="fixed left-96 bottom-24 top-24 right-24 z-30 bg-mc-200">
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
          <div className="fixed left-24 bottom-24 top-24 right-24 z-20 bg-mc-300">
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <div>{itemList.length > 0 ? "item list exists" : "item list does not exist"}</div>
            <div>{newItemList.length > 0 ? "new item list exists" : "new item list does not exist"}</div>
            {newItemList.map((item) => (
              <div key={item.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.name}
                  onChange={() => {
                    handleOptionChange(item.name);
                  }}
                  className="mr-2"
                  checked={!item.isHidden}
                />
                <label htmlFor={item.name} className="text-sm">
                  {item.name}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
