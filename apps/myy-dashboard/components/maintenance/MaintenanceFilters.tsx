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

// 养护计划状态选项
const planStatuses = [
  { value: "all", label: "全部状态" },
  { value: "active", label: "进行中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

// 养护任务状态选项
const taskStatuses = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待处理" },
  { value: "in_progress", label: "进行中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

// 养护类型选项
const maintenanceTypes = [
  { value: "all", label: "全部类型" },
  { value: "regular", label: "常规养护" },
  { value: "special", label: "特殊养护" },
];

interface MaintenanceFiltersProps {
  type: "plan" | "task" | "record";
}

export function MaintenanceFilters({ type }: MaintenanceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // 根据类型选择不同的筛选项
  const getPlaceholder = () => {
    switch (type) {
      case "plan":
        return "搜索养护计划名称、客户名称...";
      case "task":
        return "搜索养护任务名称、描述...";
      case "record":
        return "搜索养护记录、植物名称...";
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
          {/* 养护计划筛选项 */}
          {type === "plan" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="plan-status">计划状态</Label>
                <Select>
                  <SelectTrigger id="plan-status">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {planStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance-type">养护类型</Label>
                <Select>
                  <SelectTrigger id="maintenance-type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* 养护任务筛选项 */}
          {type === "task" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="task-status">任务状态</Label>
                <Select>
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned-to">负责人</Label>
                <Input
                  id="assigned-to"
                  type="text"
                  placeholder="负责人姓名"
                />
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

          <div className="md:col-span-3 lg:col-span-4 flex justify-end gap-2">
            <Button variant="outline">重置</Button>
            <Button>应用筛选</Button>
          </div>
        </div>
      )}
    </div>
  );
}
