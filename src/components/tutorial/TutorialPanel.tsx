import { useEffect } from "react";
import { useNodeStore } from "../../stores/nodes";
import { useTutorialStore } from "../../stores/tutorialStore";

export const TutorialPanel = () => {
  const currentStep = useTutorialStore((s) => s.currentStep);
  const nextStep = useTutorialStore((s) => s.nextStep);

  // TODO: Create a custom comparison function for the node store to reduce rerenders
  const state = useNodeStore();

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
