"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconTruck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/index";

// 模拟数据获取函数
async function getOrder(id: string) {
  // 实际项目中应从数据库获取
  const orders = [
    {
      id: "ord2",
      orderNumber: "ORD20250327002",
      customer: {
        id: "cust2",
        name: "李四景观设计工作室",
        contact: "李设计",
        phone: "13900139002",
        address: "浙江省杭州市西湖区文创园A5栋",
      },
      orderDate: "2025-03-27",
      deliveryDate: "2025-04-10",
      status: "confirmed",
      totalAmount: 28500,
      paidAmount: 14250,
      itemsCount: 5,
      notes: "需要提供种植指导",
      paymentTerms: "预付50%，交付后付清",
      deliveryMethod: "送货上门",
      items: [
        {
          id: "item4",
          plantId: "p4",
          plantName: "黄杨",
          species: "Buxus sinica",
          quantity: 20,
          unitPrice: 500,
          totalPrice: 10000,
          notes: "用于绿篱"
        },
        {
          id: "item5",
          plantId: "p5",
          plantName: "雪松",
          species: "Cedrus deodara",
          quantity: 2,
          unitPrice: 3800,
          totalPrice: 7600,
          notes: "主景树"
        },
        {
          id: "item6",
          plantId: "p6",
          plantName: "香樟",
          species: "Cinnamomum camphora",
          quantity: 1,
          unitPrice: 5500,
          totalPrice: 5500,
          notes: "胸径15cm以上"
        },
        {
          id: "item7",
          plantId: "p7",
          plantName: "桂花",
          species: "Osmanthus fragrans",
          quantity: 5,
          unitPrice: 800,
          totalPrice: 4000,
          notes: "冠幅1米以上"
        },
        {
          id: "item8",
          plantId: "p8",
          plantName: "月季",
          species: "Rosa chinensis",
          quantity: 35,
          unitPrice: 40,
          totalPrice: 1400,
          notes: "混合颜色"
        }
      ]
    }
  ];
  
  return orders.find(order => order.id === id) || null;
}

// 模拟获取物流公司列表
async function getLogisticsCompanies() {
  return [
    { id: "log1", name: "顺丰速运" },
    { id: "log2", name: "中通快递" },
    { id: "log3", name: "圆通速递" },
    { id: "log4", name: "申通快递" },
    { id: "log5", name: "韵达快递" },
    { id: "log6", name: "自有车辆" },
  ];
}

// 模拟创建发货记录
async function createShipment(data: any) {
  console.log("创建发货记录", data);
  // 实际项目中应调用API创建数据
  return { success: true };
}

export default function ShipOrderPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [logisticsCompanies, setLogisticsCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    shipmentDate: new Date().toISOString().split("T")[0],
    logisticsCompanyId: "",
    trackingNumber: "",
    deliveryContact: "",
    deliveryPhone: "",
    deliveryAddress: "",
    notes: "",
    items: [] as {
      itemId: string;
      plantName: string;
      quantity: number;
      shippedQuantity: number;
      isShipped: boolean;
    }[],
    sendEmail: true,
    sendSMS: false,
  });

  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [orderData, logisticsData] = await Promise.all([
          getOrder(params.id),
          getLogisticsCompanies(),
        ]);
        
        if (!orderData) {
          router.push("/sales");
          return;
        }
        
        if (orderData.status !== "confirmed") {
          // 只有已确认的订单才能发货
          router.push(`/sales/orders/${params.id}`);
          return;
        }
        
        setOrder(orderData);
        setLogisticsCompanies(logisticsData);
        
        // 填充表单数据
        setFormData(prev => ({
          ...prev,
          deliveryContact: orderData.customer.contact,
          deliveryPhone: orderData.customer.phone,
          deliveryAddress: orderData.customer.address,
          logisticsCompanyId: orderData.deliveryMethod === "送货上门" ? "log6" : "",
          items: orderData.items.map((item: any) => ({
            itemId: item.id,
            plantName: item.plantName,
            quantity: item.quantity,
            shippedQuantity: item.quantity, // 默认全部发货
            isShipped: true,
          })),
        }));
        
        setLoading(false);
      } catch (error) {
        console.error("加载数据失败", error);
        // 处理错误
      }
    }
    
    loadData();
  }, [params.id, router]);

  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理复选框变更
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // 更新发货项
  const handleItemChange = (itemId: string, field: string, value: boolean | number) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.itemId === itemId) {
          // 如果取消发货，将发货数量设为0
          if (field === "isShipped" && value === false) {
            return { ...item, [field]: value, shippedQuantity: 0 };
          }
          // 如果重新选中发货，将发货数量设为原始数量
          else if (field === "isShipped" && value === true) {
            return { ...item, [field]: value, shippedQuantity: item.quantity };
          }
          return { ...item, [field]: value };
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 检查是否有选中的发货项
      const hasShippedItems = formData.items.some(item => item.isShipped && item.shippedQuantity > 0);
      if (!hasShippedItems) {
        alert("请至少选择一个发货项目");
        setSaving(false);
        return;
      }
      
      // 构建提交数据
      const submitData = {
        orderId: params.id,
        ...formData,
        // 只包含选中的发货项
        items: formData.items.filter(item => item.isShipped && item.shippedQuantity > 0),
      };
      
      const result = await createShipment(submitData);
      
      if (result.success) {
        router.push(`/sales/orders/${params.id}`);
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
          <Link href={`/sales/orders/${params.id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回订单详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">订单发货</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
        <span className="text-muted-foreground">客户: {order.customer.name}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>发货信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="shipmentDate" className="block text-sm font-medium">
                  发货日期
                </label>
                <Input
                  id="shipmentDate"
                  name="shipmentDate"
                  type="date"
                  value={formData.shipmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="logisticsCompanyId" className="block text-sm font-medium">
                  物流公司
                </label>
                <Select
                  value={formData.logisticsCompanyId}
                  onValueChange={(value) => handleSelectChange("logisticsCompanyId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择物流公司" />
                  </SelectTrigger>
                  <SelectContent>
                    {logisticsCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="trackingNumber" className="block text-sm font-medium">
                  物流单号
                </label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  placeholder={formData.logisticsCompanyId === "log6" ? "自有车辆无需填写" : "请输入物流单号"}
                  disabled={formData.logisticsCompanyId === "log6"}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">收货信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="deliveryContact" className="block text-sm font-medium">
                    收货人
                  </label>
                  <Input
                    id="deliveryContact"
                    name="deliveryContact"
                    value={formData.deliveryContact}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="deliveryPhone" className="block text-sm font-medium">
                    联系电话
                  </label>
                  <Input
                    id="deliveryPhone"
                    name="deliveryPhone"
                    value={formData.deliveryPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium">
                  收货地址
                </label>
                <Textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={2}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium">
                发货备注
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="可选，添加发货相关说明"
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendEmail" 
                  checked={formData.sendEmail}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("sendEmail", checked as boolean)
                  }
                />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium leading-none"
                >
                  发送邮件通知客户
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendSMS" 
                  checked={formData.sendSMS}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("sendSMS", checked as boolean)
                  }
                />
                <label
                  htmlFor="sendSMS"
                  className="text-sm font-medium leading-none"
                >
                  发送短信通知客户
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>发货明细</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">选择</th>
                  <th className="text-left py-2 font-medium">苗木名称</th>
                  <th className="text-left py-2 font-medium">订单数量</th>
                  <th className="text-left py-2 font-medium">发货数量</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.itemId} className="border-b">
                    <td className="py-2">
                      <Checkbox 
                        checked={item.isShipped}
                        onCheckedChange={(checked) => 
                          handleItemChange(item.itemId, "isShipped", checked as boolean)
                        }
                      />
                    </td>
                    <td className="py-2">{item.plantName}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={item.shippedQuantity}
                        onChange={(e) => handleItemChange(
                          item.itemId, 
                          "shippedQuantity", 
                          parseInt(e.target.value)
                        )}
                        disabled={!item.isShipped}
                        className="w-20"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href={`/sales/orders/${params.id}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "提交中..." : "确认发货"}
          </Button>
        </div>
      </form>
    </div>
  );
}
