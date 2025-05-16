"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/index";

// 模拟数据
const activities = [
  {
    id: 1,
    type: "order",
    title: "新订单创建",
    description: "客户 张三 创建了新订单 #ORD20250401",
    timestamp: new Date(2025, 3, 1, 10, 30),
    user: {
      name: "李四",
      avatar: "/placeholder-user.jpg",
      initials: "LS",
    },
  },
  {
    id: 2,
    type: "inventory",
    title: "苗木入库",
    description: "20棵红枫苗木已入库",
    timestamp: new Date(2025, 3, 1, 9, 15),
    user: {
      name: "王五",
      avatar: "/placeholder-user.jpg",
      initials: "WW",
    },
  },
  {
    id: 3,
    type: "maintenance",
    title: "养护任务完成",
    description: "完成了客户 ABC园林 的养护任务",
    timestamp: new Date(2025, 3, 1, 8, 45),
    user: {
      name: "赵六",
      avatar: "/placeholder-user.jpg",
      initials: "ZL",
    },
  },
  {
    id: 4,
    type: "finance",
    title: "收款记录",
    description: "收到客户 李七 的付款 ¥12,500",
    timestamp: new Date(2025, 3, 1, 8, 0),
    user: {
      name: "钱八",
      avatar: "/placeholder-user.jpg",
      initials: "QB",
    },
  },
  {
    id: 5,
    type: "diagnosis",
    title: "诊断工单创建",
    description: "客户 孙九 创建了植物病害诊断工单",
    timestamp: new Date(2025, 3, 1, 7, 30),
    user: {
      name: "周十",
      avatar: "/placeholder-user.jpg",
      initials: "ZS",
    },
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近活动</CardTitle>
        <CardDescription>系统中的最新操作记录</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(activity.timestamp)} · {activity.user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
