import { useEffect } from "react";
import { RFState, useNodeStore } from "../../stores/nodes";
import { useTutorialStore } from "../../stores/tutorialStore";

const customCompare = (oldState: RFState, newState: RFState): boolean => {
  if (oldState.nodes.length !== newState.nodes.length) {
    return false;
  }
  if (oldState.edges.length !== newState.edges.length) {
    return false;
  }
  for (let i = 0; i < oldState.nodes.length; i++) {
    if (oldState.nodes[i].id !== newState.nodes[i].id) {
      return false;
    }
  }
  for (let i = 0; i < oldState.edges.length; i++) {
    if (oldState.edges[i].id !== newState.edges[i].id) {
      return false;
    }
  }
  return true;
};

export const TutorialPanel = () => {
  const currentStep = useTutorialStore((s) => s.currentStep);
  const nextStep = useTutorialStore((s) => s.nextStep);

  // TODO: Create a custom comparison function for the node store to reduce rerenders
  const state = useNodeStore((s) => s, customCompare);

  useEffect(() => {
    console.log("Checking");
    const complete = currentStep.checkCompletion(state);
    if (complete) {
      nextStep();
    }
  }, [state.nodes, state.edges]);
  return (
    <div>
      <div className="text-lg font-bold">Tutorial</div>
      <div className="font-bold">{currentStep.title}</div>
      <div className="">{currentStep.description}</div>
    </div>
  );
};
