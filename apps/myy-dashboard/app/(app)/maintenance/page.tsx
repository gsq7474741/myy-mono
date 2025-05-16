import { MaintenancePlansList } from "@/components/maintenance/MaintenancePlansList";
import { MaintenanceFilters } from "@/components/maintenance/MaintenanceFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">养护服务</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/maintenance/plans/new">创建养护计划</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/maintenance/tasks">任务管理</Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">养护计划</TabsTrigger>
          <TabsTrigger value="tasks">养护任务</TabsTrigger>
          <TabsTrigger value="records">养护记录</TabsTrigger>
        </TabsList>
        <TabsContent value="plans">
          <MaintenanceFilters type="plan" />
          <MaintenancePlansList />
        </TabsContent>
        <TabsContent value="tasks">
          <MaintenanceFilters type="task" />
          <div className="mt-4">
            {/* 这里将放置MaintenanceTasksList组件 */}
            <p className="text-center text-muted-foreground py-8">养护任务将显示在这里</p>
          </div>
        </TabsContent>
        <TabsContent value="records">
          <MaintenanceFilters type="record" />
          <div className="mt-4">
            {/* 这里将放置MaintenanceRecordsList组件 */}
            <p className="text-center text-muted-foreground py-8">养护记录将显示在这里</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
