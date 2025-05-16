"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/index";
import Image from "next/image";


// 模拟数据
const maintenanceRecords = [
  {
    id: "mr1",
    date: new Date(2025, 3, 1),
    taskTitle: "春季修剪",
    actions: "进行了轻度修剪，去除枯枝和病叶",
    notes: "植株整体状态良好，建议增加浇水频率",
    images: ["/placeholder-maintenance-1.jpg", "/placeholder-maintenance-2.jpg"],
    taskId: "task1",
    planName: "2025年春季养护计划",
  },
  {
    id: "mr2",
    date: new Date(2025, 2, 15),
    taskTitle: "病虫害防治",
    actions: "喷洒杀菌剂，处理叶片褐变问题",
    notes: "叶片边缘有轻微褐变，可能是真菌感染，需要持续观察",
    images: ["/placeholder-maintenance-3.jpg"],
    taskId: "task2",
    planName: "病虫害应急处理",
  },
  {
    id: "mr3",
    date: new Date(2025, 1, 20),
    taskTitle: "冬季保护",
    actions: "添加防寒措施，包裹树干",
    notes: "冬季气温较低，已采取防寒保护措施",
    images: [],
    taskId: "task3",
    planName: "2024-2025冬季养护计划",
  },
  {
    id: "mr4",
    date: new Date(2024, 11, 10),
    taskTitle: "施肥",
    actions: "施加有机肥料，改善土壤环境",
    notes: "使用复合有机肥，促进根系发育",
    images: ["/placeholder-maintenance-4.jpg"],
    taskId: "task4",
    planName: "秋季养护计划",
  },
];

export function PlantMaintenanceHistory() {
  // 在实际应用中，这里会根据id从API获取苗木养护记录数据
  const records = maintenanceRecords;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">养护记录历史</h3>
        <div className="space-y-8">
          {records.map((record) => (
            <div key={record.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div>
                  <h4 className="font-medium">{record.taskTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(record.date)} · {record.planName}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                  任务ID: {record.taskId}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">养护操作:</p>
                  <p className="text-sm">{record.actions}</p>
                </div>
                
                {record.notes && (
                  <div>
                    <p className="text-sm font-medium">备注:</p>
                    <p className="text-sm">{record.notes}</p>
                  </div>
                )}
                
                {record.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">图片记录:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {record.images.map((image, index) => (
                        <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                          <Image
                            src={image}
                            alt={`养护记录 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
