import { ApolloQueryResult, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { gql } from "../../__generated__";
import { AllSavesQuery, Exact } from "../../__generated__/graphql";
import { useNodeStore } from "../../stores/nodes";
import { timeAgo } from "../../utils/timeago";
import { UserContext } from "../contexts/UserContext";
import SaveDialog from "./SaveDialog";
import { LogType } from "../../__generated__/graphql";
import { sendLog } from "../../api/logs";

const SAVES = gql(`
query AllSaves($playerId: String) {
  saves(playerId: $playerId) {
    name
    id
    updatedAt
    graphData
  }
}`);

export type SaveListRefetchFn = (
  variables?: Partial<
    Exact<{
      [key: string]: never;
    }>
  >
) => Promise<ApolloQueryResult<AllSavesQuery>>;

export default function SaveList() {
  const { user } = useContext(UserContext);
  const { data, refetch } = useQuery(SAVES, {
    variables: {
      playerId: user.id
    }
  });

  const [numDefaultSaves, setNumDefaultSaves] = useState(0);

  useEffect(() => {
    const defaultSaves = data?.saves
      ?.filter((save) => save.name.slice(0, 5) === "Save ")
      .map((save) => Number.parseInt(save.name.slice(5)) || 0) || [];
    const largestSaveNum = defaultSaves.length > 0 ? Math.max(...defaultSaves) : 0;
    setNumDefaultSaves(largestSaveNum);
  }, [data]);

  const internal = useNodeStore((s) => s.internal);

  const quickLoadSave = (save: typeof data["saves"][0]) => {
    console.log("TODO: Load save", save);
    sendLog(LogType.MfpLoadSave)
    internal.setNodesAndEdges(save.graphData.nodes, save.graphData.edges);
  };

  return (
    <div className="flex flex-col gap-2">
      <SaveDialog refetch={refetch} numDefaultSaves={numDefaultSaves} />
      <div className="flex flex-col gap-2 h-[calc(100vh-220px)] overflow-y-auto">
        {data?.saves?.slice().sort(
          (a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
          .map((save) => {
            return (
              <div
                className="outset-4 flex cursor-pointer items-baseline justify-between bg-mc-200 p-2"
                key={save.id}
                onClick={() => quickLoadSave(save)}
              >
                <div className="flex items-center gap-2 leading-none">
                  <FontAwesomeIcon icon={faSave} className="opacity-50" />
                  <div className="font-semibold mb-1 mx-1">{save.name}</div>
                </div>
                <div className="text-xs opacity-30">
                  {timeAgo.format(new Date(save.updatedAt), "mini")}
                </div>
              </div>
            );
          })}
        {data?.saves.length === 0 && (
          <div className="mt-4 text-center text-black/50">No Saves Yet!</div>
        )}
      </div>
    </div>
  );
}
