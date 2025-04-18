import { create } from "zustand";
import Cookies from 'js-cookie'; // Import js-cookie
import { User } from "../interface/user.types";

interface UserState {
  user: User;
  setUser: (newUser: User) => void;
  clearUser: () => void;
  isProfileCompleted: boolean;
  setIsProfileCompleted: (value: boolean) => void;
}

const initialUser = Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : {} as User;

export const useUserStore = create<UserState>((set) => ({
  user: initialUser,
  setUser: (newUser: User) => {
    Cookies.set('user', JSON.stringify(newUser)); // Persist user in cookies
    set({ user: newUser });
  },
  clearUser: () => {
    Cookies.remove('user'); // Remove user from cookies
    set({ user: {} as User });
  },
  isProfileCompleted: true,
  setIsProfileCompleted: (value: boolean) => set({ isProfileCompleted: value }),
}));
