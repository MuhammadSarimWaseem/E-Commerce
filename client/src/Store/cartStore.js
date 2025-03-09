

import { create } from "zustand";

const cartStore = create((set) => ({
    cartValue: [],
    addToCart: (item) => set((state) => ({ cartValue: [...state.cartValue, item] })),
    setCartValue: (newValue) => set({ cartValue: Array.isArray(newValue) ? newValue : [] }),
}));

export default cartStore;