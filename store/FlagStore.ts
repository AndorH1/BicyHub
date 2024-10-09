import { create } from "zustand";

type FlagState = {
  flag: boolean;
  setFlag: (newValue: boolean) => void;
};

export const useFlagStore = create<FlagState>((set) => ({
  flag: false,
  setFlag: (newValue: boolean) => set({ flag: newValue }),
}));
