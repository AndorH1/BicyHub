import { create } from "zustand";
import { UserChatType } from "../types/DataTypes";

type UserInfoState = {
  userChat: UserChatType | null;
  setUserChat: (newUserChat: UserChatType | null) => void;
};

export const useUserChatStore = create<UserInfoState>((set) => ({
  userChat: null,
  setUserChat: (newUserChat: UserChatType | null) =>
    set({ userChat: newUserChat }),
}));
