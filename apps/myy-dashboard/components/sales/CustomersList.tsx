"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconEye, IconEdit, IconPhone, IconMail, IconMapPin, IconUserCircle } from "@tabler/icons-react";

// 客户类型标签颜色映射
const customerTypeColors = {
  company: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  individual: "bg-green-100 text-green-800 hover:bg-green-100",
  government: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

// 客户等级标签颜色映射
const customerLevelColors = {
  vip: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  regular: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  new: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

// 模拟客户数据
const customers = [
  {
    id: "cust1",
    name: "张三园林有限公司",
    type: "company",
    level: "vip",
    contact: "张经理",
    phone: "13900139001",
    email: "zhangsan@example.com",
    address: "江苏省南京市江宁区科学园",
    totalOrders: 12,
    totalSpent: 156000,
    lastOrderDate: "2025-03-28",
  },
  {
    id: "cust2",
    name: "李四景观设计工作室",
    type: "company",
    level: "regular",
    contact: "李设计",
    phone: "13900139002",
    email: "lisi@example.com",
    address: "浙江省杭州市西湖区文创园A5栋",
    totalOrders: 5,
    totalSpent: 68500,
    lastOrderDate: "2025-03-27",
  },
  {
    id: "cust3",
    name: "王五",
    type: "individual",
    level: "new",
    contact: "王五",
    phone: "13900139003",
    email: "wangwu@example.com",
    address: "上海市松江区泗泾镇高技路",
    totalOrders: 1,
    totalSpent: 3200,
    lastOrderDate: "2025-03-25",
  },
  {
    id: "cust4",
    name: "城市绿化管理处",
    type: "government",
    level: "vip",
    contact: "赵主任",
    phone: "13900139004",
    email: "citygreen@gov.example.com",
    address: "北京市海淀区中关村大街",
    totalOrders: 8,
    totalSpent: 230000,
    lastOrderDate: "2025-03-20",
  },
  {
    id: "cust5",
    name: "青山别墅区业主委员会",
    type: "company",
    level: "regular",
    contact: "孙主席",
    phone: "13900139005",
    email: "qingshan@example.com",
    address: "广东省广州市天河区员村",
    totalOrders: 3,
    totalSpent: 45000,
    lastOrderDate: "2025-03-15",
  },
];

// 客户类型文本映射
const customerTypeText = {
  company: "企业客户",
  individual: "个人客户",
  government: "政府单位",
};

// 客户等级文本映射
const customerLevelText = {
  vip: "VIP客户",
  regular: "普通客户",
  new: "新客户",
};

// 格式化金额
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CustomersList() {
  // 实际项目中可能需要分页、排序等功能
  const [sortBy, setSortBy] = useState("name");
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={customerTypeColors[customer.type as keyof typeof customerTypeColors]}
                  >
                    {customerTypeText[customer.type as keyof typeof customerTypeText]}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={customerLevelColors[customer.level as keyof typeof customerLevelColors]}
                  >
                    {customerLevelText[customer.level as keyof typeof customerLevelText]}
                  </Badge>
                </div>
              </div>
              <div className="text-5xl text-muted-foreground">
                <IconUserCircle />
              </div>
            </div>
            
            <div className="space-y-1 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.contact}: {customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{customer.address}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div>
                <div className="text-muted-foreground">总订单数</div>
                <div className="font-medium">{customer.totalOrders}个</div>
              </div>
              <div>
                <div className="text-muted-foreground">总消费</div>
                <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sales/customers/${customer.id}`}>
                  <IconEye className="h-4 w-4 mr-1" />
                  查看
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sales/customers/${customer.id}/edit`}>
                  <IconEdit className="h-4 w-4 mr-1" />
                  编辑
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
