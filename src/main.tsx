import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import App from "./App";
import TaskCompleteProvider from "./components/contexts/TaskCompleteProvider";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <TaskCompleteProvider>
        <RouterProvider router={router} />
      </TaskCompleteProvider>
    </ReactFlowProvider>
  </React.StrictMode>
);
