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
    // Wrap with persist middleware
    immer((set, get) => ({
      list: [],
      totalQuantity: 0,

      // Gộp "add" & "increaseQuantity" vào thành một hàm chung
      addOrUpdate: (props: TCartItem) =>
        set((state) => {
          const item = state.list.find(
            (i) => i.products.id === props.products.id
          );
          if (item) {
            item.quantity += props.quantity; // Tăng số lượng nếu đã có
          } else {
            state.list.push(props); // Thêm mới nếu chưa có
          }
          state.totalQuantity += props.quantity; // Cập nhật trực tiếp
        }),

      // Update số lượng, xóa nếu bằng 0
      updateQuantity: ({ productId, quantity }) =>
        set((state) => {
          const item = state.list.find((i) => i.products.id === productId);
          if (item) {
            state.totalQuantity += quantity - item.quantity; // Cập nhật tổng số lượng
            item.quantity = quantity;
          }
          state.list = state.list.filter((i) => i.quantity > 0); // Xóa item nếu = 0
        }),

      // Xóa sản phẩm theo ID
      deleteCartItem: (productId) =>
        set((state) => {
          const item = state.list.find((i) => i.products.id === productId);
          if (item) {
            state.totalQuantity -= item.quantity; // Giảm tổng số lượng
          }
          state.list = state.list.filter((i) => i.products.id !== productId);
        }),

      // Reset giỏ hàng
      reset: () => set({ list: [], totalQuantity: 0 }),
    })),
    {
      name: "cart-storage",
    }
  )
);
