import create from "zustand";

export type TutorialState = {
  id: string | null;
  setId: (id: string) => void;
};

export const useUserStore = create<TutorialState>((set, _get) => ({
  id: null,

  setId(id) {
    set({ id });
  },
}));
