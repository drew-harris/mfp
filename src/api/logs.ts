import { gql } from "../__generated__";
import { LogType } from "../__generated__/graphql";
import { User } from "../components/contexts/UserContext";
import { client } from "./client";

export const SUBMIT_LOG = gql(`
mutation SubmitLog($input: LogInput!) {
  log(input: $input) {
    id
  }
}`);

export const sendLog = (
  type: LogType,
  attributes?: Record<string, string | number>,
  message?: string
) => {
  const userBlob = window.localStorage.getItem("userblob");
  if (!userBlob) return;
  const user = JSON.parse(userBlob) as User;

  console.log("LOGGING: with id:", user.id);

  client.mutate({
    mutation: SUBMIT_LOG,
    variables: {
      input: {
        type: type,
        playerName: user.id,
        attributes: attributes,
        message: message,
      },
    },
  });
};
