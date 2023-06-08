import { gql, GraphQLClient } from "graphql-request";
import { ReactFlowJsonObject } from "reactflow";

//will need to encrypt and .env
const endpoint =
  "https://fs73ztf2angzrl5wenenojtq4u.appsync-api.us-east-1.amazonaws.com/graphql";
const password =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2h1bWluZ2FtZWxhYi5jb20iLCJzdWIiOiJ0ZXN0X2FkbWluIiwiZW1haWwiOiJ0ZXN0X2FkbWluIiwidWJfYWNjZXNzTGV2ZWwiOiJBTExPV0VEX0ZPUl9BTEwiLCJ1Yl9ncm91cHMiOiJbXSIsImlhdCI6MTY2NjIzMjU2NywiZXhwIjoxNjY2MzE4OTY3fQ.1ylUsmcDnmMAMw6ydRC5nMZSuviOJDYCc7CbU9FFsGY";
const key = "myUserData";

const getUserDataQuery = gql`
  query MyQuery($userID: String!) {
    getUserData(userID: $userID, key: "myUserData")
  }
`;

const createDataMutation = gql`
    mutation MyMutation($userID: String!, $key: String!, $data: AWSJSON!) {
      createUserData(userID: $userID, key: $key, data: $data);
  }
`;

//returns JSON object
export const pullMFPData = async (userID: string) => {
  console.log("pulling data");
  const loggedInClient = new GraphQLClient(endpoint, {
    headers: { Authorization: password },
  });
  const queryVariables = {
    userID,
    key,
  };
  const data = (await loggedInClient.request(
    getUserDataQuery,
    queryVariables
  )) as any;
  console.log(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummy = JSON.parse(data.getUserData); //if this errors out on nvim, its not really an error
  if (dummy?.data?.MFP) {
    console.log("User has MFP data!");
    console.log(dummy.data.MFP);
    return dummy.data.MFP.MFP.MFPData;
  } else {
    return null;
  }
};

export const pushMFPData = async (
  userID: string,
  MFPData: ReactFlowJsonObject
) => {
  const loggedInClient = new GraphQLClient(endpoint, {
    headers: { Authorization: password },
  });
  const queryVariables = {
    userID,
    key,
  };
  const test = (await loggedInClient.request(
    getUserDataQuery,
    queryVariables
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userData: any = JSON.parse(test.getUserData);
  console.log("USERDATA:", userData);
  if (!userData.data) {
    userData.data = {};
  }
  userData.data.MFP = { MFP: { MFPData } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationVariables: any = {
    userID: userID,
    key: key,
    data: JSON.stringify(userData.data),
  };
  try {
    await loggedInClient.request(createDataMutation, mutationVariables);
  } catch (error) {
    console.log(error);
  }
};
