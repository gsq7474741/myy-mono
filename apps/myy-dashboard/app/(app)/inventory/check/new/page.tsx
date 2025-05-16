"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconSearch, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 模拟获取库存数据
async function getInventoryItems() {
  return [
    { id: "inv1", plantId: "p1", plantName: "红枫", species: "Acer palmatum", quantity: 25, unitValue: 1200, location: "A区-12号", lastChecked: "2025-02-15" },
    { id: "inv2", plantId: "p2", plantName: "银杏", species: "Ginkgo biloba", quantity: 18, unitValue: 2500, location: "B区-05号", lastChecked: "2025-02-15" },
    { id: "inv3", plantId: "p3", plantName: "紫薇", species: "Lagerstroemia indica", quantity: 32, unitValue: 800, location: "C区-08号", lastChecked: "2025-02-20" },
    { id: "inv4", plantId: "p4", plantName: "黄杨", species: "Buxus sinica", quantity: 45, unitValue: 500, location: "D区-15号", lastChecked: "2025-02-20" },
    { id: "inv5", plantId: "p5", plantName: "雪松", species: "Cedrus deodara", quantity: 12, unitValue: 3800, location: "A区-03号", lastChecked: "2025-02-25" },
  ];
}

// 模拟获取仓库区域列表
async function getWarehouseAreas() {
  return [
    { id: "area-a", name: "A区" },
    { id: "area-b", name: "B区" },
    { id: "area-c", name: "C区" },
    { id: "area-d", name: "D区" },
  ];
}

// 模拟创建盘点记录
async function createInventoryCheck(data: any) {
  console.log("创建盘点记录", data);
  // 实际项目中应调用API创建数据
  return { success: true };
}

export default function NewInventoryCheckPage() {
  const router = useRouter();
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [warehouseAreas, setWarehouseAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    areaId: "",
    searchTerm: "",
  });
  
  // 表单状态
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    notes: "",
    checkedBy: "",
    items: [] as {
      inventoryId: string;
      systemQuantity: number;
      actualQuantity: number;
      notes: string;
      status: "ok" | "surplus" | "shortage" | "pending";
    }[],
    selectedAll: false,
  });
  
  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [inventoryData, areasData] = await Promise.all([
          getInventoryItems(),
          getWarehouseAreas(),
        ]);
        
        setInventoryItems(inventoryData);
        setWarehouseAreas(areasData);
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
  
  // 处理筛选变更
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // 筛选库存项
  const filteredItems = inventoryItems.filter(item => {
    // 按区域筛选
    if (filters.areaId && !item.location.startsWith(filters.areaId.replace("area-", ""))) {
      return false;
    }
    
    // 按搜索词筛选
    if (filters.searchTerm && 
        !item.plantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !item.species.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !item.location.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // 添加库存项到盘点列表
  const handleAddItem = (inventoryId: string) => {
    const inventoryItem = inventoryItems.find(item => item.id === inventoryId);
    if (!inventoryItem) return;
    
    // 检查是否已经在盘点列表中
    if (formData.items.some(item => item.inventoryId === inventoryId)) return;
    
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          inventoryId,
          systemQuantity: inventoryItem.quantity,
          actualQuantity: inventoryItem.quantity, // 默认与系统数量相同
          notes: "",
          status: "pending"
        }
      ]
    }));
  };
  
  // 移除盘点项
  const handleRemoveItem = (inventoryId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.inventoryId !== inventoryId)
    }));
  };
  
  // 更新盘点项
  const handleItemChange = (inventoryId: string, field: string, value: string | number) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.inventoryId === inventoryId) {
          const updatedItem = { ...item, [field]: value };
          
          // 如果更新的是实际数量，自动计算状态
          if (field === "actualQuantity") {
            const actualQty = Number(value);
            const systemQty = updatedItem.systemQuantity;
            
            if (actualQty === systemQty) {
              updatedItem.status = "ok";
            } else if (actualQty > systemQty) {
              updatedItem.status = "surplus";
            } else {
              updatedItem.status = "shortage";
            }
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };
  
  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        // 添加所有筛选后的库存项到盘点列表
        const newItems = [...prev.items];
        
        filteredItems.forEach(inventoryItem => {
          // 如果已经在列表中，跳过
          if (newItems.some(item => item.inventoryId === inventoryItem.id)) return;
          
          newItems.push({
            inventoryId: inventoryItem.id,
            systemQuantity: inventoryItem.quantity,
            actualQuantity: inventoryItem.quantity,
            notes: "",
            status: "pending"
          });
        });
        
        return { ...prev, items: newItems, selectedAll: true };
      } else {
        // 从盘点列表中移除所有筛选后的库存项
        const filteredIds = new Set(filteredItems.map(item => item.id));
        return { 
          ...prev, 
          items: prev.items.filter(item => !filteredIds.has(item.inventoryId)),
          selectedAll: false
        };
      }
    });
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        // 转换为后端需要的格式
      };
      
      const result = await createInventoryCheck(submitData);
      
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
  
  // 获取盘点状态统计
  const getStatusCounts = () => {
    return {
      total: formData.items.length,
      ok: formData.items.filter(item => item.status === "ok").length,
      surplus: formData.items.filter(item => item.status === "surplus").length,
      shortage: formData.items.filter(item => item.status === "shortage").length,
      pending: formData.items.filter(item => item.status === "pending").length,
    };
  };
  
  // 状态映射
  const statusMap: Record<string, { label: string; className: string }> = {
    ok: { label: "正常", className: "bg-green-100 text-green-800" },
    surplus: { label: "盘盈", className: "bg-blue-100 text-blue-800" },
    shortage: { label: "盘亏", className: "bg-red-100 text-red-800" },
    pending: { label: "待盘点", className: "bg-gray-100 text-gray-800" },
  };
  
  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }
  
  const statusCounts = getStatusCounts();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/inventory">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回库存管理
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">库存盘点</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>盘点信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="checkDate" className="block text-sm font-medium">
                  盘点日期
                </label>
                <Input
                  id="checkDate"
                  name="checkDate"
                  type="date"
                  value={formData.checkDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="checkedBy" className="block text-sm font-medium">
                  盘点人员
                </label>
                <Input
                  id="checkedBy"
                  name="checkedBy"
                  value={formData.checkedBy}
                  onChange={handleChange}
                  placeholder="请输入盘点人员姓名"
                  required
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
                placeholder="可选，添加盘点相关说明"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>选择盘点苗木</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="areaId" className="block text-sm font-medium">
                  仓库区域
                </label>
                <Select
                  value={filters.areaId}
                  onValueChange={(value) => handleFilterChange("areaId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部区域" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部区域</SelectItem>
                    {warehouseAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="searchTerm" className="block text-sm font-medium">
                  搜索
                </label>
                <div className="relative">
                  <Input
                    id="searchTerm"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    placeholder="搜索苗木名称或位置"
                    className="pr-10"
                  />
                  <IconSearch className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  找到 {filteredItems.length} 个库存项
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selectAll" 
                    checked={formData.selectedAll}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium leading-none"
                  >
                    全选
                  </label>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      没有找到符合条件的库存项
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-2 text-xs font-medium">苗木名称</th>
                          <th className="text-center p-2 text-xs font-medium">数量</th>
                          <th className="text-center p-2 text-xs font-medium">位置</th>
                          <th className="text-right p-2 text-xs font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => {
                          const isSelected = formData.items.some(i => i.inventoryId === item.id);
                          
                          return (
                            <tr key={item.id} className="border-t">
                              <td className="p-2 text-sm">
                                <div className="font-medium">{item.plantName}</div>
                                <div className="text-xs text-muted-foreground">{item.species}</div>
                              </td>
                              <td className="p-2 text-sm text-center">{item.quantity}</td>
                              <td className="p-2 text-sm text-center">{item.location}</td>
                              <td className="p-2 text-sm text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => isSelected ? handleRemoveItem(item.id) : handleAddItem(item.id)}
                                >
                                  {isSelected ? "移除" : "添加"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>盘点明细</CardTitle>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline">
                    总计: {statusCounts.total}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    正常: {statusCounts.ok}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    盘盈: {statusCounts.surplus}
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    盘亏: {statusCounts.shortage}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800">
                    待盘点: {statusCounts.pending}
                  </Badge>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                // 重置所有实际数量为系统数量
                setFormData(prev => ({
                  ...prev,
                  items: prev.items.map(item => ({
                    ...item,
                    actualQuantity: item.systemQuantity,
                    status: "ok"
                  }))
                }));
              }}>
                <IconRefresh className="h-4 w-4 mr-1" />
                重置数量
              </Button>
            </CardHeader>
            <CardContent>
              {formData.items.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  暂无盘点明细，请从左侧选择需要盘点的苗木
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2 font-medium">苗木名称</th>
                          <th className="text-center p-2 font-medium">系统数量</th>
                          <th className="text-center p-2 font-medium">实际数量</th>
                          <th className="text-center p-2 font-medium">差异</th>
                          <th className="text-center p-2 font-medium">状态</th>
                          <th className="text-center p-2 font-medium">备注</th>
                          <th className="text-right p-2 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item) => {
                          const inventoryItem = inventoryItems.find(inv => inv.id === item.inventoryId);
                          if (!inventoryItem) return null;
                          
                          const diff = item.actualQuantity - item.systemQuantity;
                          
                          return (
                            <tr key={item.inventoryId} className="border-t">
                              <td className="p-2">
                                <div className="font-medium">{inventoryItem.plantName}</div>
                                <div className="text-xs text-muted-foreground">{inventoryItem.location}</div>
                              </td>
                              <td className="p-2 text-center">{item.systemQuantity}</td>
                              <td className="p-2 text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  value={item.actualQuantity}
                                  onChange={(e) => handleItemChange(
                                    item.inventoryId, 
                                    "actualQuantity", 
                                    parseInt(e.target.value)
                                  )}
                                  className="w-20 mx-auto text-center"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <span className={
                                  diff > 0 
                                    ? "text-blue-600" 
                                    : diff < 0 
                                      ? "text-red-600" 
                                      : ""
                                }>
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              </td>
                              <td className="p-2 text-center">
                                <Badge className={statusMap[item.status]?.className || "bg-gray-100"}>
                                  {statusMap[item.status]?.label || item.status}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <Input
                                  value={item.notes}
                                  onChange={(e) => handleItemChange(
                                    item.inventoryId, 
                                    "notes", 
                                    e.target.value
                                  )}
                                  placeholder="备注"
                                  className="w-full"
                                />
                              </td>
                              <td className="p-2 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.inventoryId)}
                                >
                                  移除
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/inventory">取消</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={saving || formData.items.length === 0}
          >
            {saving ? "提交中..." : "提交盘点结果"}
          </Button>
        </div>
      </form>
    </div>
  );
}
