import { InventoryList } from "@/components/inventory/InventoryList";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">库存管理</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/inventory/inbound/new">入库登记</Link>
          </Button>
          <Button asChild>
            <Link href="/inventory/outbound/new">出库登记</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/inventory/check/new">库存盘点</Link>
          </Button>
        </div>
      </div>
      
      <InventoryFilters />
      
      <InventoryList />
    </div>
  );
}
