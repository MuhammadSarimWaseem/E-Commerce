import { create } from "zustand";

const cartStore = create((set) => ({
    cartValue: [],

    addToCart: (item) => set((state) => {
        const existingProductIndex = state.cartValue.findIndex((p) => p._id === item._id);

        if (existingProductIndex !== -1) {
            // Agar product already cart me hai, to quantity increase kar do
            const updatedCart = state.cartValue.map((p, index) =>
                index === existingProductIndex ? { ...p, quantity: p.quantity + 1, totalPrice: (p.quantity + 1) * p.price } : p
            );
            return { cartValue: updatedCart };
        } else {
            // Agar product naye hai, to initial quantity 1 set kar do
            return { cartValue: [...state.cartValue, { ...item, quantity: 1, totalPrice: item.price }] };
        }
    }),

    setCartValue: (newValue) => set({ cartValue: Array.isArray(newValue) ? newValue : [] }),
}));

export default cartStore;
