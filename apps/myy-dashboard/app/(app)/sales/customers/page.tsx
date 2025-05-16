import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconSearch, IconFilter, IconUserCircle } from "@tabler/icons-react";
import { CustomersList } from "@/components/sales/CustomersList";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">客户管理</h1>
        <Button asChild>
          <Link href="/sales/customers/new">
            <IconPlus className="h-4 w-4 mr-2" />
            新增客户
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>客户筛选</CardTitle>
          <CardDescription>
            搜索和筛选客户信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索客户名称、联系人..."
                className="pl-8"
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="客户类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="company">企业客户</SelectItem>
                <SelectItem value="individual">个人客户</SelectItem>
                <SelectItem value="government">政府单位</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="客户等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部等级</SelectItem>
                <SelectItem value="vip">VIP客户</SelectItem>
                <SelectItem value="regular">普通客户</SelectItem>
                <SelectItem value="new">新客户</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <CustomersList />
    </div>
  );
}
