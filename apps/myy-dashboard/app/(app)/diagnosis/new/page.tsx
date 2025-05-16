"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormData } from "@/lib/types/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";

export default function NewDiagnosisPage() {
  const router = useRouter();
  
  const handleSubmit = (data: FormData) => {
    // 在实际应用中，这里应该将数据提交到API
    console.log("提交的诊断数据:", data);
    
    // 模拟提交成功后跳转
    setTimeout(() => {
      router.push("/diagnosis");
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/diagnosis">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回诊断列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">创建诊断工单</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <DiagnosisForm 
            type="create" 
            onSubmit={handleSubmit} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
