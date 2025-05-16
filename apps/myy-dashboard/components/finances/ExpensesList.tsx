"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconEye, 
  IconEdit, 
  IconReceipt, 
  IconCalendarEvent,
  IconUser,
  IconCategory
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
  pos: "POS机刷卡",
  credit: "公司信用卡"
};

// 支出状态映射
const expenseStatusText = {
  pending: "待审批",
  approved: "已审批",
  rejected: "已拒绝",
  paid: "已支付"
};

// 支出状态颜色映射
const expenseStatusColors = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  approved: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  paid: "bg-green-100 text-green-800 hover:bg-green-100"
};

// 支出类别映射
const expenseCategoryText = {
  purchase: "采购支出",
  salary: "工资薪酬",
  rent: "租金物业",
  utilities: "水电费用",
  transport: "运输物流",
  marketing: "市场营销",
  maintenance: "设备维护",
  office: "办公用品",
  travel: "差旅费用",
  other: "其他支出"
};

// 模拟支出数据
const expenses = [
  {
    id: "exp1",
    expenseNumber: "EXP20250401001",
    category: "purchase",
    amount: 25000,
    expenseDate: "2025-04-01",
    paymentMethod: "bank",
    status: "paid",
    notes: "采购新批次种子",
    createdBy: "李采购",
    approvedBy: "张经理",
    vendor: "绿源种子供应商",
    reference: "PO20250401001",
    hasReceipt: true
  },
  {
    id: "exp2",
    expenseNumber: "EXP20250331002",
    category: "transport",
    amount: 3800,
    expenseDate: "2025-03-31",
    paymentMethod: "alipay",
    status: "paid",
    notes: "3月份物流费用",
    createdBy: "王物流",
    approvedBy: "张经理",
    vendor: "速达物流公司",
    reference: "TR20250331001",
    hasReceipt: true
  },
  {
    id: "exp3",
    expenseNumber: "EXP20250330003",
    category: "utilities",
    amount: 2450,
    expenseDate: "2025-03-30",
    paymentMethod: "bank",
    status: "paid",
    notes: "3月份水电费",
    createdBy: "赵行政",
    approvedBy: "张经理",
    vendor: "市政水电公司",
    reference: "UT20250330001",
    hasReceipt: true
  },
  {
    id: "exp4",
    expenseNumber: "EXP20250402004",
    category: "maintenance",
    amount: 5600,
    expenseDate: "2025-04-02",
    paymentMethod: "credit",
    status: "pending",
    notes: "温室设备维修",
    createdBy: "钱技术",
    approvedBy: null,
    vendor: "恒温设备维修公司",
    reference: "MT20250402001",
    hasReceipt: false
  },
  {
    id: "exp5",
    expenseNumber: "EXP20250402005",
    category: "salary",
    amount: 86000,
    expenseDate: "2025-04-05",
    paymentMethod: "bank",
    status: "approved",
    notes: "4月份工资",
    createdBy: "孙人事",
    approvedBy: "张经理",
    vendor: "内部",
    reference: "HR20250402001",
    hasReceipt: false
  }
];

export function ExpensesList() {
  const [sortBy, setSortBy] = useState("date");
  
  return (
    <div className="space-y-4 mt-4">
      {expenses.map((expense) => (
        <Card key={expense.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    <Link 
                      href={`/finances/expenses/${expense.id}`}
                      className="hover:underline"
                    >
                      {expense.expenseNumber}
                    </Link>
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={expenseStatusColors[expense.status as keyof typeof expenseStatusColors]}
                  >
                    {expenseStatusText[expense.status as keyof typeof expenseStatusText]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconCategory className="h-4 w-4 text-muted-foreground" />
                  <span>
                    类别: {expenseCategoryText[expense.category as keyof typeof expenseCategoryText]}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span>
                    供应商: {expense.vendor}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
                  <span>支出日期: {expense.expenseDate}</span>
                </div>
                
                {expense.notes && (
                  <div className="text-sm text-muted-foreground">
                    备注: {expense.notes}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    支付方式: {paymentMethodText[expense.paymentMethod as keyof typeof paymentMethodText]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    参考号: {expense.reference}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    记录人: {expense.createdBy}
                  </div>
                  {expense.approvedBy && (
                    <div className="text-sm text-muted-foreground">
                      审批人: {expense.approvedBy}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/finances/expenses/${expense.id}`}>
                      <IconEye className="h-4 w-4 mr-1" />
                      查看
                    </Link>
                  </Button>
                  {(expense.status === "pending" || expense.status === "approved") && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/finances/expenses/${expense.id}/edit`}>
                        <IconEdit className="h-4 w-4 mr-1" />
                        编辑
                      </Link>
                    </Button>
                  )}
                  {expense.hasReceipt && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/finances/expenses/${expense.id}/receipt`}>
                        <IconReceipt className="h-4 w-4 mr-1" />
                        查看凭证
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
