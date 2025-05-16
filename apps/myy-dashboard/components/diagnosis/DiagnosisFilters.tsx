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

// 诊断状态选项
const diagnosisStatuses = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待诊断" },
  { value: "diagnosed", label: "已诊断" },
  { value: "treated", label: "已处理" },
  { value: "resolved", label: "已解决" },
];

export function DiagnosisFilters() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索植物名称、症状描述..."
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
            <Label htmlFor="status">诊断状态</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                {diagnosisStatuses.map((status) => (
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
            <Label htmlFor="reporter">报告人</Label>
            <Input
              id="reporter"
              type="text"
              placeholder="报告人姓名"
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
