"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// 模拟获取植物列表
async function getPlants() {
  return [
    { id: "p1", name: "红枫", species: "Acer palmatum", category: "落叶乔木" },
    { id: "p2", name: "银杏", species: "Ginkgo biloba", category: "落叶乔木" },
    { id: "p3", name: "紫薇", species: "Lagerstroemia indica", category: "落叶灌木" },
    { id: "p4", name: "黄杨", species: "Buxus sinica", category: "常绿灌木" },
    { id: "p5", name: "雪松", species: "Cedrus deodara", category: "常绿乔木" },
  ];
}

// 模拟获取供应商列表
async function getSuppliers() {
  return [
    { id: "sup1", name: "江苏绿林苗圃" },
    { id: "sup2", name: "山东泰山苗木基地" },
    { id: "sup3", name: "浙江花卉基地" },
    { id: "sup4", name: "安徽绿色家园" },
    { id: "sup5", name: "广东热带植物基地" },
  ];
}

// 模拟获取仓库位置列表
async function getLocations() {
  return [
    { id: "loc1", name: "A区-01号" },
    { id: "loc2", name: "A区-02号" },
    { id: "loc3", name: "B区-01号" },
    { id: "loc4", name: "B区-02号" },
    { id: "loc5", name: "C区-01号" },
  ];
}

// 模拟创建入库记录
async function createInboundRecord(data: any) {
  console.log("创建入库记录", data);
  // 实际项目中应调用API创建数据
  return { success: true };
}

// 使用 SearchParams 的组件需要被 Suspense 包裹
function InboundPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlantId = searchParams.get("plantId");
  
  const [plants, setPlants] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    inboundType: "purchase", // purchase, return, transfer
    date: new Date().toISOString().split("T")[0],
    notes: "",
    items: [] as {
      plantId: string;
      quantity: number;
      unitPrice: number;
      locationId: string;
      batchNumber: string;
    }[],
    supplierId: "",
    purchaseOrderId: "",
    invoiceNumber: "",
  });
  
  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [plantsData, suppliersData, locationsData] = await Promise.all([
          getPlants(),
          getSuppliers(),
          getLocations(),
        ]);
        
        setPlants(plantsData);
        setSuppliers(suppliersData);
        setLocations(locationsData);
        
        // 如果URL中有plantId参数，添加该植物到入库项目中
        if (initialPlantId) {
          const plant = plantsData.find((p) => p.id === initialPlantId);
          if (plant) {
            setFormData(prev => ({
              ...prev,
              items: [
                ...prev.items,
                {
                  plantId: initialPlantId,
                  quantity: 1,
                  unitPrice: 0,
                  locationId: "",
                  batchNumber: `B-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
                }
              ]
            }));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("加载数据失败", error);
        // 处理错误
      }
    }
    
    loadData();
  }, [initialPlantId]);
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理入库类型变更
  const handleInboundTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, inboundType: value }));
  };
  
  // 添加入库项目
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          plantId: "",
          quantity: 1,
          unitPrice: 0,
          locationId: "",
          batchNumber: `B-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
        }
      ]
    }));
  };
  
  // 移除入库项目
  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // 更新入库项目
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };
  
  // 计算总金额
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        total: calculateTotal(),
        // 转换为后端需要的格式
      };
      
      const result = await createInboundRecord(submitData);
      
      if (result.success) {
        router.push("/inventory");
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
          <Link href="/inventory">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回库存管理
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">入库登记</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>入库信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                入库类型
              </label>
              <RadioGroup 
                value={formData.inboundType} 
                onValueChange={handleInboundTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purchase" id="purchase" />
                  <Label htmlFor="purchase">采购入库</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="return" id="return" />
                  <Label htmlFor="return">退货入库</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">调拨入库</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium">
                  入库日期
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="supplierId" className="block text-sm font-medium">
                  供应商
                </label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) => handleSelectChange("supplierId", value)}
                  disabled={formData.inboundType !== "purchase"}
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
              
              <div className="space-y-2">
                <label htmlFor="purchaseOrderId" className="block text-sm font-medium">
                  采购单号
                </label>
                <Input
                  id="purchaseOrderId"
                  name="purchaseOrderId"
                  value={formData.purchaseOrderId}
                  onChange={handleChange}
                  placeholder="可选"
                  disabled={formData.inboundType !== "purchase"}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="invoiceNumber" className="block text-sm font-medium">
                  发票号码
                </label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  placeholder="可选"
                  disabled={formData.inboundType !== "purchase"}
                />
              </div>
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
                placeholder="可选，添加入库相关说明"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>入库明细</CardTitle>
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <IconPlus className="h-4 w-4 mr-1" />
              添加苗木
            </Button>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                暂无入库明细，请点击"添加苗木"按钮添加
              </p>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                    <div className="col-span-3 space-y-2">
                      <label className="block text-sm font-medium">苗木名称</label>
                      <Select
                        value={item.plantId}
                        onValueChange={(value) => handleItemChange(index, "plantId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择苗木" />
                        </SelectTrigger>
                        <SelectContent>
                          {plants.map((plant) => (
                            <SelectItem key={plant.id} value={plant.id}>
                              {plant.name} ({plant.species})
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
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <label className="block text-sm font-medium">单价 (元)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <label className="block text-sm font-medium">批次号</label>
                      <Input
                        value={item.batchNumber}
                        onChange={(e) => handleItemChange(index, "batchNumber", e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-2 space-y-2">
                      <label className="block text-sm font-medium">存放位置</label>
                      <Select
                        value={item.locationId}
                        onValueChange={(value) => handleItemChange(index, "locationId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择位置" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <IconTrash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">总金额</div>
                    <div className="text-xl font-bold">
                      {calculateTotal().toFixed(2)} 元
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/inventory">取消</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={saving || formData.items.length === 0}
          >
            {saving ? "提交中..." : "确认入库"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// 导出主页面组件，使用Suspense包裹使用useSearchParams的组件
export default function NewInboundPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">加载中...</div>}>
      <InboundPageContent />
    </Suspense>
  );
}
