import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStudentListStore = create(
  persist(
    (set) => ({
      students: [],
      setStudents: (students) => set({ students }),
      clearStudents: () => set({ students: [] }),
    }),
    {
      name: "student-list-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useStudentListStore;
