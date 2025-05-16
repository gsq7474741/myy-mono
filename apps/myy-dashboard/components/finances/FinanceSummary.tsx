"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/index";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

// 模拟数据
const financeSummary = {
  currentMonth: {
    revenue: 128500,
    expenses: 45600,
    profit: 82900,
    revenueChange: 12.5,
    expensesChange: 8.2,
    profitChange: 15.3,
  },
  outstanding: {
    receivables: 56800,
    payables: 23400,
  },
};

export function FinanceSummary() {
  const { currentMonth, outstanding } = financeSummary;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 收入卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">本月收入</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(currentMonth.revenue)}
              </h3>
            </div>
            <div className={`flex items-center ${currentMonth.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentMonth.revenueChange >= 0 ? (
                <IconArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <IconArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(currentMonth.revenueChange)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            较上月{currentMonth.revenueChange >= 0 ? '增长' : '下降'}
          </p>
        </CardContent>
      </Card>

      {/* 支出卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">本月支出</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(currentMonth.expenses)}
              </h3>
            </div>
            <div className={`flex items-center ${currentMonth.expensesChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentMonth.expensesChange >= 0 ? (
                <IconArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <IconArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(currentMonth.expensesChange)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            较上月{currentMonth.expensesChange >= 0 ? '增长' : '下降'}
          </p>
        </CardContent>
      </Card>

      {/* 利润卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">本月利润</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(currentMonth.profit)}
              </h3>
            </div>
            <div className={`flex items-center ${currentMonth.profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentMonth.profitChange >= 0 ? (
                <IconArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <IconArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(currentMonth.profitChange)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            较上月{currentMonth.profitChange >= 0 ? '增长' : '下降'}
          </p>
        </CardContent>
      </Card>

      {/* 应收账款 */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">待收款项</p>
              <h3 className="text-xl font-bold mt-1">
                {formatCurrency(outstanding.receivables)}
              </h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">待付款项</p>
              <h3 className="text-xl font-bold mt-1">
                {formatCurrency(outstanding.payables)}
              </h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">净资金流</p>
              <h3 className="text-xl font-bold mt-1">
                {formatCurrency(outstanding.receivables - outstanding.payables)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
