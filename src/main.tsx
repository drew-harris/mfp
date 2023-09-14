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

const router = createBrowserRouter([
  {
    path: "/",
    element: <FactoryPlanner />,
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
