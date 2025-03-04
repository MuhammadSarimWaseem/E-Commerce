import { create } from "zustand";

const permissionStore = create((set) => ({
    AddProducts: false,
    setPermissionValue: (newValue) => set({ permissionValue: newValue }),
}));

export default permissionStore;