import { OrdersList } from "@/components/sales/OrdersList";
import { OrderFilters } from "@/components/sales/OrderFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">销售管理</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/sales/orders/new">创建订单</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sales/customers">客户管理</Link>
          </Button>
        </div>
      </div>
      
      <OrderFilters />
      
      <OrdersList />
    </div>
  );
}
