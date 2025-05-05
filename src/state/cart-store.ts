// state/cart-store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware"; // Import persist middleware

export type TCartItem = {
  products: {
    id: number;
    name: string;
    price: number;
    promotion_price?: number;
    image: string;
  };
  quantity: number;
};

type State = {
  list: TCartItem[];
  totalQuantity: number;
};

type Action = {
  addOrUpdate: (props: TCartItem) => void;
  updateQuantity: (props: { productId: number; quantity: number }) => void;
  deleteCartItem: (productId: number) => void;
  reset: () => void;
};

export const useCartStore = create<State & Action>()(
  persist(
    immer((set, get) => ({
      list: [],
      totalQuantity: 0,

      addOrUpdate: (props: TCartItem) =>
        set((state) => {
          const item = state.list.find(
            (i) => i.products.id === props.products.id
          );
          if (item) {
            item.quantity += props.quantity;
          } else {
            state.list.push(props);
          }
          state.totalQuantity += props.quantity;
        }),

      updateQuantity: ({ productId, quantity }) =>
        set((state) => {
          const item = state.list.find((i) => i.products.id === productId);
          if (item) {
            state.totalQuantity += quantity - item.quantity;
            item.quantity = quantity;
          }
          state.list = state.list.filter((i) => i.quantity > 0);
        }),

      deleteCartItem: (productId) =>
        set((state) => {
          const item = state.list.find((i) => i.products.id === productId);
          if (item) {
            state.totalQuantity -= item.quantity;
          }
          state.list = state.list.filter((i) => i.products.id !== productId);
        }),

      reset: () => set({ list: [], totalQuantity: 0 }),
    })),
    {
      name: "cart-storage",
    }
  )
);
