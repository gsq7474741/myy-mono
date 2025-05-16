"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 模拟获取客户列表
async function getCustomers() {
  return [
    { id: "cust1", name: "张三园林有限公司" },
    { id: "cust2", name: "李四景观设计工作室" },
    { id: "cust3", name: "王五绿化工程有限公司" },
    { id: "cust4", name: "赵六别墅花园" },
    { id: "cust5", name: "钱七物业管理有限公司" },
  ];
}

// 模拟获取苗木列表
async function getPlants() {
  return [
    { id: "p1", name: "红枫" },
    { id: "p2", name: "银杏" },
    { id: "p3", name: "樱花" },
    { id: "p4", name: "日本红枫" },
    { id: "p5", name: "紫薇" },
    { id: "p6", name: "香樟" },
    { id: "p7", name: "雪松" },
    { id: "p8", name: "桂花" },
  ];
}

// 模拟创建养护计划
async function createMaintenancePlan(data: any) {
  console.log("创建养护计划", data);
  // 实际项目中应调用API创建数据
  return { success: true, id: "new-plan-id" };
}

export default function CreateMaintenancePlanPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    type: "regular",
    customerId: "",
    startDate: "",
    endDate: "",
    description: "",
    frequency: "",
    notes: "",
    selectedPlants: [] as { plantId: string; quantity: number; location: string }[],
    services: [] as { name: string; frequency: string }[],
  });
  
  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [customersData, plantsData] = await Promise.all([
          getCustomers(),
          getPlants(),
        ]);
        
        setCustomers(customersData);
        setPlants(plantsData);
        
        // 设置默认日期
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(today.getMonth() + 4);
        
        // 格式化日期为YYYY-MM-DD
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        setFormData(prev => ({
          ...prev,
          startDate: formatDate(nextMonth),
          endDate: formatDate(threeMonthsLater),
        }));
        
        setLoading(false);
      } catch (error) {
        console.error("加载数据失败", error);
        // 处理错误
      }
    }
    
    loadData();
  }, []);
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理日期变更
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 添加苗木
  const handleAddPlant = () => {
    setFormData(prev => ({
      ...prev,
      selectedPlants: [...prev.selectedPlants, { plantId: "", quantity: 1, location: "" }],
    }));
  };
  
  // 移除苗木
  const handleRemovePlant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedPlants: prev.selectedPlants.filter((_, i) => i !== index),
    }));
  };
  
  // 更新苗木信息
  const handlePlantChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedPlants = [...prev.selectedPlants];
      updatedPlants[index] = { ...updatedPlants[index], [field]: value };
      return { ...prev, selectedPlants: updatedPlants };
    });
  };
  
  // 添加服务
  const handleAddService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: "", frequency: "" }],
    }));
  };
  
  // 移除服务
  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };
  
  // 更新服务信息
  const handleServiceChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return { ...prev, services: updatedServices };
    });
  };
  
  // 保存养护计划
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        // 转换为后端需要的格式
      };
      
      const result = await createMaintenancePlan(submitData);
      
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
          <Link href="/maintenance">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回养护服务
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">创建养护计划</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
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
                  placeholder="例如：2025年春季养护计划"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">
                  养护类型
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择养护类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">常规养护</SelectItem>
                    <SelectItem value="special">特殊养护</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="customerId" className="block text-sm font-medium">
                  客户
                </label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => handleSelectChange("customerId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="frequency" className="block text-sm font-medium">
                  养护频率
                </label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder="例如：每周两次"
                />
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
                placeholder="请简要描述养护计划的内容和目标"
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
                placeholder="可选，添加其他需要说明的事项"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>养护苗木</CardTitle>
            <Button type="button" variant="outline" onClick={handleAddPlant}>
              添加苗木
            </Button>
          </CardHeader>
          <CardContent>
            {formData.selectedPlants.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                暂无苗木，请点击"添加苗木"按钮添加
              </p>
            ) : (
              <div className="space-y-4">
                {formData.selectedPlants.map((plant, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                    <div className="col-span-4 space-y-2">
                      <label className="block text-sm font-medium">苗木名称</label>
                      <Select
                        value={plant.plantId}
                        onValueChange={(value) => handlePlantChange(index, "plantId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择苗木" />
                        </SelectTrigger>
                        <SelectContent>
                          {plants.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <label className="block text-sm font-medium">数量</label>
                      <Input
                        type="number"
                        min="1"
                        value={plant.quantity}
                        onChange={(e) => handlePlantChange(index, "quantity", parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-5 space-y-2">
                      <label className="block text-sm font-medium">位置</label>
                      <Input
                        value={plant.location}
                        onChange={(e) => handlePlantChange(index, "location", e.target.value)}
                        placeholder="例如：主园区北侧"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePlant(index)}
                      >
                        <IconTrash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>服务内容</CardTitle>
            <Button type="button" variant="outline" onClick={handleAddService}>
              添加服务
            </Button>
          </CardHeader>
          <CardContent>
            {formData.services.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                暂无服务，请点击"添加服务"按钮添加
              </p>
            ) : (
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                    <div className="col-span-5 space-y-2">
                      <label className="block text-sm font-medium">服务名称</label>
                      <Input
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                        placeholder="例如：修剪整形"
                      />
                    </div>
                    
                    <div className="col-span-6 space-y-2">
                      <label className="block text-sm font-medium">频率</label>
                      <Input
                        value={service.frequency}
                        onChange={(e) => handleServiceChange(index, "frequency", e.target.value)}
                        placeholder="例如：每月一次"
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveService(index)}
                      >
                        <IconTrash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/maintenance">取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "创建中..." : "创建计划"}
          </Button>
        </div>
      </form>
    </div>
  );
}
