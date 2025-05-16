"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/index";
import Link from "next/link";
import { IconEye, IconFileInvoice, IconTruck } from "@tabler/icons-react";

// 模拟数据
const orders = [
  {
    id: "ord1",
    orderNumber: "ORD20250328001",
    customer: {
      id: "cust1",
      name: "张三园林有限公司",
    },
    orderDate: "2025-03-28",
    deliveryDate: "2025-04-05",
    status: "pending",
    totalAmount: 15600,
    paidAmount: 0,
    itemsCount: 3,
  },
  {
    id: "ord2",
    orderNumber: "ORD20250327002",
    customer: {
      id: "cust2",
      name: "李四景观设计工作室",
    },
    orderDate: "2025-03-27",
    deliveryDate: "2025-04-10",
    status: "confirmed",
    totalAmount: 28500,
    paidAmount: 14250,
    itemsCount: 5,
  },
  {
    id: "ord3",
    orderNumber: "ORD20250325003",
    customer: {
      id: "cust3",
      name: "王五绿化工程有限公司",
    },
    orderDate: "2025-03-25",
    deliveryDate: "2025-04-02",
    status: "shipped",
    totalAmount: 42000,
    paidAmount: 42000,
    itemsCount: 8,
  },
  {
    id: "ord4",
    orderNumber: "ORD20250320004",
    customer: {
      id: "cust4",
      name: "赵六别墅花园",
    },
    orderDate: "2025-03-20",
    deliveryDate: "2025-03-28",
    status: "completed",
    totalAmount: 9800,
    paidAmount: 9800,
    itemsCount: 2,
  },
  {
    id: "ord5",
    orderNumber: "ORD20250318005",
    customer: {
      id: "cust5",
      name: "钱七物业管理有限公司",
    },
    orderDate: "2025-03-18",
    deliveryDate: "2025-03-25",
    status: "cancelled",
    totalAmount: 18500,
    paidAmount: 0,
    itemsCount: 4,
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "已确认", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "已发货", className: "bg-purple-100 text-purple-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
};

export function OrdersList() {
  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>订单日期</TableHead>
              <TableHead>交付日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>总金额</TableHead>
              <TableHead>已付款</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/sales/orders/${order.id}`} className="hover:underline">
                    {order.orderNumber}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {order.itemsCount} 种苗木
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/sales/customers/${order.customer.id}`} className="hover:underline">
                    {order.customer.name}
                  </Link>
                </TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[order.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  {formatCurrency(order.paidAmount)}
                  <div className="text-xs text-muted-foreground">
                    {Math.round((order.paidAmount / order.totalAmount) * 100) || 0}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/sales/orders/${order.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    {order.status === "confirmed" && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/sales/orders/${order.id}/ship`}>
                          <IconTruck className="h-4 w-4 mr-1" />
                          发货
                        </Link>
                      </Button>
                    )}
                    {(order.status === "shipped" || order.status === "completed") && 
                     order.paidAmount < order.totalAmount && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/sales/orders/${order.id}/invoice`}>
                          <IconFileInvoice className="h-4 w-4 mr-1" />
                          开票
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
