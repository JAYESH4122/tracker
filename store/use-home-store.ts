import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type HomeState = {
  greeting: string;
  userName: string;
  userId: string;
  setUserName: (name: string) => void;
  setUserId: (id: string) => void;
  setGreeting: (greeting: string) => void;
};

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      greeting: "Welcome back",
      userName: "Jayesh Patel",
      userId: "jayesh-patel-4122",

      setUserName: (name) => set({ userName: name }),
      setUserId: (id) => set({ userId: id }),
      setGreeting: (greeting) => set({ greeting }),
    }),
    {
      name: "home-profile-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
