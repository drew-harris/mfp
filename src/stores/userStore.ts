import create from "zustand";

export type UserState = {
  id: string | null;
  setId: (id: string) => void;
};

export const useUserStore = create<UserState>((set, _get) => ({
  id: null,

  setId(id) {
    set({ id });
  },
}));
