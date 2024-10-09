import { create } from "zustand";

type LoadingState = {
  isLoading: boolean;
  setIsLoading: (newValue: boolean) => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (newValue: boolean) => set({ isLoading: newValue }),
}));
