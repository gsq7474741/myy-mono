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
      id: "dr1",
      plantId: "p1",
      symptoms: "叶片边缘发黄，有轻微卷曲",
      diagnosis: "可能是缺水或光照过强",
      treatment: "增加浇水频率，移至半阴处",
      status: "diagnosed",
      images: [
        {
          url: "/placeholder-diagnosis-1.jpg",
          caption: "受损叶片特写",
        },
        {
          url: "/placeholder-diagnosis-2.jpg",
          caption: "植株全景",
        }
      ],
      notes: "客户反映近期浇水不足，且植株位置阳光直射时间较长。",
    },
    // 其他记录...
  ];
  
  return records.find(record => record.id === id) || null;
}

// 服务器操作：提交编辑后的诊断数据
async function updateDiagnosis(data: FormData, id: string) {
  'use server';
  
  // 在实际应用中，这里应该将数据提交到数据库
  console.log("提交的编辑诊断数据:", data);
  
  // 模拟处理时间
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 重定向到诊断详情页
  redirect(`/diagnosis/${id}`);
}

export default async function EditDiagnosisPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
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
    await updateDiagnosis(data, id);
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
        <h1 className="text-3xl font-bold">编辑诊断</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">症状描述</h3>
            <p className="text-muted-foreground">{record.symptoms}</p>
          </div>
          
          <DiagnosisForm 
            type="edit" 
            initialData={record}
            onSubmit={handleSubmit} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
