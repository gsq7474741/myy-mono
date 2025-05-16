"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IconArrowLeft, 
  IconDownload, 
  IconPrinter,
  IconChartBar,
  IconChartPie,
  IconChartLine
} from "@tabler/icons-react";

// 导入 shadcn chart 组件
import {
  ChartContainer,
  ChartLegend,
  type ChartConfig
} from "@/components/ui/chart";

// 导入 recharts 组件
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { formatCurrency } from "@/lib/utils/index";

export default function FinancialReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/finances">
              <IconArrowLeft className="h-4 w-4 mr-1" />
              返回财务管理
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">财务报表</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconPrinter className="h-4 w-4 mr-1" />
            打印报表
          </Button>
          <Button variant="outline" size="sm">
            <IconDownload className="h-4 w-4 mr-1" />
            导出数据
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>财务概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">本月收入</div>
              <div className="text-2xl font-bold">¥128,500</div>
              <div className="text-sm text-green-600">↑ 12.5% 环比上月</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">本月支出</div>
              <div className="text-2xl font-bold">¥86,450</div>
              <div className="text-sm text-red-600">↑ 8.2% 环比上月</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">本月利润</div>
              <div className="text-2xl font-bold">¥42,050</div>
              <div className="text-sm text-green-600">↑ 15.3% 环比上月</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">
            <IconChartBar className="h-4 w-4 mr-1" />
            收支概览
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <IconChartPie className="h-4 w-4 mr-1" />
            支出分析
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <IconChartLine className="h-4 w-4 mr-1" />
            收入趋势
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>收支概览</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px]">
              <div className="h-full w-full">
                {/* 定义图表配置 */}
                {(() => {
                  const chartConfig = {
                    income: {
                      label: "收入",
                      color: "hsl(var(--chart-1))",
                    },
                    expense: {
                      label: "支出",
                      color: "hsl(var(--chart-2))",
                    },
                    profit: {
                      label: "利润",
                      color: "hsl(var(--chart-3))",
                    },
                  } satisfies ChartConfig;

                  // 准备数据
                  const chartData = [
                    { month: "1月", income: 95000, expense: 68000, profit: 27000 },
                    { month: "2月", income: 88000, expense: 72000, profit: 16000 },
                    { month: "3月", income: 105000, expense: 80000, profit: 25000 },
                    { month: "4月", income: 128500, expense: 86450, profit: 42050 },
                    { month: "5月", income: 0, expense: 0, profit: 0 },
                    { month: "6月", income: 0, expense: 0, profit: 0 },
                  ];

                  return (
                    <ChartContainer config={chartConfig} className="w-full h-full">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `${label}`}
                          />
                          <ChartLegend />
                          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                          <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                          <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>支出分析</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px]">
              <div className="h-full w-full">
                {(() => {
                  // 准备数据
                  const data = [
                    { name: "采购支出", value: 42000, color: "hsl(var(--chart-1))" },
                    { name: "工资薪酬", value: 25000, color: "hsl(var(--chart-2))" },
                    { name: "租金物业", value: 8000, color: "hsl(var(--chart-3))" },
                    { name: "水电费用", value: 2450, color: "hsl(var(--chart-4))" },
                    { name: "运输物流", value: 3800, color: "hsl(var(--chart-5))" },
                    { name: "市场营销", value: 1200, color: "hsl(var(--chart-6))" },
                    { name: "设备维护", value: 5600, color: "hsl(var(--chart-7))" },
                    { name: "办公用品", value: 1800, color: "hsl(var(--chart-8))" },
                    { name: "差旅费用", value: 900, color: "hsl(var(--chart-9))" },
                    { name: "其他支出", value: 2700, color: "hsl(var(--chart-10))" },
                  ];

                  // 定义图表配置
                  const chartConfig = data.reduce((acc, item) => {
                    acc[item.name] = {
                      label: item.name,
                      color: item.color,
                    };
                    return acc;
                  }, {} as ChartConfig);

                  return (
                    <ChartContainer config={chartConfig} className="w-full h-full">
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={false}
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <ChartLegend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>收入趋势</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px]">
              <div className="h-full w-full">
                {(() => {
                  // 定义图表配置
                  const chartConfig = {
                    income2025: {
                      label: "2025年收入",
                      color: "hsl(var(--chart-1))",
                    },
                    income2024: {
                      label: "2024年收入",
                      color: "hsl(var(--chart-2))",
                    },
                  } satisfies ChartConfig;

                  // 准备数据
                  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
                  const chartData = months.map((month, index) => ({
                    month,
                    income2025: index < 4 
                      ? [95000, 88000, 105000, 128500][index] 
                      : null,
                    income2024: [82000, 78000, 92000, 110000, 105000, 118000, 125000, 130000, 115000, 108000, 120000, 135000][index],
                  }));

                  return (
                    <ChartContainer config={chartConfig} className="w-full h-full">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `${label}`}
                          />
                          <ChartLegend />
                          <Line 
                            type="monotone" 
                            dataKey="income2025" 
                            stroke="var(--color-income2025)" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="income2024" 
                            stroke="var(--color-income2024)" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>财务指标</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">毛利率</div>
              <div className="text-2xl font-bold">32.7%</div>
              <div className="text-sm text-green-600">↑ 2.1% 同比去年</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">运营成本率</div>
              <div className="text-2xl font-bold">18.5%</div>
              <div className="text-sm text-green-600">↓ 1.3% 同比去年</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">应收账款周转天数</div>
              <div className="text-2xl font-bold">45天</div>
              <div className="text-sm text-red-600">↑ 5天 环比上月</div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground">现金流比率</div>
              <div className="text-2xl font-bold">1.35</div>
              <div className="text-sm text-green-600">↑ 0.15 环比上月</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
