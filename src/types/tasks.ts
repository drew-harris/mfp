import { DraggableType, MCNodeType } from "./MCNodes";

export interface Task {
  itemRequirements?: ItemRequirement[];
  nodeRequirements?: NodeRequirement[];

  description?: string;
  title?: string;
  id: string;
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
  draggableType: DraggableType.order;
}
