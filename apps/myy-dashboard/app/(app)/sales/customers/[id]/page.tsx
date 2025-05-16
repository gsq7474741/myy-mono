import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  IconArrowLeft, 
  IconEdit, 
  IconPhone, 
  IconMail, 
  IconMapPin, 
  IconUserCircle,
  IconBuilding,
  IconCalendarEvent,
  IconCash,
  IconFileInvoice,
  IconTruck,
  IconPlant,
  IconEye
} from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils/index";

// 客户类型标签颜色映射
const customerTypeColors = {
  company: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  individual: "bg-green-100 text-green-800 hover:bg-green-100",
  government: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

// 客户等级标签颜色映射
const customerLevelColors = {
  vip: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  regular: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  new: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

// 客户类型文本映射
const customerTypeText = {
  company: "企业客户",
  individual: "个人客户",
  government: "政府单位",
};

// 客户等级文本映射
const customerLevelText = {
  vip: "VIP客户",
  regular: "普通客户",
  new: "新客户",
};

// 模拟获取客户数据
async function getCustomer(id: string) {
  // 实际项目中应从数据库获取
  const customers = [
    {
      id: "cust1",
      name: "张三园林有限公司",
      type: "company",
      level: "vip",
      contact: "张经理",
      phone: "13900139001",
      email: "zhangsan@example.com",
      address: "江苏省南京市江宁区科学园",
      totalOrders: 12,
      totalSpent: 156000,
      lastOrderDate: "2025-03-28",
      createdAt: "2023-05-15",
      taxInfo: {
        taxNumber: "91320115MA1YWDXN2J",
        bankName: "中国银行南京分行",
        bankAccount: "6217001234567890123"
      },
      notes: "大型园林工程客户，对红枫和樱花有特殊需求",
      contacts: [
        {
          name: "张经理",
          position: "采购经理",
          phone: "13900139001",
          email: "zhangsan@example.com",
          isPrimary: true
        },
        {
          name: "李财务",
          position: "财务主管",
          phone: "13900139011",
          email: "licaiwu@example.com",
          isPrimary: false
        }
      ],
      orders: [
        {
          id: "ord1",
          orderNumber: "ORD20250328001",
          orderDate: "2025-03-28",
          status: "pending",
          totalAmount: 15600,
          paidAmount: 0,
        },
        {
          id: "ord3",
          orderNumber: "ORD20250315003",
          orderDate: "2025-03-15",
          status: "completed",
          totalAmount: 23500,
          paidAmount: 23500,
        },
        {
          id: "ord5",
          orderNumber: "ORD20250301005",
          orderDate: "2025-03-01",
          status: "completed",
          totalAmount: 18700,
          paidAmount: 18700,
        }
      ],
      maintenancePlans: [
        {
          id: "plan1",
          planNumber: "MP20240601001",
          startDate: "2024-06-01",
          endDate: "2025-05-31",
          status: "active",
          totalValue: 24000,
        },
        {
          id: "plan2",
          planNumber: "MP20230601001",
          startDate: "2023-06-01",
          endDate: "2024-05-31",
          status: "completed",
          totalValue: 22000,
        }
      ]
    },
    {
      id: "cust2",
      name: "李四景观设计工作室",
      type: "company",
      level: "regular",
      contact: "李设计",
      phone: "13900139002",
      email: "lisi@example.com",
      address: "浙江省杭州市西湖区文创园A5栋",
      totalOrders: 5,
      totalSpent: 68500,
      lastOrderDate: "2025-03-27",
      createdAt: "2024-01-10",
      taxInfo: {
        taxNumber: "91330106MA2B0N7X3R",
        bankName: "中国工商银行杭州西湖支行",
        bankAccount: "1202020119900001234"
      },
      notes: "景观设计师，经常采购特色植物样品",
      contacts: [
        {
          name: "李设计",
          position: "创始人",
          phone: "13900139002",
          email: "lisi@example.com",
          isPrimary: true
        }
      ],
      orders: [
        {
          id: "ord2",
          orderNumber: "ORD20250327002",
          orderDate: "2025-03-27",
          status: "confirmed",
          totalAmount: 28500,
          paidAmount: 14250,
        },
        {
          id: "ord6",
          orderNumber: "ORD20250220006",
          orderDate: "2025-02-20",
          status: "completed",
          totalAmount: 12000,
          paidAmount: 12000,
        }
      ],
      maintenancePlans: []
    }
  ];
  
  return customers.find(customer => customer.id === id) || null;
}

export default async function CustomerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customer = await getCustomer(params.id);

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">客户不存在</h2>
        <p className="mt-2">未找到ID为 {params.id} 的客户记录</p>
        <Button className="mt-4" asChild>
          <Link href="/sales/customers">返回客户列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sales/customers">
              <IconArrowLeft className="h-4 w-4 mr-1" />
              返回客户列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <div className="flex gap-2 ml-2">
            <Badge 
              variant="secondary" 
              className={customerTypeColors[customer.type as keyof typeof customerTypeColors]}
            >
              {customerTypeText[customer.type as keyof typeof customerTypeText]}
            </Badge>
            <Badge 
              variant="secondary"
              className={customerLevelColors[customer.level as keyof typeof customerLevelColors]}
            >
              {customerLevelText[customer.level as keyof typeof customerLevelText]}
            </Badge>
          </div>
        </div>
        
        <Button asChild>
          <Link href={`/sales/customers/${params.id}/edit`}>
            <IconEdit className="h-4 w-4 mr-2" />
            编辑客户
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="text-8xl text-muted-foreground">
                <IconUserCircle />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{customer.name}</span>
              </div>
              
              {customer.contacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-2">
                  <IconPhone className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {contact.name} ({contact.position}): {contact.phone}
                    {contact.isPrimary && <Badge className="ml-2 text-xs">主要</Badge>}
                  </span>
                </div>
              ))}
              
              {customer.email && (
                <div className="flex items-center gap-2">
                  <IconMail className="h-5 w-5 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span>{customer.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="h-5 w-5 text-muted-foreground" />
                <span>创建时间: {customer.createdAt}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">客户统计</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground text-sm">总订单数</div>
                  <div className="font-medium text-lg">{customer.totalOrders}个</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">总消费</div>
                  <div className="font-medium text-lg">{formatCurrency(customer.totalSpent)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">最近订单</div>
                  <div className="font-medium">{customer.lastOrderDate}</div>
                </div>
              </div>
            </div>
            
            {customer.notes && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">备注</h3>
                <p className="text-sm">{customer.notes}</p>
              </div>
            )}
            
            {customer.taxInfo && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">发票信息</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">税号: </span>
                    {customer.taxInfo.taxNumber}
                  </div>
                  <div>
                    <span className="text-muted-foreground">开户行: </span>
                    {customer.taxInfo.bankName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">账号: </span>
                    {customer.taxInfo.bankAccount}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="orders">订单记录</TabsTrigger>
              <TabsTrigger value="maintenance">养护计划</TabsTrigger>
              <TabsTrigger value="contacts">联系人</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>订单记录</CardTitle>
                    <Button size="sm" asChild>
                      <Link href={`/sales/orders/new?customerId=${customer.id}`}>
                        <IconPlant className="h-4 w-4 mr-1" />
                        创建订单
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {customer.orders.length > 0 ? (
                    <div className="space-y-4">
                      {customer.orders.map((order) => (
                        <Card key={order.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                <Link 
                                  href={`/sales/orders/${order.id}`}
                                  className="hover:underline"
                                >
                                  {order.orderNumber}
                                </Link>
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                下单日期: {order.orderDate}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge 
                                variant="outline" 
                                className={
                                  order.status === "completed" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                    : order.status === "confirmed" 
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                }
                              >
                                {
                                  order.status === "completed" 
                                    ? "已完成" 
                                    : order.status === "confirmed" 
                                      ? "已确认"
                                      : "待处理"
                                }
                              </Badge>
                              <div className="mt-1 font-medium">
                                {formatCurrency(order.totalAmount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                已付: {formatCurrency(order.paidAmount)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 justify-end">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/sales/orders/${order.id}`}>
                                <IconEye className="h-3.5 w-3.5 mr-1" />
                                查看
                              </Link>
                            </Button>
                            {order.status === "confirmed" && (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/sales/orders/${order.id}/ship`}>
                                  <IconTruck className="h-3.5 w-3.5 mr-1" />
                                  发货
                                </Link>
                              </Button>
                            )}
                            {(order.status === "shipped" || order.status === "delivered") && (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/sales/orders/${order.id}/invoice`}>
                                  <IconFileInvoice className="h-3.5 w-3.5 mr-1" />
                                  开票
                                </Link>
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无订单记录
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>养护计划</CardTitle>
                    <Button size="sm" asChild>
                      <Link href={`/maintenance/plans/new?customerId=${customer.id}`}>
                        创建养护计划
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {customer.maintenancePlans.length > 0 ? (
                    <div className="space-y-4">
                      {customer.maintenancePlans.map((plan) => (
                        <Card key={plan.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                <Link 
                                  href={`/maintenance/plans/${plan.id}`}
                                  className="hover:underline"
                                >
                                  {plan.planNumber}
                                </Link>
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                {plan.startDate} 至 {plan.endDate}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge 
                                variant="outline" 
                                className={
                                  plan.status === "active" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                                }
                              >
                                {plan.status === "active" ? "进行中" : "已完成"}
                              </Badge>
                              <div className="mt-1 font-medium">
                                {formatCurrency(plan.totalValue)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 justify-end">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/maintenance/plans/${plan.id}`}>
                                <IconEye className="h-3.5 w-3.5 mr-1" />
                                查看
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无养护计划
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>联系人</CardTitle>
                    <Button size="sm" asChild>
                      <Link href={`/sales/customers/${customer.id}/contacts/new`}>
                        添加联系人
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {customer.contacts.length > 0 ? (
                    <div className="space-y-4">
                      {customer.contacts.map((contact, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {contact.name}
                                {contact.isPrimary && (
                                  <Badge className="ml-2">主要联系人</Badge>
                                )}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                职位: {contact.position}
                              </div>
                            </div>
                            <div>
                              <div className="text-right">{contact.phone}</div>
                              <div className="text-sm text-muted-foreground">
                                {contact.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 justify-end">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/sales/customers/${customer.id}/contacts/${index}/edit`}>
                                <IconEdit className="h-3.5 w-3.5 mr-1" />
                                编辑
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无联系人
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
