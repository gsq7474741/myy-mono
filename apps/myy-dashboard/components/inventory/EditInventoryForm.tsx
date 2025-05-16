"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 模拟更新库存项
async function updateInventoryItem(id: string, data: any) {
  console.log("更新库存项", id, data);
  // 实际项目中应调用API更新数据库
  return { success: true };
}

interface Supplier {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  plantId: string;
  plantName: string;
  species: string;
  quantity: number;
  location: string;
  unitValue: number;
  categoryName: string;
  lastUpdated: string;
  description: string;
  supplier: {
    id: string;
    name: string;
  };
  minStock: number;
  maxStock: number;
}

interface EditInventoryFormProps {
  item: InventoryItem;
  suppliers: Supplier[];
}

export default function EditInventoryForm({ item, suppliers }: EditInventoryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    location: item.location,
    unitValue: item.unitValue,
    minStock: item.minStock,
    maxStock: item.maxStock,
    description: item.description,
    supplierId: item.supplier.id,
  });
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 对于数字类型的字段，转换为数字
    if (["unitValue", "minStock", "maxStock"].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 保存库存项
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        // 转换为后端需要的格式
      };
      
      const result = await updateInventoryItem(item.id, submitData);
      
      if (result.success) {
        router.push(`/inventory/${item.id}`);
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
          <Link href={`/inventory/${item.id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回库存详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">编辑库存信息</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{item.plantName}</h2>
        <span className="text-muted-foreground">{item.species}</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">当前库存: {item.quantity}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">
                  库存位置
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="例如：A区-12号"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="unitValue" className="block text-sm font-medium">
                  单价 (元)
                </label>
                <Input
                  id="unitValue"
                  name="unitValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitValue}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="minStock" className="block text-sm font-medium">
                  最低库存
                </label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  低于此数量将触发库存不足警告
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxStock" className="block text-sm font-medium">
                  最高库存
                </label>
                <Input
                  id="maxStock"
                  name="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  超过此数量将触发库存过量警告
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="supplierId" className="block text-sm font-medium">
                  主要供应商
                </label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) => handleSelectChange("supplierId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择供应商" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                苗木描述
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="请描述苗木的特征、规格等信息"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href={`/inventory/${item.id}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存修改"}
          </Button>
        </div>
      </form>
    </div>
  );
}
