"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { useState } from "react";

// 发票状态选项
const invoiceStatuses = [
  { value: "all", label: "全部状态" },
  { value: "unpaid", label: "未支付" },
  { value: "partial", label: "部分支付" },
  { value: "paid", label: "已支付" },
];

// 支付方式选项
const paymentMethods = [
  { value: "all", label: "全部方式" },
  { value: "cash", label: "现金" },
  { value: "bank_transfer", label: "银行转账" },
  { value: "credit_card", label: "信用卡" },
];

// 支出类别选项
const expenseCategories = [
  { value: "all", label: "全部类别" },
  { value: "purchase", label: "采购支出" },
  { value: "salary", label: "工资支出" },
  { value: "rent", label: "租金支出" },
  { value: "utilities", label: "水电支出" },
  { value: "transportation", label: "运输支出" },
  { value: "maintenance", label: "维护支出" },
  { value: "other", label: "其他支出" },
];

interface FinanceFiltersProps {
  type: "invoice" | "payment" | "expense";
}

export function FinanceFilters({ type }: FinanceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // 根据类型选择不同的筛选项
  const getPlaceholder = () => {
    switch (type) {
      case "invoice":
        return "搜索发票号、客户名称...";
      case "payment":
        return "搜索付款参考号、客户名称...";
      case "expense":
        return "搜索支出描述、参考号...";
      default:
        return "搜索...";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={getPlaceholder()}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <IconFilter className="h-4 w-4" />
          <span className="sr-only">筛选</span>
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* 发票筛选项 */}
          {type === "invoice" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="invoice-status">发票状态</Label>
                <Select>
                  <SelectTrigger id="invoice-status">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* 付款筛选项 */}
          {type === "payment" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="payment-method">支付方式</Label>
                <Select>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="选择方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* 支出筛选项 */}
          {type === "expense" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="expense-category">支出类别</Label>
                <Select>
                  <SelectTrigger id="expense-category">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* 通用筛选项 */}
          <div className="space-y-2">
            <Label htmlFor="date-from">起始日期</Label>
            <Input
              id="date-from"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to">结束日期</Label>
            <Input
              id="date-to"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-amount">最小金额</Label>
            <Input
              id="min-amount"
              type="number"
              placeholder="最小金额"
              min={0}
            />
          </div>

          <div className="md:col-span-3 lg:col-span-4 flex justify-end gap-2">
            <Button variant="outline">重置</Button>
            <Button>应用筛选</Button>
          </div>
        </div>
      )}
    </div>
  );
}
