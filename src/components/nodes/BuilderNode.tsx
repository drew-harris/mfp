import { useMutation } from "@apollo/client";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { CREATE_CUSTOM_NODE } from "../../api/saves";
import { useNodeStore } from "../../stores/nodes";
import { useNotifications } from "../../stores/notifications";
import { MCBuilderNode, MCEdge } from "../../types/MCNodes";
import { FindCoefficientsSuccess, findCoefficients } from "../../utils/builder";
import { getNodeById } from "../../utils/nodes";
import { edgeArrayUpdate } from "../../utils/updates";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import { Button } from "../basic/Button";
import { UserContext } from "../contexts/UserContext";

interface BuilderNodeProps {
  data: MCBuilderNode;
}

export default function BuilderNode({ data }: BuilderNodeProps) {
  const [result, setResult] = useState<FindCoefficientsSuccess | null>(null);
  const incomingEdge = useNodeStore((s) =>
    s.edges.find((e) => e.target === data.id)
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

  return (
    <BaseNode leftSideNodes={<SideHandle type="target" />} data={data}>
      {incomingEdge?.data ? (
        <div className="flex flex-col items-center gap-2">
          {incomingEdge?.data?.item?.imageUrl && (
            <SpriteDisplay url={incomingEdge.data.item.imageUrl} />
          )}
          {incomingEdge?.data?.item?.title && (
            <div>{incomingEdge.data?.item?.title}</div>
          )}
          <SubmitCustomNode result={result} />
        </div>
      ) : (
        <div>No Connected Nodes</div>
      )}
    </BaseNode>
  );
}

const SubmitCustomNode = ({ result }: { result: FindCoefficientsSuccess }) => {
  const { sendNotification } = useNotifications();
  const [name, setName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useContext(UserContext);
  const [saveMutation, { loading }] = useMutation(CREATE_CUSTOM_NODE, {
    onCompleted() {
      sendNotification("Created new node!", "success");
      // TODO: Replace builder node with new node!
    },
  });

  const handleInput = (e: FormEvent) => {
    e.preventDefault();

    saveMutation({
      variables: {
        newCustomNode: {
          graphData: { graph: result.graph },
          recipeData: { recipes: result.recipe },
          name,
          playerId: user.user.id,
        },
      },
    });
  };

  if (!result) {
    return <div>Invalid</div>;
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
