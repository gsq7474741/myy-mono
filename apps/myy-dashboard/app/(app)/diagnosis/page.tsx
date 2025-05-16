import { DiagnosisRecordsList } from "@/components/diagnosis/DiagnosisRecordsList";
import { DiagnosisFilters } from "@/components/diagnosis/DiagnosisFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiagnosisPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">远程诊断</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/diagnosis/new">创建诊断工单</Link>
          </Button>
        </div>
      </div>
      
      <DiagnosisFilters />
      
      <DiagnosisRecordsList />
    </div>
  );
}
