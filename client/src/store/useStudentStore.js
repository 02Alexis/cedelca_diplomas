import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStudentStore = create(
  persist(
    (set) => ({
      students: [],
      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),
      clearStudents: () => set({ students: [] }),
    }),
    {
      name: "student-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useStudentStore;
