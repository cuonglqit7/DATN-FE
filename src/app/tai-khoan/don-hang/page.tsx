import { TabsOrders } from "@/app/tai-khoan/don-hang/tabsOrders";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/server/orders";

export default async function page() {
  const resOrders = (await getOrders()) as any;

  if (!resOrders) {
    return (
      <>
        <div className="bg-white shadow-md rounded-md p-6">
          <div>Vui lòng đăng nhập!</div>
        </div>
      </>
    );
  }
  const orders = resOrders.orders;

  const ordersCompleted = orders.filter(
    (order: any) => order.status == "Completed" || order.status == "Cancelled"
  );

  const ordersProcess = orders.filter(
    (order: any) => order.status != "Completed" && order.status != "Cancelled"
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
