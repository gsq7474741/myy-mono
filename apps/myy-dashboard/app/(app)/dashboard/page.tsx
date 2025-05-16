import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">仪表盘</h1>
      
      <StatisticsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardOverview />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
