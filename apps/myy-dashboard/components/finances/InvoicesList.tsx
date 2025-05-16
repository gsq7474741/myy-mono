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
import { IconEye, IconReceipt, IconCreditCard } from "@tabler/icons-react";

// 模拟数据
const invoices = [
  {
    id: "inv1",
    invoiceNumber: "INV20250328001",
    orderId: "ord1",
    orderNumber: "ORD20250328001",
    customer: {
      id: "cust1",
      name: "张三园林有限公司",
    },
    issueDate: "2025-03-28",
    dueDate: "2025-04-27",
    amount: 15600,
    status: "unpaid",
    payments: [],
  },
  {
    id: "inv2",
    invoiceNumber: "INV20250327002",
    orderId: "ord2",
    orderNumber: "ORD20250327002",
    customer: {
      id: "cust2",
      name: "李四景观设计工作室",
    },
    issueDate: "2025-03-27",
    dueDate: "2025-04-26",
    amount: 28500,
    status: "partial",
    payments: [
      {
        id: "pay1",
        amount: 14250,
        date: "2025-03-30",
        method: "bank_transfer",
      },
    ],
  },
  {
    id: "inv3",
    invoiceNumber: "INV20250325003",
    orderId: "ord3",
    orderNumber: "ORD20250325003",
    customer: {
      id: "cust3",
      name: "王五绿化工程有限公司",
    },
    issueDate: "2025-03-25",
    dueDate: "2025-04-24",
    amount: 42000,
    status: "paid",
    payments: [
      {
        id: "pay2",
        amount: 42000,
        date: "2025-03-28",
        method: "bank_transfer",
      },
    ],
  },
  {
    id: "inv4",
    invoiceNumber: "INV20250320004",
    orderId: "ord4",
    orderNumber: "ORD20250320004",
    customer: {
      id: "cust4",
      name: "赵六别墅花园",
    },
    issueDate: "2025-03-20",
    dueDate: "2025-04-19",
    amount: 9800,
    status: "paid",
    payments: [
      {
        id: "pay3",
        amount: 9800,
        date: "2025-03-22",
        method: "credit_card",
      },
    ],
  },
  {
    id: "inv5",
    invoiceNumber: "INV20250315005",
    orderId: "ord6",
    orderNumber: "ORD20250315006",
    customer: {
      id: "cust6",
      name: "孙八花卉批发市场",
    },
    issueDate: "2025-03-15",
    dueDate: "2025-04-14",
    amount: 23500,
    status: "unpaid",
    payments: [],
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  unpaid: { label: "未支付", className: "bg-red-100 text-red-800" },
  partial: { label: "部分支付", className: "bg-yellow-100 text-yellow-800" },
  paid: { label: "已支付", className: "bg-green-100 text-green-800" },
};


export function InvoicesList() {
  // 计算已付金额
  const getPaidAmount = (invoice: typeof invoices[0]) => {
    return invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // 计算剩余金额
  const getRemainingAmount = (invoice: typeof invoices[0]) => {
    return invoice.amount - getPaidAmount(invoice);
  };

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>发票号</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>订单号</TableHead>
              <TableHead>开票日期</TableHead>
              <TableHead>到期日期</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  <Link href={`/finances/invoices/${invoice.id}`} className="hover:underline">
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/sales/customers/${invoice.customer.id}`} className="hover:underline">
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/sales/orders/${invoice.orderId}`} className="hover:underline">
                    {invoice.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  {formatCurrency(invoice.amount)}
                  {invoice.status === "partial" && (
                    <div className="text-xs text-muted-foreground">
                      已付: {formatCurrency(getPaidAmount(invoice))}, 
                      剩余: {formatCurrency(getRemainingAmount(invoice))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[invoice.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[invoice.status]?.label || invoice.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/finances/invoices/${invoice.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    {(invoice.status === "unpaid" || invoice.status === "partial") && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/finances/invoices/${invoice.id}/record-payment`}>
                          <IconCreditCard className="h-4 w-4 mr-1" />
                          记录付款
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/finances/invoices/${invoice.id}/print`}>
                        <IconReceipt className="h-4 w-4 mr-1" />
                        打印
                      </Link>
                    </Button>
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
