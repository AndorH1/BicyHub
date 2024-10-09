import { create } from "zustand";
import { User } from "../types/DataTypes";

type UserState = {
  user: User | null;
  setUser: (newUser: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser: User | null) => set({ user: newUser }),
}));
