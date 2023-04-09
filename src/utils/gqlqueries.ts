import { request, gql, GraphQLClient } from 'graphql-request';

//will need to encrypt and .env
const endpoint = 'https://fs73ztf2angzrl5wenenojtq4u.appsync-api.us-east-1.amazonaws.com/graphql';
const password = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2h1bWluZ2FtZWxhYi5jb20iLCJzdWIiOiJ0ZXN0X2FkbWluIiwiZW1haWwiOiJ0ZXN0X2FkbWluIiwidWJfYWNjZXNzTGV2ZWwiOiJBTExPV0VEX0ZPUl9BTEwiLCJ1Yl9ncm91cHMiOiJbXSIsImlhdCI6MTY2NjIzMjU2NywiZXhwIjoxNjY2MzE4OTY3fQ.1ylUsmcDnmMAMw6ydRC5nMZSuviOJDYCc7CbU9FFsGY';
const key = 'myUserData';
const loggedInClient = new GraphQLClient(endpoint, { headers: { Authorization: password } })
const emptyMFP = { "nodes": [], "edges": [], "viewport": { "x": 0, "y": 0, "zoom": 1 } };

function jsonStringifyReplacer(key: any, value: any) {
  return value instanceof Set ? [...value] : value;
}

function pprint(obj: any): any {
  try {
    const obj_str = JSON.stringify(obj, jsonStringifyReplacer, 2);
    console.log(obj_str);
    return obj_str;
  } catch (error) {
    console.log('couldnt not stringify:')
    console.log(obj);
  }
}

const createDataMutation = gql`
  mutation MyMutation($userID: String!, $key: String!, $data: AWSJSON!) {
    createUserData(userID: $userID, key: $key, data: $data);
}
`;


const getUserDataQuery = gql`
  query MyQuery($userID: String!){
    getUserData(userID: $userID, key: "myUserData") 
  }
`;

//returns JSON object
export const pullMFPData = async (userID: string) => {
  const queryVariables: any = {
    userID,
    key,
  };
  let data = await loggedInClient.request(getUserDataQuery, queryVariables);
  let dummy: any = JSON.parse(data.getUserData); //if this errors out on nvim, its not really an error
  if (dummy.data === undefined) {
    console.log("need to create user/user has no data");
  } else if (dummy.data.MFP == undefined) {
    console.log("user has data, no MFP data");
    pushMFPData(userID, emptyMFP);
  } else if (dummy.data.MFP) {
    console.log("retrieved MFP Data : " + JSON.stringify(dummy.data.MFP));
    return dummy.data.MFP;
  }
};


//MFPData must be JSON Object example MFPData = {nodesOnScreen: 5, nodes: {one: "GrassBlock", two: "Furnace"}};
export const pushMFPData = async (userID: string, MFPData: any) => {
  const queryVariables: any = {
    userID,
    key,
  };
  const test = await loggedInClient.request(getUserDataQuery, queryVariables);
  let userData: any = JSON.parse(test.getUserData); //if this errors out on nvim, its not really an error ESLINT hates me
  userData.data.MFP = { MFPData };
  const mutationVariables: any = {
    userID: userID,
    key: key,
    data: JSON.stringify(userData.data),
  };
  let data = await loggedInClient.request(createDataMutation, mutationVariables);
}

