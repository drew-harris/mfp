import { gql } from "graphql-request";
import { useUserStore } from "../stores/userStore";
import { loggedInClient } from "./gqlqueries";

export type LogType =
  | "LessonBegin"
  | "NextTask"
  | "TaskComplete"
  | "LessonComplete"
  | "AssignmentSubmitted"
  | "OpenGraph"
  | "ConnectNodes"
  | "ToggleInfoMode"
  | "ClearCanvas";

const sendLogMutation = gql`
  mutation MyLogMutation(
    $userId: String!
    $eventType: String!
    $data: AWSJSON!
  ) {
    createEvent(
      userID: $userId
      applicationID: "mfp"
      eventTypeID: $eventType
      data: $data
    ) {
      applicationID
      eventTypeID
      data
      userID
    }
  }
`;

export const rawSendLog = async (type: LogType, data: object) => {
  const stringifiedData = JSON.stringify(data);

  const variables = {
    userId: useUserStore.getState().id,
    eventType: type,
    data: stringifiedData,
  };

  const result = (await loggedInClient.request(sendLogMutation, variables)) as {
    createEvent?: unknown;
  };
  if (!result.createEvent) {
    throw new Error("Could not send log");
  }
  return result.createEvent;
};

export const safeSendLog = (type: LogType, data: object) => {
  rawSendLog(type, data)
    .then((data) => {
      console.log("Sent log", data);
    })
    .catch((error) => {
      console.error("Could not send log", error);
    });
};
