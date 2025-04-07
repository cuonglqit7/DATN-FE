import RePayment from "@/app/tai-khoan/don-hang/RePayment";
import { formatPrice } from "@/components/format-price/format-price";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formatDate";
import { getProductById } from "@/server/product-detail";
import Image from "next/image";

type OrderItems = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
};

type Orders = {
  id: string;
  user_id: string;
  code: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  order_date: Date;
  total_price: number;
  payment_method: string;
  payment_status: string;
  status: string;
  user_note: string;
  admin_note: string;
  created_at: Date;
  updated_at: Date;
  order_items: OrderItems[];
};

interface TabsOrdersProps {
  ordersProcess: Orders[];
  ordersCompleted: Orders[];
}

export function TabsOrders({
  ordersProcess,
  ordersCompleted,
}: TabsOrdersProps) {
  return (
    <Tabs defaultValue="ordersProcess" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ordersProcess" className="cursor-pointer">
          Đơn hàng đang xử lý
        </TabsTrigger>
        <TabsTrigger value="orderHistory" className="cursor-pointer">
          Lịch sử mua hàng
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ordersProcess">
        <ul>
          {ordersProcess.length > 0 ? (
            <>
              {ordersProcess.map((order: Orders, index: number) => {
                return (
                  <li key={index}>
                    <div className="grid grid-cols-1 gap-2 border rounded-md mb-4 shadow-md">
                      <div className="grid grid-cols-6 bg-gray-100 p-4 rounded-t-md items-center">
                        <div>
                          Đơn hàng: <br /> #{order.code}
                        </div>
                        <div>
                          Ngày đặt hàng: <br /> {formatDate(order.order_date)}
                        </div>
                        <div className="text-center">
                          Tổng tiền: <br />{" "}
                          <p className="text-lg font-medium">
                            {formatPrice(order.total_price)}
                          </p>
                        </div>
                        <div className="col-span-2 text-center">
                          {order.payment_method == "cod"
                            ? "Thanh toán khi nhận hàng"
                            : ""}
                          {order.payment_method == "Bank_transfer"
                            ? "Chuyển khoản ngân hàng"
                            : ""}
                          {order.payment_method == "Momo"
                            ? order.payment_method
                            : ""}
                          <br />
                          {order.payment_status == "Pending" ? (
                            <>
                              <span className="text-rose-500">
                                Chờ thanh toán
                              </span>{" "}
                              {order.payment_method == "cod" ? (
                                ""
                              ) : (
                                <RePayment orderId={order.id} />
                              )}
                            </>
                          ) : (
                            ""
                          )}
                          {order.payment_status == "Completed" ? (
                            <>
                              <span className="text-green-500">
                                Đã thanh toán
                              </span>{" "}
                            </>
                          ) : (
                            ""
                          )}
                          {order.payment_status == "Failed" ? (
                            <>
                              <span className="text-rose-500">
                                Thanh toán thất bại
                              </span>{" "}
                              <Button
                                variant={"outline"}
                                className="cursor-pointer bg-green-400 hover:bg-green-500 hover:text-white transition-all"
                              >
                                Thử thanh toán lại
                              </Button>
                            </>
                          ) : (
                            ""
                          )}
                          {order.payment_status == "Refunded" ? (
                            <>
                              <span className="text-rose-500">
                                Đã hoàn tiền
                              </span>{" "}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="text-center">
                          Trang thái: <br />{" "}
                          {order.status == "Pending" ? (
                            <>
                              <span className="text-yellow-500">Chờ xử lý</span>
                            </>
                          ) : (
                            ""
                          )}
                          {order.status == "Confirm" ? (
                            <>
                              <span className="text-slate-500">
                                Đã xác nhận
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                          {order.status == "Edited" ? (
                            <>
                              <span className="text-orange-500">
                                Đã chỉnh sửa
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                          {order.status == "Delivering" ? (
                            <>
                              <span className="text-indigo-700">
                                Đang giao hàng
                              </span>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 ps-4">
                        <div>
                          <p>Người nhận: {order.recipient_name}</p>
                          <p>SĐT: {order.recipient_phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p>Giao đến: {order.shipping_address}</p>
                          <p>Ghi chú: {order.admin_note}</p>
                        </div>
                      </div>
                      <div className="px-4 w-full mb-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Sản phẩm</TableHead>
                              <TableHead>Giá</TableHead>
                              <TableHead>Số lượng</TableHead>
                              <TableHead className="text-right">
                                Thành tiền
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.order_items.map(
                              async (item: OrderItems, index: number) => {
                                const product = await getProductById(
                                  item.product_id
                                );
                                return (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      <div className="col-span-2 flex p-2 items-center gap-2">
                                        <Image
                                          src={product.avatar_url}
                                          alt={product.product_name}
                                          width={50}
                                          height={50}
                                          className="rounded-md"
                                        />
                                        <div>
                                          <p>{product.product_name}</p>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {formatPrice(item.unit_price)}
                                    </TableCell>
                                    <TableCell>x{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(
                                        item.unit_price * item.quantity
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {order.status == "Pending" || order.status == "Edited" ? (
                        <div className="flex justify-end gap-4 px-4 pb-2">
                          <button className="hover:text-red-600 cursor-pointer hover:underline">
                            Hủy đơn
                          </button>
                          <Button
                            variant={"outline"}
                            className="cursor-pointer bg-amber-300 hover:bg-amber-400 hover:text-white"
                          >
                            Chỉnh sửa
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                );
              })}
            </>
          ) : (
            "Không có đơn hàng nào đang xử lý"
          )}
        </ul>
      </TabsContent>
      <TabsContent value="orderHistory">
        <ul>
          {ordersCompleted.length > 0 ? (
            <>
              {ordersCompleted.map((order: Orders, index: number) => (
                <li key={index}>
                  <div className="grid grid-cols-1 gap-2 border rounded-md mb-4 ">
                    <div className="grid grid-cols-6 bg-gray-100 p-4 rounded-t-md items-center">
                      <div>
                        Đơn hàng: <br /> #{order.code}
                      </div>
                      <div>
                        Ngày đặt hàng: <br /> {formatDate(order.order_date)}
                      </div>
                      <div className="text-center">
                        Tổng tiền: <br />{" "}
                        <p className="text-lg font-medium">
                          {formatPrice(order.total_price)}
                        </p>
                      </div>
                      <div className="col-span-2 text-center">
                        <span>
                          {order.payment_method == "cod"
                            ? "Thanh toán khi nhận hàng"
                            : ""}
                          {order.payment_method == "Bank_transfer"
                            ? "Chuyển khoản ngân hàng"
                            : ""}
                          {order.payment_method == "Momo"
                            ? order.payment_method
                            : ""}
                        </span>{" "}
                        <br />
                      </div>
                      <div className="text-center">
                        Trang thái: <br />{" "}
                        {order.status == "Cancelled" ? (
                          <>
                            <span className="text-red-500">Đã hủy</span>
                          </>
                        ) : (
                          ""
                        )}
                        {order.status == "Completed" ? (
                          <>
                            <span className="text-green-500">Hoàn thành</span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 ps-4">
                      <div>
                        <p>Người nhận: {order.recipient_name}</p>
                        <p>SĐT: {order.recipient_phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p>Giao đến: {order.shipping_address}</p>
                        <p>Ghi chú: {order.admin_note}</p>
                      </div>
                    </div>
                    <div className="px-4 mb-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sản phẩm</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead className="text-right">
                              Thành tiền
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.order_items.map(
                            async (item: OrderItems, index: number) => {
                              const product = await getProductById(
                                item.product_id
                              );
                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div className="col-span-2 flex p-2 items-center gap-2">
                                      <Image
                                        src={product.avatar_url}
                                        alt={product.product_name}
                                        width={50}
                                        height={50}
                                        className="rounded-md"
                                      />
                                      <div>
                                        <p>{product.product_name}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatPrice(item.unit_price)}
                                  </TableCell>
                                  <TableCell>x{item.quantity}</TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(
                                      item.unit_price * item.quantity
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </li>
              ))}
            </>
          ) : (
            "Bạn chưa mua đơn hàng nào trước đây"
          )}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
