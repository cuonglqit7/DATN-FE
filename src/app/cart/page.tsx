"use client";

import DialogCheckout from "@/app/cart/dialog-checkout";
import { formatPrice } from "@/components/format-price/format-price";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/sessionContext";
import { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCartStore } from "@/state/cart-store";
import { toast } from "sonner";

export default function CartPage() {
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const { list: cartItems, updateQuantity, deleteCartItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed" | null
  >(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const { sessionToken } = useSession();

  // Fixed VAT rate (e.g., 10%)
  const VAT_RATE = 0.1;

  // Initialize checkbox state when cartItems change
  useEffect(() => {
    const initialSelected: any = {};
    cartItems.forEach((item) => {
      initialSelected[item.products.id] = false; // Default unchecked
    });
    setSelectedItems(initialSelected);
  }, [cartItems]);

  // Check if all items are selected
  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedItems[item.products.id]);

  // Handle "Select All" checkbox change
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

  // Handle discount code application
  const applyDiscountCode = async () => {
    if (!discountCode) {
      setErrorMessage("Vui lòng nhập mã giảm giá");
      setDiscountType(null);
      setDiscountValue(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/discounts/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ code: discountCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Mã giảm giá không hợp lệ"
        );
      }

      const discount = data.data;

      // Check if discount is active
      if (discount.status !== "active") {
        throw new Error("Mã giảm giá không còn hiệu lực");
      }

      // Check usage limit
      if (discount.numper_usage <= 0) {
        throw new Error("Mã giảm giá đã hết lượt sử dụng");
      }

      // Set discount type and value
      setDiscountType(discount.discount_type);
      setDiscountValue(
        discount.discount_type === "percentage"
          ? discount.discount_value / 100
          : discount.discount_value
      );
      setErrorMessage("");
      toast.success("Mã giảm giá được áp dụng thành công!");
    } catch (error: any) {
      setDiscountType(null);
      setDiscountValue(0);
      setErrorMessage(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal for selected items
  const subtotal = cartItems.reduce((sum, item) => {
    if (selectedItems[item.products.id]) {
      return (
        sum +
        (item.products.promotion_price || item.products.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  // Calculate VAT
  const vatAmount = subtotal * VAT_RATE;

  // Calculate discount amount
  const discountAmount =
    discountType === "percentage" ? subtotal * discountValue : discountValue;

  // Calculate total price (subtotal + VAT - discount)
  const totalPrice = subtotal + vatAmount - discountAmount;

  const itemsToCheckout = cartItems.filter(
    (item) => selectedItems[item.products.id]
  );

  return (
    <div className="max-w-screen-xl min-h-screen mx-auto mt-40">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      <div className="flex justify-between gap-2">
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
          <tbody className="bg-white h-fit">
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
                <tr key={item.products.id} className="border-b ">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
                    </div>
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

        <div className="w-1/4 flex flex-col items-end p-4 bg-white rounded">
          {/* Discount Code Input */}
          <div className="w-full mb-4">
            <label className="text-sm font-semibold">Mã giảm giá</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã giảm giá"
                className="w-full"
                disabled={loading}
              />
              <Button
                onClick={applyDiscountCode}
                variant="outline"
                disabled={loading}
              >
                Áp dụng
              </Button>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="w-full text-lg font-semibold mb-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế VAT ({VAT_RATE * 100}%):</span>
              <span>{formatPrice(vatAmount)}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-green-500">
                <span>
                  Giảm giá (
                  {discountType === "percentage"
                    ? `${discountValue * 100}%`
                    : formatPrice(discountValue)}
                  ):
                </span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between mt-2">
              <span>Tổng tiền:</span>
              <span className="text-green-500">{formatPrice(totalPrice)}</span>
            </div>
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
            totalPrice={totalPrice}
            vatAmount={vatAmount}
            discountAmount={discountAmount}
            discountCode={discountCode}
          />
        </div>
      </div>
    </div>
  );
}
