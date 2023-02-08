import create from "zustand";
import { tutorial } from "../hardcoded/tutorial";
import { RFState } from "./nodes";

export type TutorialState = {
  currentStep: TutorialStep;
  enabled: boolean;
  toggleTutorial: () => void;
  nextStep: () => void;
};

export interface TutorialStep {
  title?: string;
  description?: string;
  checkCompletion: (nodeState: RFState) => boolean;
  skippable?: boolean;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  currentStep: tutorial[0],
  enabled: false,

  toggleTutorial() {
    set({ enabled: !get().enabled });
  },

  nextStep() {
    const currentStepIndex = tutorial.findIndex(
      (step) => step === get().currentStep
    );
    if (currentStepIndex < tutorial.length - 1) {
      set({ currentStep: tutorial[currentStepIndex + 1] });
    }
  },
}));
