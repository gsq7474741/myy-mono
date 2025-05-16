import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft, IconEdit, IconList, IconCalendarTime } from "@tabler/icons-react";
import Link from "next/link";

// 模拟数据获取函数
async function getMaintenancePlan(id: string) {
  // 实际项目中应从数据库获取
  const plans = [
    {
      id: "mp1",
      name: "2025年春季养护计划",
      type: "regular",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      customer: {
        id: "cust1",
        name: "张三园林有限公司",
        contact: "张经理",
        phone: "13800138001",
        address: "江苏省南京市江宁区紫金园林大道88号",
      },
      status: "active",
      description: "常规春季养护，包括修剪、施肥、病虫害防治等",
      tasksCount: 12,
      completedTasksCount: 5,
      frequency: "每周两次",
      notes: "客户要求每次养护后提供详细报告",
      plants: [
        { id: "p1", name: "红枫", quantity: 12, location: "主园区北侧" },
        { id: "p2", name: "银杏", quantity: 8, location: "办公楼前" },
        { id: "p3", name: "樱花", quantity: 15, location: "园区东侧" },
      ],
      services: [
        { name: "修剪整形", frequency: "每月一次" },
        { name: "施肥", frequency: "每季度一次" },
        { name: "病虫害防治", frequency: "根据需要" },
        { name: "浇水", frequency: "每周两次" },
      ],
      createdAt: "2025-02-15",
      createdBy: "王管理",
    },
    {
      id: "mp2",
      name: "李四景观设计工作室特殊养护",
      type: "special",
      startDate: "2025-03-15",
      endDate: "2025-04-15",
      customer: {
        id: "cust2",
        name: "李四景观设计工作室",
        contact: "李设计",
        phone: "13900139002",
        address: "浙江省杭州市西湖区文创园A5栋",
      },
      status: "active",
      description: "针对新栽植苗木的特殊养护计划",
      tasksCount: 8,
      completedTasksCount: 3,
      frequency: "每周三次",
      notes: "新栽植苗木需特别关注水分管理",
      plants: [
        { id: "p4", name: "日本红枫", quantity: 5, location: "庭院中央" },
        { id: "p5", name: "紫薇", quantity: 10, location: "围墙边" },
      ],
      services: [
        { name: "浇水", frequency: "每两天一次" },
        { name: "病虫害监测", frequency: "每周一次" },
        { name: "施肥", frequency: "每月一次" },
      ],
      createdAt: "2025-03-10",
      createdBy: "赵技术",
    },
  ];
  
  return plans.find(plan => plan.id === id) || null;
}

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: "进行中", className: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
};

// 类型映射
const typeMap: Record<string, string> = {
  regular: "常规养护",
  special: "特殊养护",
};

export default async function MaintenancePlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const plan = await getMaintenancePlan((await params).id);
  
  if (!plan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">养护计划不存在</h2>
        <p className="mt-2 text-muted-foreground">找不到ID为 {(await params).id} 的养护计划</p>
        <Button asChild className="mt-4">
          <Link href="/maintenance">返回养护服务</Link>
        </Button>
      </div>
    );
  }
  
  const progress = Math.round((plan.completedTasksCount / plan.tasksCount) * 100);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/maintenance">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{plan.name}</h1>
        <Badge className={statusMap[plan.status]?.className || "bg-gray-100"}>
          {statusMap[plan.status]?.label || plan.status}
        </Badge>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="text-muted-foreground">{plan.description}</p>
          <p className="mt-1">
            <span className="font-medium">养护类型:</span> {typeMap[plan.type]}
          </p>
        </div>
        <div className="flex gap-2">
          {plan.status === "active" && (
            <>
              <Button asChild>
                <Link href={`/maintenance/plans/${plan.id}/tasks`}>
                  <IconList className="h-4 w-4 mr-1" />
                  查看任务
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/maintenance/plans/${plan.id}/edit`}>
                  <IconEdit className="h-4 w-4 mr-1" />
                  编辑计划
                </Link>
              </Button>
            </>
          )}
          {plan.status === "completed" && (
            <Button asChild>
              <Link href={`/maintenance/plans/${plan.id}/renew`}>
                <IconCalendarTime className="h-4 w-4 mr-1" />
                续约计划
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>计划信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">开始日期</div>
              <div>{plan.startDate}</div>
              
              <div className="text-muted-foreground">结束日期</div>
              <div>{plan.endDate}</div>
              
              <div className="text-muted-foreground">养护频率</div>
              <div>{plan.frequency}</div>
              
              <div className="text-muted-foreground">创建时间</div>
              <div>{plan.createdAt}</div>
              
              <div className="text-muted-foreground">创建人</div>
              <div>{plan.createdBy}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">客户名称</div>
              <div>
                <Link href={`/sales/customers/${plan.customer.id}`} className="hover:underline text-primary">
                  {plan.customer.name}
                </Link>
              </div>
              
              <div className="text-muted-foreground">联系人</div>
              <div>{plan.customer.contact}</div>
              
              <div className="text-muted-foreground">联系电话</div>
              <div>{plan.customer.phone}</div>
              
              <div className="text-muted-foreground">地址</div>
              <div className="truncate" title={plan.customer.address}>
                {plan.customer.address}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>进度跟踪</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm whitespace-nowrap">
                {progress}%
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{plan.completedTasksCount}/{plan.tasksCount}</div>
              <div className="text-sm text-muted-foreground">已完成/总任务</div>
            </div>
            {plan.notes && (
              <div className="mt-4">
                <div className="font-medium">备注</div>
                <p className="text-sm text-muted-foreground">{plan.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="plants">
        <TabsList>
          <TabsTrigger value="plants">养护苗木</TabsTrigger>
          <TabsTrigger value="services">服务内容</TabsTrigger>
        </TabsList>
        <TabsContent value="plants" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>养护苗木列表</CardTitle>
              <CardDescription>本计划包含的苗木资产</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">苗木名称</th>
                    <th className="text-left py-2 font-medium">数量</th>
                    <th className="text-left py-2 font-medium">位置</th>
                    <th className="text-right py-2 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.plants.map((plant) => (
                    <tr key={plant.id} className="border-b">
                      <td className="py-2">
                        <Link href={`/plants/${plant.id}`} className="hover:underline text-primary">
                          {plant.name}
                        </Link>
                      </td>
                      <td className="py-2">{plant.quantity}株</td>
                      <td className="py-2">{plant.location}</td>
                      <td className="py-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/plants/${plant.id}`}>查看详情</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>服务内容</CardTitle>
              <CardDescription>本计划包含的养护服务</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">服务名称</th>
                    <th className="text-left py-2 font-medium">频率</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.services.map((service, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{service.name}</td>
                      <td className="py-2">{service.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
