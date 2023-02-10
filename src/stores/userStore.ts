import create from "zustand";

export type TutorialState = {
  id: string | null;
  setTutorialId: (id: string) => void;
};

export const useUserStore = create<TutorialState>((set, get) => ({
  id: null,

  setTutorialId(id) {
    set({ id });
  },
}));
