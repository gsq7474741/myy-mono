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

// 模拟获取库存数据
async function getInventoryItems() {
  return [
    { id: "inv1", plantId: "p1", plantName: "红枫", species: "Acer palmatum", quantity: 25, unitValue: 1200, location: "A区-12号" },
    { id: "inv2", plantId: "p2", plantName: "银杏", species: "Ginkgo biloba", quantity: 18, unitValue: 2500, location: "B区-05号" },
    { id: "inv3", plantId: "p3", plantName: "紫薇", species: "Lagerstroemia indica", quantity: 32, unitValue: 800, location: "C区-08号" },
    { id: "inv4", plantId: "p4", plantName: "黄杨", species: "Buxus sinica", quantity: 45, unitValue: 500, location: "D区-15号" },
    { id: "inv5", plantId: "p5", plantName: "雪松", species: "Cedrus deodara", quantity: 12, unitValue: 3800, location: "A区-03号" },
  ];
}

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

// 模拟创建出库记录
async function createOutboundRecord(data: any) {
  console.log("创建出库记录", data);
  // 实际项目中应调用API创建数据
  return { success: true };
}

// 使用 SearchParams 的组件需要被 Suspense 包裹
function OutboundPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlantId = searchParams.get("plantId");
  
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    outboundType: "sale", // sale, loss, transfer
    date: new Date().toISOString().split("T")[0],
    notes: "",
    items: [] as {
      inventoryId: string;
      quantity: number;
      unitPrice: number;
    }[],
    customerId: "",
    salesOrderId: "",
    deliveryAddress: "",
    contactPerson: "",
    contactPhone: "",
  });
  
  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [inventoryData, customersData] = await Promise.all([
          getInventoryItems(),
          getCustomers(),
        ]);
        
        setInventoryItems(inventoryData);
        setCustomers(customersData);
        
        // 如果URL中有plantId参数，添加该植物到出库项目中
        if (initialPlantId) {
          const inventoryItem = inventoryData.find((item) => item.plantId === initialPlantId);
          if (inventoryItem) {
            setFormData(prev => ({
              ...prev,
              items: [
                ...prev.items,
                {
                  inventoryId: inventoryItem.id,
                  quantity: 1,
                  unitPrice: inventoryItem.unitValue,
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
  
  // 处理出库类型变更
  const handleOutboundTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, outboundType: value }));
  };
  
  // 添加出库项目
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          inventoryId: "",
          quantity: 1,
          unitPrice: 0,
        }
      ]
    }));
  };
  
  // 移除出库项目
  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // 更新出库项目
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      
      // 如果是选择了库存项，自动填充单价
      if (field === "inventoryId" && typeof value === "string") {
        const selectedItem = inventoryItems.find(item => item.id === value);
        if (selectedItem) {
          updatedItems[index] = { 
            ...updatedItems[index], 
            [field]: value,
            unitPrice: formData.outboundType === "sale" ? selectedItem.unitValue : 0
          };
          return { ...prev, items: updatedItems };
        }
      }
      
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
  
  // 检查库存是否足够
  const checkInventory = (inventoryId: string, requestedQuantity: number) => {
    const inventoryItem = inventoryItems.find(item => item.id === inventoryId);
    if (!inventoryItem) return false;
    return inventoryItem.quantity >= requestedQuantity;
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查所有出库项的库存是否足够
    const inventoryCheck = formData.items.every(item => 
      checkInventory(item.inventoryId, item.quantity)
    );
    
    if (!inventoryCheck) {
      alert("部分苗木库存不足，请检查出库数量！");
      return;
    }
    
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        total: calculateTotal(),
        // 转换为后端需要的格式
      };
      
      const result = await createOutboundRecord(submitData);
      
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
        <h1 className="text-3xl font-bold">出库登记</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>出库信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                出库类型
              </label>
              <RadioGroup 
                value={formData.outboundType} 
                onValueChange={handleOutboundTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sale" id="sale" />
                  <Label htmlFor="sale">销售出库</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loss" id="loss" />
                  <Label htmlFor="loss">损耗出库</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">调拨出库</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium">
                  出库日期
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
              
              {formData.outboundType === "sale" && (
                <>
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
                    <label htmlFor="salesOrderId" className="block text-sm font-medium">
                      销售单号
                    </label>
                    <Input
                      id="salesOrderId"
                      name="salesOrderId"
                      value={formData.salesOrderId}
                      onChange={handleChange}
                      placeholder="可选"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium">
                      送货地址
                    </label>
                    <Input
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      placeholder="可选"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactPerson" className="block text-sm font-medium">
                      联系人
                    </label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="可选"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactPhone" className="block text-sm font-medium">
                      联系电话
                    </label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="可选"
                    />
                  </div>
                </>
              )}
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
                placeholder="可选，添加出库相关说明"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>出库明细</CardTitle>
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <IconPlus className="h-4 w-4 mr-1" />
              添加苗木
            </Button>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                暂无出库明细，请点击"添加苗木"按钮添加
              </p>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, index) => {
                  const inventoryItem = inventoryItems.find(inv => inv.id === item.inventoryId);
                  const hasEnoughStock = inventoryItem ? inventoryItem.quantity >= item.quantity : false;
                  
                  return (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                      <div className="col-span-4 space-y-2">
                        <label className="block text-sm font-medium">苗木名称</label>
                        <Select
                          value={item.inventoryId}
                          onValueChange={(value) => handleItemChange(index, "inventoryId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择苗木" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventoryItems.map((invItem) => (
                              <SelectItem key={invItem.id} value={invItem.id}>
                                {invItem.plantName} ({invItem.location}) - 库存: {invItem.quantity}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <label className="block text-sm font-medium">数量</label>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            min="1"
                            max={inventoryItem?.quantity || 1}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                            className={!hasEnoughStock ? "border-red-500" : ""}
                          />
                          {!hasEnoughStock && inventoryItem && (
                            <p className="text-xs text-red-500">
                              库存不足 (当前库存: {inventoryItem.quantity})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {formData.outboundType === "sale" && (
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
                      )}
                      
                      <div className={`col-span-${formData.outboundType === "sale" ? 3 : 5} space-y-2`}>
                        {inventoryItem && (
                          <div className="text-sm text-muted-foreground">
                            <div>规格: {inventoryItem.species}</div>
                            <div>位置: {inventoryItem.location}</div>
                          </div>
                        )}
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
                  );
                })}
                
                {formData.outboundType === "sale" && (
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">总金额</div>
                      <div className="text-xl font-bold">
                        {calculateTotal().toFixed(2)} 元
                      </div>
                    </div>
                  </div>
                )}
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
            {saving ? "提交中..." : "确认出库"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// 导出主页面组件，使用Suspense包裹使用useSearchParams的组件
export default function NewOutboundPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">加载中...</div>}>
      <OutboundPageContent />
    </Suspense>
  );
}
