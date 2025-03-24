import { create } from "zustand";
import { IUser } from "../interface/user.types";

interface UserState {
  user: IUser;
  setUser: (newUser: IUser) => void;
  clearUser: () => void;
  isProfileCompleted: boolean;
  setIsProfileCompleted: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {} as IUser,
  setUser: (newUser: IUser) => set({ user: newUser }),
  clearUser: () => set({ user: {} as IUser }),
  isProfileCompleted: true,
  setIsProfileCompleted: (value: boolean) => set({ isProfileCompleted: value }),
}));
