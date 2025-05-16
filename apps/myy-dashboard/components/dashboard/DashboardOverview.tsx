"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// 模拟数据
const salesData = [
  { month: "1月", value: 12000 },
  { month: "2月", value: 19000 },
  { month: "3月", value: 15000 },
  { month: "4月", value: 22000 },
  { month: "5月", value: 28000 },
  { month: "6月", value: 32000 },
];

const inventoryData = [
  { month: "1月", value: 150 },
  { month: "2月", value: 180 },
  { month: "3月", value: 210 },
  { month: "4月", value: 240 },
  { month: "5月", value: 270 },
  { month: "6月", value: 300 },
];

export function DashboardOverview() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>业务概览</CardTitle>
        <CardDescription>查看销售和库存趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">销售趋势</TabsTrigger>
            <TabsTrigger value="inventory">库存趋势</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="销售额 (元)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="inventory">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={inventoryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorInventory)"
                    name="库存量 (棵)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
