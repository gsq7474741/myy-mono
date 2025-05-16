import { notFound } from "next/navigation";
import EditMaintenancePlanForm from "@/components/maintenance/EditMaintenancePlanForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

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
    },
  ];
  
  return plans.find(plan => plan.id === id) || null;
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

// 模拟获取苗木列表
async function getPlants() {
  return [
    { id: "p1", name: "红枫" },
    { id: "p2", name: "银杏" },
    { id: "p3", name: "樱花" },
    { id: "p4", name: "日本红枫" },
    { id: "p5", name: "紫薇" },
    { id: "p6", name: "香樟" },
    { id: "p7", name: "雪松" },
    { id: "p8", name: "桂花" },
  ];
}

// 模拟更新养护计划
async function updateMaintenancePlan(id: string, data: any) {
  console.log("更新养护计划", id, data);
  // 实际项目中应调用API更新数据库
  return { success: true };
}

// 定义页面组件的参数类型
interface EditMaintenancePlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMaintenancePlanPage({ params }: EditMaintenancePlanPageProps) {
  // 并行获取数据
  const [plan, customers, plants] = await Promise.all([
    getMaintenancePlan((await params).id),
    getCustomers(),
    getPlants(),
  ]);
  
  // 如果找不到养护计划，返回404
  if (!plan) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">编辑养护计划</h1>
        <div className="flex space-x-2">
          <Link href={`/maintenance/plans/${(await params).id}`}>
            <Button variant="outline" size="sm">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              返回详情
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 使用客户端表单组件 */}
      <EditMaintenancePlanForm 
        plan={plan} 
        customers={customers} 
        plants={plants} 
      />
    </div>
  );
}
