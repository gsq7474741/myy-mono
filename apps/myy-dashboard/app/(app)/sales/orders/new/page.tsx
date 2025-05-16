"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/index";

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

// 模拟获取植物列表
async function getPlants() {
  return [
    { id: "p1", name: "红枫", species: "Acer palmatum", unitPrice: 1200, category: "落叶乔木" },
    { id: "p2", name: "银杏", species: "Ginkgo biloba", unitPrice: 2500, category: "落叶乔木" },
    { id: "p3", name: "紫薇", species: "Lagerstroemia indica", unitPrice: 300, category: "落叶灌木" },
    { id: "p4", name: "黄杨", species: "Buxus sinica", unitPrice: 500, category: "常绿灌木" },
    { id: "p5", name: "雪松", species: "Cedrus deodara", unitPrice: 3800, category: "常绿乔木" },
    { id: "p6", name: "香樟", species: "Cinnamomum camphora", unitPrice: 5500, category: "常绿乔木" },
    { id: "p7", name: "桂花", species: "Osmanthus fragrans", unitPrice: 800, category: "常绿灌木" },
    { id: "p8", name: "月季", species: "Rosa chinensis", unitPrice: 40, category: "花卉" },
  ];
}

// 模拟创建订单
async function createOrder(data: any) {
  console.log("创建订单", data);
  // 实际项目中应调用API创建数据
  return { success: true, id: "new-order-id" };
}

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    customerId: "",
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    paymentTerms: "货到付款",
    deliveryMethod: "自提",
    notes: "",
    items: [] as {
      plantId: string;
      quantity: number;
      unitPrice: number;
      notes: string;
    }[],
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
        
        // 设置默认交付日期（当前日期+7天）
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        
        setFormData(prev => ({
          ...prev,
          deliveryDate: deliveryDate.toISOString().split("T")[0],
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
  
  // 添加订单项
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          plantId: "",
          quantity: 1,
          unitPrice: 0,
          notes: "",
        }
      ]
    }));
  };
  
  // 移除订单项
  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // 更新订单项
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      
      // 如果是选择了植物，自动填充单价
      if (field === "plantId" && typeof value === "string") {
        const selectedPlant = plants.find(plant => plant.id === value);
        if (selectedPlant) {
          updatedItems[index] = { 
            ...updatedItems[index], 
            [field]: value,
            unitPrice: selectedPlant.unitPrice
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
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        totalAmount: calculateTotal(),
        // 转换为后端需要的格式
      };
      
      const result = await createOrder(submitData);
      
      if (result.success) {
        router.push(`/sales/orders/${result.id}`);
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
          <Link href="/sales">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回销售管理
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">创建订单</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="orderDate" className="block text-sm font-medium">
                  订单日期
                </label>
                <Input
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="deliveryDate" className="block text-sm font-medium">
                  交付日期
                </label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentTerms" className="block text-sm font-medium">
                  付款条件
                </label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => handleSelectChange("paymentTerms", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择付款条件" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="货到付款">货到付款</SelectItem>
                    <SelectItem value="预付全款">预付全款</SelectItem>
                    <SelectItem value="预付50%，交付后付清">预付50%，交付后付清</SelectItem>
                    <SelectItem value="月结30天">月结30天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="deliveryMethod" className="block text-sm font-medium">
                  交付方式
                </label>
                <Select
                  value={formData.deliveryMethod}
                  onValueChange={(value) => handleSelectChange("deliveryMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择交付方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="自提">自提</SelectItem>
                    <SelectItem value="送货上门">送货上门</SelectItem>
                    <SelectItem value="物流配送">物流配送</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="可选，添加订单相关说明"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>订单明细</CardTitle>
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <IconPlus className="h-4 w-4 mr-1" />
              添加苗木
            </Button>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                暂无订单明细，请点击"添加苗木"按钮添加
              </p>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, index) => {
                  const selectedPlant = plants.find(plant => plant.id === item.plantId);
                  
                  return (
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
                        <label className="block text-sm font-medium">金额</label>
                        <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <label className="block text-sm font-medium">备注</label>
                        <Input
                          value={item.notes}
                          onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                          placeholder="可选"
                        />
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
                
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">总金额</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(calculateTotal())}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/sales">取消</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={saving || formData.items.length === 0 || !formData.customerId}
          >
            {saving ? "创建中..." : "创建订单"}
          </Button>
        </div>
      </form>
    </div>
  );
}
