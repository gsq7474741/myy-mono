"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconEye, 
  IconEdit, 
  IconFileInvoice, 
  IconCash,
  IconCalendarEvent,
  IconUser
} from "@tabler/icons-react";

// 格式化金额
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// 支付方式映射
const paymentMethodText = {
  bank: "银行转账",
  cash: "现金",
  wechat: "微信支付",
  alipay: "支付宝",
  pos: "POS机刷卡"
};

// 支付状态映射
const paymentStatusText = {
  pending: "待确认",
  confirmed: "已确认",
  cancelled: "已取消"
};

// 支付状态颜色映射
const paymentStatusColors = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100"
};

// 模拟收款数据
const payments = [
  {
    id: "pay1",
    paymentNumber: "PAY20250401001",
    customer: {
      id: "cust1",
      name: "张三园林有限公司"
    },
    order: {
      id: "ord1",
      orderNumber: "ORD20250328001"
    },
    amount: 15600,
    paymentDate: "2025-04-01",
    paymentMethod: "bank",
    status: "confirmed",
    notes: "预付款",
    createdBy: "王财务",
    reference: "ZFB20250401001"
  },
  {
    id: "pay2",
    paymentNumber: "PAY20250330002",
    customer: {
      id: "cust2",
      name: "李四景观设计工作室"
    },
    order: {
      id: "ord2",
      orderNumber: "ORD20250327002"
    },
    amount: 14250,
    paymentDate: "2025-03-30",
    paymentMethod: "alipay",
    status: "confirmed",
    notes: "50%订金",
    createdBy: "王财务",
    reference: "ALIPAY20250330001"
  },
  {
    id: "pay3",
    paymentNumber: "PAY20250325003",
    customer: {
      id: "cust3",
      name: "王五"
    },
    order: {
      id: "ord4",
      orderNumber: "ORD20250325004"
    },
    amount: 3200,
    paymentDate: "2025-03-25",
    paymentMethod: "wechat",
    status: "confirmed",
    notes: "全款",
    createdBy: "李出纳",
    reference: "WX20250325001"
  },
  {
    id: "pay4",
    paymentNumber: "PAY20250402004",
    customer: {
      id: "cust4",
      name: "城市绿化管理处"
    },
    order: {
      id: "ord7",
      orderNumber: "ORD20250320007"
    },
    amount: 115000,
    paymentDate: "2025-04-02",
    paymentMethod: "bank",
    status: "pending",
    notes: "50%首付款",
    createdBy: "王财务",
    reference: "待银行确认"
  }
];

export function PaymentsList() {
  const [sortBy, setSortBy] = useState("date");
  
  return (
    <div className="space-y-4 mt-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    <Link 
                      href={`/finances/payments/${payment.id}`}
                      className="hover:underline"
                    >
                      {payment.paymentNumber}
                    </Link>
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={paymentStatusColors[payment.status as keyof typeof paymentStatusColors]}
                  >
                    {paymentStatusText[payment.status as keyof typeof paymentStatusText]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span>
                    客户: 
                    <Link 
                      href={`/sales/customers/${payment.customer.id}`}
                      className="hover:underline ml-1"
                    >
                      {payment.customer.name}
                    </Link>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconFileInvoice className="h-4 w-4 text-muted-foreground" />
                  <span>
                    关联订单: 
                    <Link 
                      href={`/sales/orders/${payment.order.id}`}
                      className="hover:underline ml-1"
                    >
                      {payment.order.orderNumber}
                    </Link>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
                  <span>收款日期: {payment.paymentDate}</span>
                </div>
                
                {payment.notes && (
                  <div className="text-sm text-muted-foreground">
                    备注: {payment.notes}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    支付方式: {paymentMethodText[payment.paymentMethod as keyof typeof paymentMethodText]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    参考号: {payment.reference}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    记录人: {payment.createdBy}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/finances/payments/${payment.id}`}>
                      <IconEye className="h-4 w-4 mr-1" />
                      查看
                    </Link>
                  </Button>
                  {payment.status === "pending" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/finances/payments/${payment.id}/edit`}>
                        <IconEdit className="h-4 w-4 mr-1" />
                        编辑
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
