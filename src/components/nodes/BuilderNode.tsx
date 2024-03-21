import { useApolloClient, useMutation } from "@apollo/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { CREATE_CUSTOM_NODE } from "../../api/saves";
import { useNodeStore } from "../../stores/nodes";
import { useNotifications } from "../../stores/notifications";
import {
  MCBuilderNode,
  MCCustomNode,
  MCEdge,
  MCNodeType,
} from "../../types/MCNodes";
import { FindCoefficientsSuccess, findCoefficients } from "../../utils/builder";
import { getNodeById } from "../../utils/nodes";
import { edgeArrayUpdate } from "../../utils/updates";
import { SpriteDisplay } from "../SpriteDisplay";
import { Button } from "../basic/Button";
import { UserContext } from "../contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import { logNode, sendLog } from "../../api/logs";
import { LogType } from "../../__generated__/graphql";

interface BuilderNodeProps {
  data: MCBuilderNode;
}

export default function BuilderNode({ data }: BuilderNodeProps) {
  const [result, setResult] = useState<FindCoefficientsSuccess | null>(null);
  const incomingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e.target === data.id)
  );

  const setEdgeColors = useNodeStore((s) => s.setEdgeColors);
  // Coloring connected edges
  const allConnectedEdges = useNodeStore((s) => {
    // BFS of edges conntected
    const connected = [];
    const toSearch: Edge<MCEdge>[] = [];
    toSearch.push(...s.edges.filter((e) => e.target === data.id));
    while (toSearch.length > 0) {
      const edge = toSearch.pop();
      if (edge) {
        connected.push(edge);
        toSearch.push(...s.edges.filter((e) => e.target === edge.source));
      }
    }

    return connected;
  }, edgeArrayUpdate);

  useEffect(() => {
    console.log("UPDATE!!!");
    setEdgeColors(
      allConnectedEdges.map((e) => e.id),
      "#C084FC"
    );
  }, [allConnectedEdges, setEdgeColors]);

  useEffect(() => {
    // TODO: Figure out cool type system
    const nodeRef = getNodeById(data.id) as unknown as Node<MCBuilderNode>;
    const result = findCoefficients(nodeRef);
    if (result.status === "success") {
      setResult(result);
    } else {
      setResult(null);
    }
  }, [allConnectedEdges, setEdgeColors, data.id]);

  // Number of connections + 1
  const leftHandles = Array.from(
    { length: incomingEdges.length + 1 },
    (_, i) => <SideHandle id={`handle-${data.id}-${i}`} key={i} type="target" />
  );

  return (
    <BaseNode leftSideNodes={leftHandles} data={data}>
      {incomingEdges.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          {incomingEdges.map((incomingEdge) => (
            <>
              {incomingEdge?.data?.item?.imageUrl && (
                <SpriteDisplay
                  key={incomingEdge.id}
                  url={incomingEdge.data.item.imageUrl}
                />
              )}
              {incomingEdge?.data?.item?.title && (
                <div key={incomingEdge.id + "title"}>
                  {incomingEdge.data?.item?.title}
                </div>
              )}
            </>
          ))}
          <SubmitCustomNode builderNode={data} result={result} />
        </div>
      ) : (
        <div>No Connected Nodes</div>
      )}
    </BaseNode>
  );
}

const SubmitCustomNode = ({
  result,
  builderNode,
}: {
  result: FindCoefficientsSuccess;
  builderNode: MCBuilderNode;
}) => {
  const client = useApolloClient();
  const { sendNotification } = useNotifications();
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useContext(UserContext);

  const addNode = useNodeStore((s) => s.addNode);
  const [saveMutation, { loading }] = useMutation(CREATE_CUSTOM_NODE, {
    onCompleted(data) {
      sendNotification("Created new node!", "success");
      const oldBuilder = result.graph.nodes.find(
        (n) => n.id === builderNode.id
      );
      const nodeIds = result.graph.nodes.map((n) => n.id);
      const edgeIds = result.graph.edges.map((e) => e.id);
      remove(nodeIds, edgeIds);

      // Create the new custom node
      const node: Node<MCCustomNode> = {
        id: builderNode.id,
        position: {
          x: oldBuilder.position.x,
          y: oldBuilder.position.y,
        },
        data: {
          dataType: MCNodeType.custom,
          lapisId: data.createCustomNode.id,
          name: data.createCustomNode.name,
          recipes: data.createCustomNode.recipeData.recipes, // TODO: Verify
          id: builderNode.id,
        },
        type: MCNodeType.custom,
      };

      addNode(node);

      logNode(LogType.MfpCreateCustomNode, node);

      // Invalidate query for picker
      client.refetchQueries({ include: "active" });
    },
  });

  const remove = useNodeStore((s) => s.removeEdgesAndNodes);

  const handleInput = (e: FormEvent) => {
    e.preventDefault();
    setDialogOpen(false);
    console.log("SAVING");
    console.log("Mutation");
    saveMutation({
      variables: {
        newCustomNode: {
          graphData: result.graph,
          recipeData: { recipes: result.recipes },
          name,
          playerId: user.user.id,
        },
      },
    });
  };

  if (!result) {
    return <div className="text-xs text-red-800">Invalid</div>;
  }

  return (
    <>
      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogTrigger asChild>
          {loading ? (
            <div>Loading</div>
          ) : (
            <Button onClick={() => setDialogOpen(true)}>Save</Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="text-center">Save New Node</DialogHeader>
          <form onSubmit={handleInput} className="flex justify-center">
            <input
              placeholder="Custom node name..."
              className="inset bg-mc-300 p-1 text-white outline-none placeholder:text-mc-200 focus-visible:border-white/80"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength = {1}
              maxLength={21}
            ></input>
            <Button disabled={name.length <= 0} className="p-1">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
