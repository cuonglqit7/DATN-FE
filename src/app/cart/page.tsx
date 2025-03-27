"use client";

import DialogCheckout from "@/app/cart/dialog-checkout";
import { formatPrice } from "@/components/format-price/format-price";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/sessionContext";
import { useEffect, useState, useCallback } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCartStore } from "@/state/cart-store";

export default function CartPage() {
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const { list: cartItems, updateQuantity, deleteCartItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  // Khởi tạo trạng thái checkbox khi cartItems thay đổi
  useEffect(() => {
    const initialSelected: any = {};
    cartItems.forEach((item) => {
      initialSelected[item.products.id] = false; // Mặc định không chọn
    });
    setSelectedItems(initialSelected);
  }, [cartItems]);

  // Kiểm tra xem tất cả sản phẩm đã được chọn hay chưa
  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedItems[item.products.id]);

  // Hàm xử lý khi checkbox "Chọn tất cả" thay đổi
  const handleSelectAllChange = () => {
    const newSelected: any = {};
    cartItems.forEach((item) => {
      newSelected[item.products.id] = !allSelected;
    });
    setSelectedItems(newSelected);
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (selectedItems[item.products.id]) {
      return (
        sum +
        (item.products.promotion_price || item.products.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  // Lọc các sản phẩm được chọn để truyền vào DialogCheckout
  const itemsToCheckout = cartItems.filter(
    (item) => selectedItems[item.products.id]
  );

  return (
    <div className="max-w-screen-xl mx-auto mt-40">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      <div className="flex justify-between">
        {/* Cart Table */}
        <table className="w-3/4 text-sm text-left rtl:text-right dark:text-gray-400 rounded">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-gray-200 text-left">
              <th scope="col" className="px-2 py-1 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAllChange}
                  disabled={cartItems.length === 0}
                />
              </th>
              <th scope="col" className="px-2 py-1 min-w-[100px]">
                Hình ảnh
              </th>
              <th scope="col" className="px-6 py-3">
                Tên sản phẩm
              </th>
              <th scope="col" className="px-6 py-3">
                Giá
              </th>
              <th scope="col" className="px-6 py-3">
                Số lượng
              </th>
              <th scope="col" className="px-6 py-3">
                Thành tiền
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : cartItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Giỏ hàng trống
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr key={item.products.id} className="border-b">
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedItems[item.products.id] || false}
                      onChange={() => handleCheckboxChange(item.products.id)}
                    />
                  </td>
                  <td className="px-2 py-1">
                    {item.products.image == null ? (
                      <p>Chưa có hình</p>
                    ) : (
                      <Image
                        src={item.products.image}
                        alt={item.products.name}
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold">{item.products.name}</td>
                  <td className="px-6 py-4">
                    {formatPrice(
                      item.products.promotion_price || item.products.price
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newQty = Math.max(1, item.quantity - 1);
                        updateQuantity({
                          productId: item.products.id,
                          quantity: newQty,
                        });
                      }}
                      disabled={item.quantity <= 1}
                    >
                      <AiOutlineMinus />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value) || 1;
                        updateQuantity({
                          productId: item.products.id,
                          quantity: newQty,
                        });
                      }}
                      className="w-16 text-center"
                      min={1}
                    />
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newQty = item.quantity + 1;
                        updateQuantity({
                          productId: item.products.id,
                          quantity: newQty,
                        });
                      }}
                    >
                      <AiOutlinePlus />
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    {formatPrice(
                      (item.products.promotion_price || item.products.price) *
                        item.quantity
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      className="cursor-pointer hover:text-red-600"
                      variant="secondary"
                      size="sm"
                      onClick={() => deleteCartItem(item.products.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="w-1/4 flex flex-col items-end p-4">
          <div className="text-lg font-semibold mb-4">
            Tổng tiền:{" "}
            <span className="text-green-500">{formatPrice(totalPrice)}</span>
          </div>
          <Button
            onClick={() => setCheckoutDialog(true)}
            className="w-full bg-green-500 text-white px-3 py-1 rounded-md text-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
            disabled={itemsToCheckout.length === 0 || loading}
          >
            Thanh toán
          </Button>
          <DialogCheckout
            open={checkoutDialog}
            onOpenChange={(open) => setCheckoutDialog(open)}
            selectedItems={itemsToCheckout}
          />
        </div>
      </div>
    </div>
  );
}
