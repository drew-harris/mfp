import create from "zustand";

export enum FilterType {
  all = "All Nodes",
  resource = "Resources",
  crafter = "Crafter",
  utility = "Utility",
}

export type FilterState = {
  switches: { [K in FilterType]: boolean };
  toggleSwitch: (key: FilterType) => void;
};

export const usePickerFilterStore = create<FilterState>((set, get) => ({
  switches: {
    [FilterType.all]: true,
    [FilterType.resource]: false,
    [FilterType.crafter]: false,
    [FilterType.utility]: false,
  },

  toggleSwitch(key: FilterType) {
    if (key === FilterType.all) {
      set({
        switches: {
          [FilterType.all]: true,
          [FilterType.resource]: false,
          [FilterType.crafter]: false,
          [FilterType.utility]: false,
        },
      });
      return;
    } else {
      const switches = get().switches;
      const newSwitches = { ...switches };
      newSwitches[key] = !newSwitches[key];
      newSwitches[FilterType.all] = false;
      set({ switches: newSwitches });
    }
  },
}));
