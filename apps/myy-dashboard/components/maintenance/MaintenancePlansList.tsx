"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { IconEye, IconEdit, IconList, IconCalendarTime } from "@tabler/icons-react";

// 模拟数据
const maintenancePlans = [
  {
    id: "mp1",
    name: "2025年春季养护计划",
    type: "regular",
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    customer: {
      id: "cust1",
      name: "张三园林有限公司",
    },
    status: "active",
    description: "常规春季养护，包括修剪、施肥、病虫害防治等",
    tasksCount: 12,
    completedTasksCount: 5,
  },
  {
    id: "mp2",
    name: "李四景观设计工作室特殊养护",
    type: "special",
    startDate: "2025-03-15",
    endDate: "2025-04-15",
    customer: {
      id: "cust2",
      name: "李四景观设计工作室",
    },
    status: "active",
    description: "针对新栽植苗木的特殊养护计划",
    tasksCount: 8,
    completedTasksCount: 3,
  },
  {
    id: "mp3",
    name: "王五绿化工程冬季养护",
    type: "regular",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    customer: {
      id: "cust3",
      name: "王五绿化工程有限公司",
    },
    status: "completed",
    description: "冬季防寒保暖养护计划",
    tasksCount: 10,
    completedTasksCount: 10,
  },
  {
    id: "mp4",
    name: "赵六别墅花园维护",
    type: "regular",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    customer: {
      id: "cust4",
      name: "赵六别墅花园",
    },
    status: "active",
    description: "全年定期养护服务",
    tasksCount: 24,
    completedTasksCount: 6,
  },
  {
    id: "mp5",
    name: "钱七物业绿化应急处理",
    type: "special",
    startDate: "2025-03-10",
    endDate: "2025-03-25",
    customer: {
      id: "cust5",
      name: "钱七物业管理有限公司",
    },
    status: "cancelled",
    description: "台风过后的绿化应急修复计划",
    tasksCount: 5,
    completedTasksCount: 2,
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: "进行中", className: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
};

// 类型映射
const typeMap: Record<string, string> = {
  regular: "常规养护",
  special: "特殊养护",
};

export function MaintenancePlansList() {
  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>养护计划</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>时间范围</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenancePlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  <Link href={`/maintenance/plans/${plan.id}`} className="hover:underline">
                    {plan.name}
                  </Link>
                  <div className="text-xs text-muted-foreground line-clamp-1" title={plan.description}>
                    {plan.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/sales/customers/${plan.customer.id}`} className="hover:underline">
                    {plan.customer.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div>{plan.startDate}</div>
                  <div className="text-xs text-muted-foreground">至 {plan.endDate}</div>
                </TableCell>
                <TableCell>{typeMap[plan.type] || plan.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ 
                          width: `${Math.round((plan.completedTasksCount / plan.tasksCount) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap">
                      {plan.completedTasksCount}/{plan.tasksCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[plan.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[plan.status]?.label || plan.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/maintenance/plans/${plan.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    {plan.status === "active" && (
                      <>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/maintenance/plans/${plan.id}/tasks`}>
                            <IconList className="h-4 w-4 mr-1" />
                            任务
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/maintenance/plans/${plan.id}/edit`}>
                            <IconEdit className="h-4 w-4 mr-1" />
                            编辑
                          </Link>
                        </Button>
                      </>
                    )}
                    {plan.status === "completed" && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/maintenance/plans/${plan.id}/renew`}>
                          <IconCalendarTime className="h-4 w-4 mr-1" />
                          续约
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
