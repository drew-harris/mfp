import { TutorialStep } from "../stores/tutorialStore";
import { MCNodeType } from "../types/MCNodes";

export const tutorial: TutorialStep[] = [
  {
    title: "Welcome to the tutorial!",
    description:
      "This is the first step of the tutorial. Drag a resource node to the canvas to continue.",
    checkCompletion(nodeState) {
      return !!nodeState.nodes.find(
        (n) => n.data.dataType === MCNodeType.resource
      );
    },
  },
  {
    title: "Step 2",
    description:
      "Drag a crafter node to continue. You can drag a crafter node from the panel on the bottom",
    checkCompletion(nodeState) {
      return !!nodeState.nodes.find(
        (n) => n.data.dataType === MCNodeType.crafter
      );
    },
  },
];
