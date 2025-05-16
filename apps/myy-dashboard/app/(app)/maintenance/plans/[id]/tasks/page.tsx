import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconPlus, IconCheck, IconX } from "@tabler/icons-react";
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
      },
      status: "active",
      description: "常规春季养护，包括修剪、施肥、病虫害防治等",
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
      },
      status: "active",
      description: "针对新栽植苗木的特殊养护计划",
    },
  ];
  
  return plans.find(plan => plan.id === id) || null;
}

// 模拟获取养护任务
async function getMaintenanceTasks(planId: string) {
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
    },
    {
      id: "task4",
      planId: "mp1",
      title: "浇水",
      description: "第一次例行浇水",
      status: "pending",
      dueDate: "2025-03-05",
      assignedTo: "张技师",
      priority: "medium",
      plants: ["红枫", "银杏", "樱花"],
      location: "全园区",
      notes: "根据天气情况可能调整",
    },
    {
      id: "task5",
      planId: "mp1",
      title: "浇水",
      description: "第二次例行浇水",
      status: "pending",
      dueDate: "2025-03-12",
      assignedTo: "张技师",
      priority: "medium",
      plants: ["红枫", "银杏", "樱花"],
      location: "全园区",
      notes: "根据天气情况可能调整",
    },
    {
      id: "task6",
      planId: "mp2",
      title: "新栽植苗木浇水",
      description: "对新栽植的日本红枫进行浇水",
      status: "completed",
      dueDate: "2025-03-16",
      completedDate: "2025-03-16",
      assignedTo: "刘技师",
      priority: "high",
      plants: ["日本红枫"],
      location: "庭院中央",
      notes: "特别注意不要积水",
    },
    {
      id: "task7",
      planId: "mp2",
      title: "新栽植苗木支撑固定",
      description: "检查并调整支撑杆",
      status: "in_progress",
      dueDate: "2025-03-18",
      assignedTo: "刘技师",
      priority: "medium",
      plants: ["日本红枫", "紫薇"],
      location: "庭院中央、围墙边",
      notes: "部分支撑杆需要更换",
    },
  ];
  
  return tasks.filter(task => task.planId === planId);
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

export default async function MaintenancePlanTasksPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const plan = await getMaintenancePlan(params.id);
  const tasks = await getMaintenanceTasks(params.id);

  if (!plan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">养护计划不存在</h2>
        <p className="mt-2 text-muted-foreground">找不到ID为 {params.id} 的养护计划</p>
        <Button asChild className="mt-4">
          <Link href="/maintenance">返回养护服务</Link>
        </Button>
      </div>
    );
  }

  // 按状态分组任务
  const groupedTasks = {
    pending: tasks.filter(task => task.status === "pending"),
    in_progress: tasks.filter(task => task.status === "in_progress"),
    completed: tasks.filter(task => task.status === "completed"),
    cancelled: tasks.filter(task => task.status === "cancelled"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/maintenance/plans/${params.id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回计划详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">养护任务</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-muted-foreground">{plan.description}</p>
          <p className="mt-1">
            <span className="font-medium">客户:</span>{" "}
            <Link href={`/sales/customers/${plan.customer.id}`} className="hover:underline text-primary">
              {plan.customer.name}
            </Link>
          </p>
        </div>
        <Button asChild>
          <Link href={`/maintenance/plans/${params.id}/tasks/new`}>
            <IconPlus className="h-4 w-4 mr-1" />
            新增任务
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex justify-between items-center">
              <span>待处理</span>
              <Badge variant="outline">{groupedTasks.pending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {groupedTasks.pending.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无待处理任务</p>
              ) : (
                groupedTasks.pending.map(task => (
                  <TaskCard key={task.id} task={task} planId={params.id} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex justify-between items-center">
              <span>进行中</span>
              <Badge variant="outline">{groupedTasks.in_progress.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {groupedTasks.in_progress.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无进行中任务</p>
              ) : (
                groupedTasks.in_progress.map(task => (
                  <TaskCard key={task.id} task={task} planId={params.id} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex justify-between items-center">
              <span>已完成</span>
              <Badge variant="outline">{groupedTasks.completed.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {groupedTasks.completed.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无已完成任务</p>
              ) : (
                groupedTasks.completed.map(task => (
                  <TaskCard key={task.id} task={task} planId={params.id} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 任务卡片组件
function TaskCard({ task, planId }: { task: any; planId: string }) {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <Link 
            href={`/maintenance/plans/${planId}/tasks/${task.id}`} 
            className="font-medium hover:underline"
          >
            {task.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </div>
        <Badge className={statusMap[task.status]?.className || "bg-gray-100"}>
          {statusMap[task.status]?.label || task.status}
        </Badge>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
        <div className="text-muted-foreground">截止日期:</div>
        <div>{task.dueDate}</div>
        
        <div className="text-muted-foreground">负责人:</div>
        <div>{task.assignedTo}</div>
        
        <div className="text-muted-foreground">优先级:</div>
        <div className={priorityMap[task.priority]?.className || ""}>
          {priorityMap[task.priority]?.label || task.priority}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {task.plants.join(", ")}
        </div>
        <div className="flex gap-1">
          {task.status === "pending" && (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/maintenance/plans/${planId}/tasks/${task.id}/start`}>
                  <IconCheck className="h-3 w-3 mr-1" />
                  开始
                </Link>
              </Button>
            </>
          )}
          {task.status === "in_progress" && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/maintenance/plans/${planId}/tasks/${task.id}/complete`}>
                <IconCheck className="h-3 w-3 mr-1" />
                完成
              </Link>
            </Button>
          )}
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/maintenance/plans/${planId}/tasks/${task.id}`}>
              查看
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
