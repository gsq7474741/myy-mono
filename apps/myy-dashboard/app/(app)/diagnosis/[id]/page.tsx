import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IconArrowLeft, 
  IconEdit, 
  IconStethoscope, 
  IconPlant, 
  IconUser, 
  IconCalendar, 
  IconStatusChange,
  IconPhoto
} from "@tabler/icons-react";

// 模拟数据获取函数
function getDiagnosisRecord(id: string) {
  // 这里应该是从API获取数据
  const records = [
    {
      id: "dr1",
      plant: {
        id: "p1",
        name: "红枫",
        species: "Acer palmatum",
        location: "东区苗圃",
        age: "5年",
        height: "2.5米",
      },
      reportedBy: {
        id: "user1",
        name: "张三",
        role: "养护专员",
        phone: "13800138001",
      },
      reportDate: "2025-03-28",
      symptoms: "叶片边缘发黄，有轻微卷曲。近期天气较为干燥，植株位置阳光充足，可能导致水分蒸发过快。部分叶片出现小黑点，疑似病菌感染初期症状。",
      diagnosis: "初步诊断为缺水和光照过强导致的叶片受损，同时可能有轻微的真菌感染。",
      treatment: "建议措施：1. 增加浇水频率，保持土壤湿润但不积水；2. 移至半阴处，避免强烈阳光直射；3. 预防性喷洒杀菌剂，防止真菌进一步扩散；4. 一周后复查。",
      treatmentDate: "2025-03-29",
      diagnosedBy: {
        id: "expert1",
        name: "李专家",
        title: "植物病理学专家",
      },
      followUpDate: "2025-04-05",
      status: "diagnosed",
      images: [
        {
          url: "/placeholder-diagnosis-1.jpg",
          caption: "受损叶片特写",
          uploadedAt: "2025-03-28",
        },
        {
          url: "/placeholder-diagnosis-2.jpg",
          caption: "植株全景",
          uploadedAt: "2025-03-28",
        }
      ],
      notes: "客户反映近期浇水不足，且植株位置阳光直射时间较长。",
      history: [
        {
          date: "2025-03-28",
          action: "创建诊断工单",
          by: "张三",
        },
        {
          date: "2025-03-29",
          action: "完成初步诊断",
          by: "李专家",
        },
        {
          date: "2025-03-30",
          action: "开始执行处理方案",
          by: "王养护",
        }
      ]
    },
    // 其他记录...
  ];
  
  return records.find(record => record.id === id) || null;
}

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待诊断", className: "bg-yellow-100 text-yellow-800" },
  diagnosed: { label: "已诊断", className: "bg-blue-100 text-blue-800" },
  treated: { label: "已处理", className: "bg-purple-100 text-purple-800" },
  resolved: { label: "已解决", className: "bg-green-100 text-green-800" },
};

export default async function DiagnosisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const record = getDiagnosisRecord((await params).id);
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/diagnosis">
              <IconArrowLeft className="h-4 w-4 mr-1" />
              返回诊断列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">诊断详情</h1>
          <span
            className={`ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusMap[record.status]?.className || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusMap[record.status]?.label || record.status}
          </span>
        </div>
        
        <div className="flex gap-2">
          {record.status === "pending" && (
            <Button asChild>
              <Link href={`/diagnosis/${record.id}/diagnose`}>
                <IconStethoscope className="h-4 w-4 mr-1" />
                进行诊断
              </Link>
            </Button>
          )}
          {(record.status === "diagnosed" || record.status === "treated") && (
            <Button asChild>
              <Link href={`/diagnosis/${record.id}/edit`}>
                <IconEdit className="h-4 w-4 mr-1" />
                编辑诊断
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>症状描述</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{record.symptoms}</p>
            </CardContent>
          </Card>
          
          {record.diagnosis && (
            <Card>
              <CardHeader>
                <CardTitle>诊断结果</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{record.diagnosis}</p>
                {record.diagnosedBy && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    诊断专家: {record.diagnosedBy.name} ({record.diagnosedBy.title})
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {record.treatment && (
            <Card>
              <CardHeader>
                <CardTitle>处理方案</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{record.treatment}</p>
                {record.treatmentDate && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    处理日期: {record.treatmentDate}
                  </div>
                )}
                {record.followUpDate && (
                  <div className="text-sm text-muted-foreground">
                    复查日期: {record.followUpDate}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="images">
            <TabsList>
              <TabsTrigger value="images">
                <IconPhoto className="h-4 w-4 mr-1" />
                诊断图片
              </TabsTrigger>
              <TabsTrigger value="history">
                <IconStatusChange className="h-4 w-4 mr-1" />
                处理历史
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative aspect-video overflow-hidden rounded-lg border">
                          <Image
                            src={image.url}
                            alt={image.caption || `诊断图片 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{image.caption || `诊断图片 ${index + 1}`}</p>
                          <p className="text-muted-foreground">上传于: {image.uploadedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {record.history.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="w-32 flex-shrink-0 text-sm text-muted-foreground">
                          {item.date}
                        </div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">操作人: {item.by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>植物信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <IconPlant className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{record.plant.name}</div>
                    <div className="text-sm text-muted-foreground">{record.plant.species}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">位置:</span> {record.plant.location}
                  </div>
                  <div>
                    <span className="text-muted-foreground">树龄:</span> {record.plant.age}
                  </div>
                  <div>
                    <span className="text-muted-foreground">高度:</span> {record.plant.height}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/plants/${record.plant.id}`}>
                      查看植物详情
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>报告信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <IconUser className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{record.reportedBy.name}</div>
                    <div className="text-sm text-muted-foreground">{record.reportedBy.role}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">报告日期</div>
                    <div className="text-sm text-muted-foreground">{record.reportDate}</div>
                  </div>
                </div>
                
                {record.notes && (
                  <div className="pt-2">
                    <div className="text-sm font-medium">附加说明</div>
                    <p className="text-sm text-muted-foreground">{record.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
