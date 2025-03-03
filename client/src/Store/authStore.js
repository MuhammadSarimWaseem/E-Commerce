import { create } from "zustand";

const authStore = create((set) => ({
    isAuthenticated: false,
    setValue: (newValue) => set({ value: newValue }),
}));

export default authStore;