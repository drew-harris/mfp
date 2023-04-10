import { gql, GraphQLClient } from 'graphql-request';

//will need to encrypt and .env
const endpoint = 'https://fs73ztf2angzrl5wenenojtq4u.appsync-api.us-east-1.amazonaws.com/graphql';
const password = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2h1bWluZ2FtZWxhYi5jb20iLCJzdWIiOiJ0ZXN0X2FkbWluIiwiZW1haWwiOiJ0ZXN0X2FkbWluIiwidWJfYWNjZXNzTGV2ZWwiOiJBTExPV0VEX0ZPUl9BTEwiLCJ1Yl9ncm91cHMiOiJbXSIsImlhdCI6MTY2NjIzMjU2NywiZXhwIjoxNjY2MzE4OTY3fQ.1ylUsmcDnmMAMw6ydRC5nMZSuviOJDYCc7CbU9FFsGY';
const key = 'myUserData';
const loggedInClient = new GraphQLClient(endpoint, { headers: { Authorization: password } })
const emptyMFP = { "nodes": [], "edges": [], "viewport": { "x": 0, "y": 0, "zoom": 1 } };

type AWSResponse = {
  getUserData: string;
  userID?: string;
};

const createUserMutation = gql`
mutation MyMutation($userID: String!) {
    createUser(userID: $userID, accessLevel: "STUDENT", groups: ["G1", "G2"], email: "") {
        userID
        email
        dateCreated
        lastUpdate
        accessLevel
        generatedID
        groups
    }
}`;

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

const createUser = async (userID: string) => {
  const queryVariables = {
    userID: userID,
  };
  const dataPushVariables = {
    userID: userID,
    key: key,
    data: JSON.stringify({ someValue: 'empty_value' }),
  }
  const data = await loggedInClient.request(createUserMutation, queryVariables);
  console.log("created user: " + JSON.stringify(data));
  //creates user ^^ without data
  const dataPush = await loggedInClient.request(createDataMutation, dataPushVariables);
  console.log("pushed data: " + JSON.stringify(dataPush));
  //creates data JSON object
  pushMFPData(userID, emptyMFP);
  //pushes default MFP data into data object
};

//returns JSON object
export const pullMFPData = async (userID: string) => {
  const queryVariables = {
    userID,
    key,
  };
  const data: AWSResponse = await loggedInClient.request(getUserDataQuery, queryVariables);
  const dummy = JSON.parse(data.getUserData); //if this errors out on nvim, its not really an error
  console.log(typeof dummy);
  if (typeof dummy.data === "undefined") {
    console.log("need to create user/user has no data");
    createUser(userID);
    console.log(dummy);
  } else if (typeof dummy.data.MFP === "undefined") {
    console.log("user has data, no MFP data");
    pushMFPData(userID, emptyMFP);
  } else if (dummy.data.MFP) {
    console.log("retrieved MFP Data : " + JSON.stringify(dummy.data.MFP));
    console.log(dummy);
    return dummy.data.MFP;
  }
};


//MFPData must be JSON Object example MFPData = {nodesOnScreen: 5, nodes: {one: "GrassBlock", two: "Furnace"}};
export const pushMFPData = async (userID: string, MFPData: object) => {
  const queryVariables = {
    userID,
    key,
  };
  const test: AWSResponse = await loggedInClient.request(getUserDataQuery, queryVariables);
  try {
    const userData = JSON.parse(test.getUserData); //if this errors out on nvim, its not really an error ESLINT hates me
    userData.data.MFP = { MFPData };
    const mutationVariables = {
      userID: userID,
      key: key,
      data: JSON.stringify(userData.data),
    };
    const data = await loggedInClient.request(createDataMutation, mutationVariables);
    return data;
  } catch (err) {
    console.log(err);
  }
}

