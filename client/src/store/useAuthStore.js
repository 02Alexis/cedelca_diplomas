import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // nombre para poner en localStorage
      getStorage: () => localStorage, // por defecto es localStorage, pero se puede usar sessionStorage o custom
    }
  )
);

export default useAuthStore;
