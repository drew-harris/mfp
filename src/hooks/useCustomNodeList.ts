import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { GetCustomNodesQuery } from "../__generated__/graphql";
import { GET_CUSTOM_NODES } from "../api/customnodes";
import { UserContext } from "../components/contexts/UserContext";

export const useCustomNodeList = () => {
  const [nodes, _setCustomNodes] = useState<GetCustomNodesQuery["customNodes"]>(
    []
  );
  const { user } = useContext(UserContext);

  const data = useQuery(GET_CUSTOM_NODES, {
    variables: {
      playerId: user?.id,
    },
    onCompleted(data) {
      console.log("got custom nodes");
      _setCustomNodes(data.customNodes);
    },
    skip: !user?.id,
    onError() {
      console.error("Error fetching custom nodes");
    },
  });

  useEffect(() => {
    console.log("updating custom nodes");
    _setCustomNodes(data?.data?.customNodes || []);
  }, [data.data]);

  useEffect(() => {
    data.startPolling(1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return nodes;
};
