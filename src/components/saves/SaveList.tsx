import { ApolloQueryResult, useQuery } from "@apollo/client";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { gql } from "../../__generated__";
import { AllSavesQuery, Exact } from "../../__generated__/graphql";
import { useNodeStore } from "../../stores/nodes";
import { timeAgo } from "../../utils/timeago";
import { UserContext } from "../contexts/UserContext";
import SaveDialog from "./SaveDialog";

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
      playerId: user.id,
    },
  });

  const internal = useNodeStore((s) => s.internal);

  const quickLoadSave = (save: typeof data["saves"][0]) => {
    console.log("TODO: Load save", save);
    internal.setNodesAndEdges(save.graphData.nodes, save.graphData.edges);
  };

  return (
    <div className="flex flex-col gap-2">
      <SaveDialog refetch={refetch} />
      {data?.saves?.map((save) => {
        return (
          <div
            className="outset-4 flex cursor-pointer items-baseline justify-between overflow-scroll bg-mc-200 p-2"
            key={save.id}
            onClick={() => quickLoadSave(save)}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSave} className="opacity-50" />
              <div className="font-semibold">{save.name}</div>
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
  );
}
