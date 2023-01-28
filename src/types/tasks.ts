import { MCNodeType } from "./MCNodes";

export interface Task {
  itemRequirements?: ItemRequirement[];
  nodeRequirements?: NodeRequirement[];

  description?: string;
  title?: string;
  id: string;
}

export interface ItemRequirement {
  itemId: number;
  perHour: number;
}

export interface NodeRequirement {
  nodeType: MCNodeType;
  itemId?: number;
  amount: number;
}

export interface DraggableOrderData {
  type: MCNodeType.order;
  task: Task;
}
