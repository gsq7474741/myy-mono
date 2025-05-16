"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconReceipt } from "@tabler/icons-react";
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
        taxInfo: {
          taxNumber: "91330106MA2B0N7X3R",
          bankName: "中国工商银行杭州西湖支行",
          bankAccount: "1202020119900001234"
        }
      },
      orderDate: "2025-03-27",
      deliveryDate: "2025-04-10",
      status: "shipped",
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
      ],
      shipments: [
        {
          id: "ship1",
          shipmentDate: "2025-04-01",
          status: "delivered",
          items: [
            { itemId: "item4", quantity: 20 },
            { itemId: "item5", quantity: 2 },
            { itemId: "item6", quantity: 1 },
            { itemId: "item7", quantity: 5 },
            { itemId: "item8", quantity: 35 }
          ]
        }
      ],
      invoices: []
    }
  ];
  
  return orders.find(order => order.id === id) || null;
}

// 模拟发票类型
const invoiceTypes = [
  { id: "vat", name: "增值税专用发票" },
  { id: "ordinary", name: "增值税普通发票" },
  { id: "electronic", name: "电子发票" },
  { id: "receipt", name: "收据" }
];

// 模拟创建发票记录
async function createInvoice(data: any) {
  console.log("创建发票记录", data);
  // 实际项目中应调用API创建数据
  return { success: true, invoiceId: "inv" + Date.now() };
}

export default function InvoiceOrderPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split("T")[0],
    invoiceType: "ordinary",
    invoiceTitle: "",
    taxNumber: "",
    bankName: "",
    bankAccount: "",
    address: "",
    phone: "",
    amount: 0,
    notes: "",
    items: [] as {
      itemId: string;
      plantName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      isIncluded: boolean;
    }[],
    sendEmail: true,
  });

  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const orderData = await getOrder(params.id);
        
        if (!orderData) {
          router.push("/sales");
          return;
        }
        
        if (orderData.status !== "shipped" && orderData.status !== "delivered") {
          // 只有已发货或已交付的订单才能开票
          router.push(`/sales/orders/${params.id}`);
          return;
        }
        
        setOrder(orderData);
        
        // 计算可开票金额
        const invoicedAmount = orderData.invoices.reduce((total: number, invoice: any) => total + invoice.amount, 0);
        const remainingAmount = orderData.totalAmount - invoicedAmount;
        
        // 填充表单数据
        setFormData(prev => ({
          ...prev,
          invoiceTitle: orderData.customer.name,
          taxNumber: orderData.customer.taxInfo?.taxNumber || "",
          bankName: orderData.customer.taxInfo?.bankName || "",
          bankAccount: orderData.customer.taxInfo?.bankAccount || "",
          address: orderData.customer.address || "",
          phone: orderData.customer.phone || "",
          amount: remainingAmount,
          items: orderData.items.map((item: any) => ({
            itemId: item.id,
            plantName: item.plantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            isIncluded: true,
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

  // 更新发票项
  const handleItemChange = (itemId: string, isIncluded: boolean) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.itemId === itemId) {
          return { ...item, isIncluded };
        }
        return item;
      });
      
      // 重新计算总金额
      const newAmount = updatedItems
        .filter(item => item.isIncluded)
        .reduce((total, item) => total + item.totalPrice, 0);
      
      return { 
        ...prev, 
        items: updatedItems,
        amount: newAmount
      };
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 检查是否有选中的发票项
      const hasInvoiceItems = formData.items.some(item => item.isIncluded);
      if (!hasInvoiceItems) {
        alert("请至少选择一个发票项目");
        setSaving(false);
        return;
      }
      
      // 构建提交数据
      const submitData = {
        orderId: params.id,
        ...formData,
        // 只包含选中的发票项
        items: formData.items.filter(item => item.isIncluded),
      };
      
      const result = await createInvoice(submitData);
      
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
        <h1 className="text-3xl font-bold">开具发票</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
        <span className="text-muted-foreground">客户: {order.customer.name}</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>发票信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="invoiceDate" className="block text-sm font-medium">
                  开票日期
                </label>
                <Input
                  id="invoiceDate"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="invoiceType" className="block text-sm font-medium">
                  发票类型
                </label>
                <Select
                  value={formData.invoiceType}
                  onValueChange={(value) => handleSelectChange("invoiceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择发票类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">发票抬头信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="invoiceTitle" className="block text-sm font-medium">
                    发票抬头
                  </label>
                  <Input
                    id="invoiceTitle"
                    name="invoiceTitle"
                    value={formData.invoiceTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="taxNumber" className="block text-sm font-medium">
                    税号
                  </label>
                  <Input
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    required={formData.invoiceType === "vat"}
                    placeholder={formData.invoiceType === "vat" ? "必填" : "选填"}
                  />
                </div>
              </div>
              
              {formData.invoiceType === "vat" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="bankName" className="block text-sm font-medium">
                        开户行
                      </label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bankAccount" className="block text-sm font-medium">
                        银行账号
                      </label>
                      <Input
                        id="bankAccount"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium">
                    地址
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required={formData.invoiceType === "vat"}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    电话
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={formData.invoiceType === "vat"}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="amount" className="block text-sm font-medium">
                  开票金额
                </label>
                <span className="text-sm text-muted-foreground">
                  订单总额: {formatCurrency(order.totalAmount)}
                </span>
              </div>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                max={order.totalAmount}
                value={formData.amount}
                onChange={handleChange}
                required
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
                placeholder="可选，添加发票相关说明"
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
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>发票明细</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">选择</th>
                  <th className="text-left py-2 font-medium">苗木名称</th>
                  <th className="text-left py-2 font-medium">数量</th>
                  <th className="text-left py-2 font-medium">单价</th>
                  <th className="text-left py-2 font-medium">金额</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.itemId} className="border-b">
                    <td className="py-2">
                      <Checkbox 
                        checked={item.isIncluded}
                        onCheckedChange={(checked) => 
                          handleItemChange(item.itemId, checked as boolean)
                        }
                      />
                    </td>
                    <td className="py-2">{item.plantName}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right py-2 font-medium">
                    合计:
                  </td>
                  <td className="py-2 font-medium">
                    {formatCurrency(
                      formData.items
                        .filter(item => item.isIncluded)
                        .reduce((total, item) => total + item.totalPrice, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href={`/sales/orders/${params.id}`}>取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "提交中..." : "确认开票"}
          </Button>
        </div>
      </form>
    </div>
  );
}
