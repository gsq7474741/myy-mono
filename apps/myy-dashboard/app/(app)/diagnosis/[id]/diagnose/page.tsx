import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormData } from "@/lib/types/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";


// 模拟数据获取函数
function getDiagnosisRecord(id: string) {
  // 这里应该是从API获取数据
  const records = [
    {
      id: "dr3",
      plantId: "p5",
      symptoms: "部分枝条针叶脱落，树干有树脂流出",
      status: "pending",
      images: [
        {
          url: "/placeholder-diagnosis-4.jpg",
          caption: "针叶脱落情况",
        },
        {
          url: "/placeholder-diagnosis-5.jpg",
          caption: "树干树脂流出",
        }
      ],
      notes: "客户反映近期浇水正常，但发现周围有蚂蚁活动增多。",
    },
    // 其他记录...
  ];
  
  return records.find(record => record.id === id) || null;
}

interface DiagnosePageProps {
  params: Promise<{ id: string }>;
}

// 服务器操作：提交诊断结果
async function submitDiagnosis(data: FormData, id: string) {
  'use server';
  
  // 在实际应用中，这里应该将数据提交到数据库
  console.log("提交的诊断数据:", data);
  
  // 模拟处理时间
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 重定向到诊断详情页
  redirect(`/diagnosis/${id}`);
}

export default function DiagnosePage({ params }: DiagnosePageProps) {
  const { id } = React.use(params);
  const record = getDiagnosisRecord(id);
  
  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">诊断记录不存在</h1>
        <Button asChild>
          <Link href="/diagnosis">返回诊断列表</Link>
        </Button>
      </div>
    );
  }
  
  const handleSubmit = async (data: FormData) => {
    await submitDiagnosis(data, id);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/diagnosis/${id}`}>
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回诊断详情
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">进行诊断</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">症状描述</h3>
            <p className="text-muted-foreground">{record.symptoms}</p>
          </div>
          
          <DiagnosisForm 
            type="diagnose" 
            initialData={record}
            onSubmit={handleSubmit} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
