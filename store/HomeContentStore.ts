import { create } from "zustand";
import { Bike, Post } from "../types/DataTypes";

type PostState = {
  post: Post[] | null;
  setPost: (newPost: Post[] | null) => void;
};

type BikeState = {
  bike: Bike[] | null;
  setBike: (newBike: Bike[] | null) => void;
};

export const usePostStore = create<PostState>((set) => ({
  post: null,
  setPost: (newPost: Post[] | null) => set({ post: newPost }),
}));

export const useBikeStore = create<BikeState>((set) => ({
  bike: null,
  setBike: (newBike: Bike[] | null) => set({ bike: newBike }),
}));
