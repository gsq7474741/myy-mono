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

// 订单状态选项
const orderStatuses = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待处理" },
  { value: "confirmed", label: "已确认" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

export function OrderFilters() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索订单号、客户名称..."
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
          <div className="space-y-2">
            <Label htmlFor="status">订单状态</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
