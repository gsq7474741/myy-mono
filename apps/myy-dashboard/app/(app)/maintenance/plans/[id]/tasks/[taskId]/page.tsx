import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

// 模拟数据获取函数
async function getMaintenanceTask(planId: string, taskId: string) {
  // 实际项目中应从数据库获取
  const tasks = [
    {
      id: "task1",
      planId: "mp1",
      title: "春季修剪",
      description: "对所有红枫进行春季修剪整形",
      status: "completed",
      dueDate: "2025-03-10",
      completedDate: "2025-03-09",
      assignedTo: "李技师",
      priority: "high",
      plants: ["红枫"],
      location: "主园区北侧",
      notes: "已完成，客户对修剪效果表示满意",
      images: [
        "/demo/maintenance1.jpg",
        "/demo/maintenance2.jpg",
      ],
      timeline: [
        { date: "2025-03-01", action: "创建任务", user: "王管理" },
        { date: "2025-03-05", action: "分配给李技师", user: "王管理" },
        { date: "2025-03-09", action: "标记为已完成", user: "李技师" },
        { date: "2025-03-10", action: "客户确认满意", user: "张经理" },
      ],
      materials: [
        { name: "园艺剪", quantity: 2, unit: "把" },
        { name: "防腐剂", quantity: 0.5, unit: "升" },
      ]
    },
    {
      id: "task2",
      planId: "mp1",
      title: "施肥",
      description: "对所有苗木进行春季基肥施用",
      status: "completed",
      dueDate: "2025-03-15",
      completedDate: "2025-03-14",
      assignedTo: "王技师",
      priority: "medium",
      plants: ["红枫", "银杏", "樱花"],
      location: "全园区",
      notes: "使用有机肥，每株用量按规定执行",
      images: [
        "/demo/maintenance3.jpg",
      ],
      timeline: [
        { date: "2025-03-01", action: "创建任务", user: "王管理" },
        { date: "2025-03-10", action: "分配给王技师", user: "王管理" },
        { date: "2025-03-14", action: "标记为已完成", user: "王技师" },
      ],
      materials: [
        { name: "有机肥", quantity: 50, unit: "公斤" },
        { name: "铲子", quantity: 3, unit: "把" },
      ]
    },
    {
      id: "task3",
      planId: "mp1",
      title: "病虫害防治",
      description: "对樱花进行春季病虫害预防性喷药",
      status: "in_progress",
      dueDate: "2025-03-20",
      assignedTo: "赵技师",
      priority: "high",
      plants: ["樱花"],
      location: "园区东侧",
      notes: "使用生物农药，注意避开开花期",
      images: [],
      timeline: [
        { date: "2025-03-05", action: "创建任务", user: "王管理" },
        { date: "2025-03-12", action: "分配给赵技师", user: "王管理" },
        { date: "2025-03-18", action: "开始执行", user: "赵技师" },
      ],
      materials: [
        { name: "生物农药", quantity: 2, unit: "升" },
        { name: "喷雾器", quantity: 1, unit: "台" },
      ]
    },
  ];
  
  return tasks.find(task => task.planId === planId && task.id === taskId) || null;
}

// 模拟获取养护计划
async function getMaintenancePlan(id: string) {
  // 实际项目中应从数据库获取
  const plans = [
    {
      id: "mp1",
      name: "2025年春季养护计划",
      customer: {
        id: "cust1",
        name: "张三园林有限公司",
      },
    },
    {
      id: "mp2",
      name: "李四景观设计工作室特殊养护",
      customer: {
        id: "cust2",
        name: "李四景观设计工作室",
      },
    },
  ];
  
  return plans.find(plan => plan.id === id) || null;
}

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-gray-100 text-gray-800" },
  in_progress: { label: "进行中", className: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-800" },
};

// 优先级映射
const priorityMap: Record<string, { label: string; className: string }> = {
  low: { label: "低", className: "text-gray-600" },
  medium: { label: "中", className: "text-blue-600" },
  high: { label: "高", className: "text-red-600" },
};

export default async function MaintenanceTaskDetailPage(
  props: { 
    params: Promise<{ id: string; taskId: string }> 
  }
) {
  const params = await props.params;
  const task = await getMaintenanceTask(params.id, params.taskId);
  const plan = await getMaintenancePlan(params.id);

  if (!task || !plan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">养护任务不存在</h2>
        <p className="mt-2 text-muted-foreground">找不到指定的养护任务</p>
        <Button asChild className="mt-4">
          <Link href={`/maintenance/plans/${params.id}/tasks`}>返回任务列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/maintenance/plans/${params.id}/tasks`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回任务列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <Badge className={statusMap[task.status]?.className || "bg-gray-100"}>
          {statusMap[task.status]?.label || task.status}
        </Badge>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="text-muted-foreground">{task.description}</p>
          <p className="mt-1">
            <span className="font-medium">所属计划:</span>{" "}
            <Link href={`/maintenance/plans/${params.id}`} className="hover:underline text-primary">
              {plan.name}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          {task.status === "pending" && (
            <>
              <Button asChild>
                <Link href={`/maintenance/plans/${params.id}/tasks/${params.taskId}/start`}>
                  <IconCheck className="h-4 w-4 mr-1" />
                  开始任务
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/maintenance/plans/${params.id}/tasks/${params.taskId}/edit`}>
                  <IconEdit className="h-4 w-4 mr-1" />
                  编辑任务
                </Link>
              </Button>
            </>
          )}
          {task.status === "in_progress" && (
            <>
              <Button asChild>
                <Link href={`/maintenance/plans/${params.id}/tasks/${params.taskId}/complete`}>
                  <IconCheck className="h-4 w-4 mr-1" />
                  完成任务
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/maintenance/plans/${params.id}/tasks/${params.taskId}/edit`}>
                  <IconEdit className="h-4 w-4 mr-1" />
                  编辑任务
                </Link>
              </Button>
            </>
          )}
          {task.status === "completed" && (
            <Button variant="outline" asChild>
              <Link href={`/maintenance/plans/${params.id}/tasks/${params.taskId}/report`}>
                查看报告
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>任务信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">截止日期</div>
              <div>{task.dueDate}</div>
              
              {task.completedDate && (
                <>
                  <div className="text-muted-foreground">完成日期</div>
                  <div>{task.completedDate}</div>
                </>
              )}
              
              <div className="text-muted-foreground">负责人</div>
              <div>{task.assignedTo}</div>
              
              <div className="text-muted-foreground">优先级</div>
              <div className={priorityMap[task.priority]?.className || ""}>
                {priorityMap[task.priority]?.label || task.priority}
              </div>
              
              <div className="text-muted-foreground">位置</div>
              <div>{task.location}</div>
            </div>
            
            {task.notes && (
              <div className="mt-4">
                <div className="font-medium">备注</div>
                <p className="text-sm text-muted-foreground">{task.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>养护苗木</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {task.plants.map((plant, index) => (
                <li key={index}>{plant}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>所需物料</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">物料名称</th>
                  <th className="text-right py-2 font-medium">数量</th>
                </tr>
              </thead>
              <tbody>
                {task.materials.map((material, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{material.name}</td>
                    <td className="py-2 text-right">{material.quantity} {material.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">时间线</TabsTrigger>
          <TabsTrigger value="images">现场图片</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>任务时间线</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 pl-6 ml-3 space-y-6">
                {task.timeline.map((event, index) => (
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
        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>现场图片</CardTitle>
            </CardHeader>
            <CardContent>
              {task.images.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">暂无图片</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {task.images.map((image, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`养护任务图片 ${index + 1}`} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
