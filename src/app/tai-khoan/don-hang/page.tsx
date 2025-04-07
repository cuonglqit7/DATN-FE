import { TabsOrders } from "@/app/tai-khoan/don-hang/tabsOrders";
import { getOrders } from "@/server/orders";

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
};

type Order = {
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
  order_items: OrderItem[];
};

export default async function page() {
  const resOrders = (await getOrders()) as { orders: Order[] } | null;

  if (!resOrders || !Array.isArray(resOrders.orders)) {
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <div>Vui lòng đăng nhập hoặc hiện chưa có đơn hàng nào!</div>
      </div>
    );
  }

  const ordersCompleted = resOrders.orders.filter((order) =>
    ["Completed", "Cancelled"].includes(order.status)
  );

  const ordersProcess = resOrders.orders.filter(
    (order) => !["Completed", "Cancelled"].includes(order.status)
  );

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <TabsOrders
        ordersProcess={ordersProcess}
        ordersCompleted={ordersCompleted}
      />
    </div>
  );
}
