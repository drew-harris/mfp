import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { client } from "./api/client";
import TaskCompleteProvider from "./components/contexts/TaskCompleteProvider";
import FactoryPlanner from "./FactoryPlanner";
import "./index.css";
import UserProvider from "./components/contexts/UserContext";
import { GET_CUSTOM_NODE } from "./api/customnodes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <FactoryPlanner />,
  },
  {
    path: "/edit/:customNodeId",
    element: <FactoryPlanner customNodeEdit={true} />,
    loader: async ({ params }) => {
      const result = await client.query({
        query: GET_CUSTOM_NODE,
        variables: {
          nodeId: params["customNodeId"],
        },
      });

      return result.data.customNode;
    },
  },
]);

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <ReactFlowProvider>
          <TaskCompleteProvider>
            <RouterProvider router={router} />
          </TaskCompleteProvider>
        </ReactFlowProvider>
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>
);
