import { PlantsList } from "@/components/plants/PlantsList";
import { PlantFilters } from "@/components/plants/PlantFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">苗木资产管理</h1>
        <Button asChild>
          <Link href="/plants/new">添加苗木</Link>
        </Button>
      </div>
      
      <PlantFilters />
      
      <PlantsList />
    </div>
  );
}
