import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft, IconFileInvoice, IconTruck, IconPrinter } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils/index";
import Link from "next/link";

// 模拟数据获取函数
async function getOrder(id: string) {
  // 实际项目中应从数据库获取
  const orders = [
    {
      id: "ord1",
      orderNumber: "ORD20250328001",
      customer: {
        id: "cust1",
        name: "张三园林有限公司",
        contact: "张经理",
        phone: "13800138001",
        address: "江苏省南京市江宁区紫金园林大道88号",
      },
      orderDate: "2025-03-28",
      deliveryDate: "2025-04-05",
      status: "pending",
      totalAmount: 15600,
      paidAmount: 0,
      itemsCount: 3,
      notes: "请在交付前一天电话确认",
      createdBy: "王销售",
      paymentTerms: "货到付款",
      deliveryMethod: "自提",
      items: [
        {
          id: "item1",
          plantId: "p1",
          plantName: "红枫",
          species: "Acer palmatum",
          quantity: 5,
          unitPrice: 1200,
          totalPrice: 6000,
          notes: "高度1.5米以上"
        },
        {
          id: "item2",
          plantId: "p2",
          plantName: "银杏",
          species: "Ginkgo biloba",
          quantity: 3,
          unitPrice: 2500,
          totalPrice: 7500,
          notes: "五年生以上"
        },
        {
          id: "item3",
          plantId: "p3",
          plantName: "紫薇",
          species: "Lagerstroemia indica",
          quantity: 7,
          unitPrice: 300,
          totalPrice: 2100,
          notes: ""
        }
      ],
      timeline: [
        { date: "2025-03-28 09:15", action: "创建订单", user: "王销售" },
        { date: "2025-03-28 14:30", action: "客户确认", user: "系统" }
      ],
      payments: [],
      invoices: []
    },
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
      createdBy: "赵销售",
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
      timeline: [
        { date: "2025-03-27 10:20", action: "创建订单", user: "赵销售" },
        { date: "2025-03-27 16:45", action: "客户确认", user: "系统" },
        { date: "2025-03-28 09:30", action: "收到预付款 ¥14,250", user: "财务" },
        { date: "2025-03-28 10:15", action: "订单确认", user: "赵销售" }
      ],
      payments: [
        {
          id: "pay1",
          date: "2025-03-28",
          amount: 14250,
          method: "银行转账",
          reference: "PAY20250328001",
          notes: "预付款"
        }
      ],
      invoices: [
        {
          id: "inv1",
          date: "2025-03-28",
          amount: 14250,
          number: "INV20250328001",
          status: "issued",
          notes: "预付款发票"
        }
      ]
    }
  ];
  
  return orders.find(order => order.id === id) || null;
}

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "已确认", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "已发货", className: "bg-purple-100 text-purple-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
};

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">订单不存在</h2>
        <p className="mt-2 text-muted-foreground">找不到ID为 {params.id} 的订单</p>
        <Button asChild className="mt-4">
          <Link href="/sales">返回销售管理</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sales">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">订单详情</h1>
        <Badge className={statusMap[order.status]?.className || "bg-gray-100"}>
          {statusMap[order.status]?.label || order.status}
        </Badge>
      </div>
      
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
          <p className="text-muted-foreground">
            创建日期: {order.orderDate} | 创建人: {order.createdBy}
          </p>
        </div>
        <div className="flex gap-2">
          {order.status === "confirmed" && (
            <Button asChild>
              <Link href={`/sales/orders/${order.id}/ship`}>
                <IconTruck className="h-4 w-4 mr-1" />
                发货
              </Link>
            </Button>
          )}
          {(order.status === "shipped" || order.status === "completed") && 
            order.paidAmount < order.totalAmount && (
            <Button asChild>
              <Link href={`/sales/orders/${order.id}/invoice`}>
                <IconFileInvoice className="h-4 w-4 mr-1" />
                开票
              </Link>
            </Button>
          )}
          <Button variant="outline">
            <IconPrinter className="h-4 w-4 mr-1" />
            打印订单
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">客户名称</div>
              <div>
                <Link href={`/sales/customers/${order.customer.id}`} className="hover:underline text-primary">
                  {order.customer.name}
                </Link>
              </div>
              
              <div className="text-muted-foreground">联系人</div>
              <div>{order.customer.contact}</div>
              
              <div className="text-muted-foreground">联系电话</div>
              <div>{order.customer.phone}</div>
              
              <div className="text-muted-foreground">地址</div>
              <div className="truncate" title={order.customer.address}>
                {order.customer.address}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>订单信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">订单日期</div>
              <div>{order.orderDate}</div>
              
              <div className="text-muted-foreground">交付日期</div>
              <div>{order.deliveryDate}</div>
              
              <div className="text-muted-foreground">付款条件</div>
              <div>{order.paymentTerms}</div>
              
              <div className="text-muted-foreground">交付方式</div>
              <div>{order.deliveryMethod}</div>
              
              {order.notes && (
                <>
                  <div className="text-muted-foreground">备注</div>
                  <div>{order.notes}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>付款信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">订单总额</div>
              <div className="font-bold">{formatCurrency(order.totalAmount)}</div>
              
              <div className="text-muted-foreground">已付金额</div>
              <div>{formatCurrency(order.paidAmount)}</div>
              
              <div className="text-muted-foreground">未付金额</div>
              <div className="font-medium">{formatCurrency(order.totalAmount - order.paidAmount)}</div>
              
              <div className="text-muted-foreground">付款进度</div>
              <div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${Math.round((order.paidAmount / order.totalAmount) * 100)}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-right mt-1">
                  {Math.round((order.paidAmount / order.totalAmount) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>订单明细</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">苗木名称</th>
                <th className="text-left py-2 font-medium">规格</th>
                <th className="text-right py-2 font-medium">数量</th>
                <th className="text-right py-2 font-medium">单价</th>
                <th className="text-right py-2 font-medium">金额</th>
                <th className="text-left py-2 font-medium">备注</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <Link href={`/plants/${item.plantId}`} className="hover:underline text-primary">
                      {item.plantName}
                    </Link>
                  </td>
                  <td className="py-2">{item.species}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right">{formatCurrency(item.totalPrice)}</td>
                  <td className="py-2">{item.notes}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td colSpan={4} className="py-2 text-right">总计：</td>
                <td className="py-2 text-right">{formatCurrency(order.totalAmount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">订单时间线</TabsTrigger>
          <TabsTrigger value="payments">付款记录</TabsTrigger>
          <TabsTrigger value="invoices">发票记录</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>订单时间线</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 pl-6 ml-3 space-y-6">
                {order.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full border border-white bg-gray-200"></div>
                    <div className="mb-1 text-sm font-normal leading-none text-gray-500">
                      {event.date}
                    </div>
                    <div className="text-base font-semibold">{event.action}</div>
                    <div className="text-sm text-muted-foreground">操作人: {event.user}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>付款记录</CardTitle>
            </CardHeader>
            <CardContent>
              {order.payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无付款记录</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">日期</th>
                      <th className="text-left py-2 font-medium">金额</th>
                      <th className="text-left py-2 font-medium">付款方式</th>
                      <th className="text-left py-2 font-medium">参考号</th>
                      <th className="text-left py-2 font-medium">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="py-2">{payment.date}</td>
                        <td className="py-2">{formatCurrency(payment.amount)}</td>
                        <td className="py-2">{payment.method}</td>
                        <td className="py-2">{payment.reference}</td>
                        <td className="py-2">{payment.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>发票记录</CardTitle>
            </CardHeader>
            <CardContent>
              {order.invoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无发票记录</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">日期</th>
                      <th className="text-left py-2 font-medium">发票号</th>
                      <th className="text-left py-2 font-medium">金额</th>
                      <th className="text-left py-2 font-medium">状态</th>
                      <th className="text-left py-2 font-medium">备注</th>
                      <th className="text-right py-2 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="py-2">{invoice.date}</td>
                        <td className="py-2">{invoice.number}</td>
                        <td className="py-2">{formatCurrency(invoice.amount)}</td>
                        <td className="py-2">
                          <Badge className={
                            invoice.status === "issued" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }>
                            {invoice.status === "issued" ? "已开具" : "草稿"}
                          </Badge>
                        </td>
                        <td className="py-2">{invoice.notes}</td>
                        <td className="py-2 text-right">
                          <Button size="sm" variant="ghost">
                            <IconPrinter className="h-4 w-4 mr-1" />
                            打印
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
