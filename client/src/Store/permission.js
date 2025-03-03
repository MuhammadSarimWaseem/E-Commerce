import { create } from "zustand";

const permissionStore = create((set) => ({
    createCourse: false,
    setPermissionValue: (newValue) => set({ permissionValue: newValue }),
}));

export default permissionStore;