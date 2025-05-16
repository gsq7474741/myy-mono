"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlant2, IconPackage, IconShoppingCart, IconCoin } from "@tabler/icons-react";

export function StatisticsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">苗木总数</CardTitle>
          <IconPlant2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,284</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 +12.5%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">库存价值</CardTitle>
          <IconPackage className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥1,235,600</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 +8.2%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">本月销售额</CardTitle>
          <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥324,500</div>
          <p className="text-xs text-muted-foreground">
            较上月增长 +18.1%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">待处理订单</CardTitle>
          <IconCoin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">
            较上月减少 -4.5%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
