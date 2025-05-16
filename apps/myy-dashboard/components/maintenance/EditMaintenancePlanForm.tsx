"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 模拟更新养护计划
async function updateMaintenancePlan(id: string, data: any) {
  console.log("更新养护计划", id, data);
  // 实际项目中应调用API更新数据库
  return { success: true };
}

// 类型定义
interface Plant {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  name: string;
}

interface MaintenancePlan {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  customer: {
    id: string;
    name: string;
    contact: string;
    phone: string;
    address: string;
  };
  status: string;
  description: string;
  frequency: string;
  notes: string;
  plants: Array<{
    id: string;
    name: string;
    quantity: number;
    location: string;
  }>;
  services: Array<{
    name: string;
    frequency: string;
  }>;
}

interface EditMaintenancePlanFormProps {
  plan: MaintenancePlan;
  customers: Customer[];
  plants: Plant[];
}

export default function EditMaintenancePlanForm({ plan, customers, plants }: EditMaintenancePlanFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: plan.name,
    type: plan.type,
    customerId: plan.customer.id,
    startDate: plan.startDate,
    endDate: plan.endDate,
    description: plan.description,
    frequency: plan.frequency,
    notes: plan.notes || "",
    selectedPlants: plan.plants.map((p) => ({
      plantId: p.id,
      quantity: p.quantity,
      location: p.location,
    })),
    services: plan.services,
  });
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
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
      
      const result = await updateMaintenancePlan(plan.id, submitData);
      
      if (result.success) {
        router.push(`/maintenance/plans/${plan.id}`);
      }
    } catch (error) {
      console.error("保存失败", error);
      // 处理错误
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/maintenance/plans/${plan.id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回计划详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">编辑养护计划</h1>
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
            <Link href={`/maintenance/plans/${plan.id}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存修改"}
          </Button>
        </div>
      </form>
    </div>
  );
}
