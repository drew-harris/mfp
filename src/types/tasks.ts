import { RFState } from "../stores/nodes";
import { DraggableType, MCNodeType } from "./MCNodes";

export interface Mission {
  title: string;
  id: string;
  description?: string;
  completeMessage?: string;
  tasks: Task[];

  // List of all available items for the mission
  idPool?: string[];
}

export interface Task {
  itemRequirements?: ItemRequirement[];
  nodeRequirements?: NodeRequirement[];
  stateRequirement?: (state: RFState) => boolean;

  description?: string;
  title?: string;
  id: string;

  continuation?: boolean;

  idPool?: string[] | "inherit";
}

export interface ItemRequirement {
  itemId: string;
  perHour: number;
}

export interface NodeRequirement {
  nodeType: MCNodeType;
  itemId?: string;
  amount: number;
}

export interface DraggableOrderData {
  type: MCNodeType.order;
  task: Task;
}
