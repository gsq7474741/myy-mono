"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconArrowLeft, IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as React from "react";

// 模拟数据获取函数
async function getMaintenancePlan(id: string) {
  // 实际项目中应从数据库获取
  const plans = [
    {
      id: "mp1",
      name: "2025年春季养护计划",
      type: "regular",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      customer: {
        id: "cust1",
        name: "张三园林有限公司",
        contact: "张经理",
        phone: "13800138001",
        address: "江苏省南京市江宁区紫金园林大道88号",
      },
      status: "completed",
      description: "常规春季养护，包括修剪、施肥、病虫害防治等",
      frequency: "每周两次",
      notes: "客户要求每次养护后提供详细报告",
      plants: [
        { id: "p1", name: "红枫", quantity: 12, location: "主园区北侧" },
        { id: "p2", name: "银杏", quantity: 8, location: "办公楼前" },
        { id: "p3", name: "樱花", quantity: 15, location: "园区东侧" },
      ],
      services: [
        { name: "修剪整形", frequency: "每月一次" },
        { name: "施肥", frequency: "每季度一次" },
        { name: "病虫害防治", frequency: "根据需要" },
        { name: "浇水", frequency: "每周两次" },
      ],
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
      frequency: "每周一次",
      notes: "特别注意防寒措施",
      plants: [
        { id: "p6", name: "香樟", quantity: 20, location: "小区入口" },
        { id: "p7", name: "雪松", quantity: 15, location: "中央广场" },
      ],
      services: [
        { name: "防寒覆盖", frequency: "季节开始一次" },
        { name: "检查保温设施", frequency: "每周一次" },
        { name: "浇水", frequency: "每两周一次" },
      ],
    },
  ];
  
  return plans.find(plan => plan.id === id) || null;
}

// 模拟创建养护计划
async function createRenewedPlan(data: any) {
  console.log("创建续约养护计划", data);
  // 实际项目中应调用API创建数据
  return { success: true, id: "new-plan-id" };
}

export default function RenewMaintenancePlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [originalPlan, setOriginalPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    notes: "",
    keepPlants: true,
    keepServices: true,
  });
  
  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const planData = await getMaintenancePlan(id);
        
        if (!planData) {
          router.push("/maintenance");
          return;
        }
        
        if (planData.status !== "completed") {
          // 只有已完成的计划才能续约
          router.push(`/maintenance/plans/${id}`);
          return;
        }
        
        setOriginalPlan(planData);
        
        // 计算默认的新计划开始和结束日期
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        const threeMonthsLater = new Date(nextMonth);
        threeMonthsLater.setMonth(nextMonth.getMonth() + 3);
        
        // 格式化日期为YYYY-MM-DD
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        // 填充表单数据
        setFormData({
          name: `${planData.name} (续约)`,
          startDate: formatDate(nextMonth),
          endDate: formatDate(threeMonthsLater),
          description: planData.description,
          notes: planData.notes || "",
          keepPlants: true,
          keepServices: true,
        });
        
        setLoading(false);
      } catch (error) {
        console.error("加载数据失败", error);
        // 处理错误
      }
    }
    
    loadData();
  }, [id, router]);
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理复选框变更
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // 保存续约计划
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        originalPlanId: id,
        customerId: originalPlan.customer.id,
        type: originalPlan.type,
        frequency: originalPlan.frequency,
        plants: formData.keepPlants ? originalPlan.plants : [],
        services: formData.keepServices ? originalPlan.services : [],
      };
      
      const result = await createRenewedPlan(submitData);
      
      if (result.success) {
        router.push(`/maintenance/plans/${result.id}`);
      }
    } catch (error) {
      console.error("保存失败", error);
      // 处理错误
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/maintenance/plans/${id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回计划详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">续约养护计划</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>原计划信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">计划名称</div>
            <div>{originalPlan.name}</div>
            
            <div className="text-muted-foreground">客户</div>
            <div>{originalPlan.customer.name}</div>
            
            <div className="text-muted-foreground">时间范围</div>
            <div>{originalPlan.startDate} 至 {originalPlan.endDate}</div>
            
            <div className="text-muted-foreground">养护类型</div>
            <div>{originalPlan.type === "regular" ? "常规养护" : "特殊养护"}</div>
            
            <div className="text-muted-foreground">养护频率</div>
            <div>{originalPlan.frequency}</div>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>新计划信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  计划名称
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm">客户:</div>
                <div className="font-medium">{originalPlan.customer.name}</div>
                <div className="text-xs text-muted-foreground">(续约将沿用原客户)</div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium">
                  开始日期
                </label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium">
                  结束日期
                </label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                计划描述
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium">
                备注
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="可选"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepPlants" 
                  checked={formData.keepPlants}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("keepPlants", checked as boolean)
                  }
                />
                <label
                  htmlFor="keepPlants"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  沿用原计划的养护苗木 ({originalPlan.plants.length}株)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepServices" 
                  checked={formData.keepServices}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("keepServices", checked as boolean)
                  }
                />
                <label
                  htmlFor="keepServices"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  沿用原计划的服务内容 ({originalPlan.services.length}项)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href={`/maintenance/plans/${id}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "创建中..." : "创建续约计划"}
          </Button>
        </div>
      </form>
    </div>
  );
}
