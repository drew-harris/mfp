import React from "react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import App from "./App";
import TaskCompleteProvider from "./components/contexts/TaskCompleteProvider";
import "./index.css";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <TaskCompleteProvider>
        <App />
      </TaskCompleteProvider>
    </ReactFlowProvider>
  </React.StrictMode>
);
