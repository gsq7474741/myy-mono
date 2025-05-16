"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// 模拟数据
const statusRecords = [
  {
    id: "sr1",
    recordDate: new Date(2025, 3, 1),
    status: "healthy",
    description: "定期检查，植株生长良好，叶色正常",
    recordedBy: {
      name: "张三",
      avatar: "/placeholder-user.jpg",
      initials: "ZS",
    },
  },
  {
    id: "sr2",
    recordDate: new Date(2025, 2, 15),
    status: "treatment",
    description: "发现叶片边缘有轻微褐变，已进行杀菌处理",
    recordedBy: {
      name: "李四",
      avatar: "/placeholder-user.jpg",
      initials: "LS",
    },
  },
  {
    id: "sr3",
    recordDate: new Date(2025, 2, 1),
    status: "healthy",
    description: "定期检查，植株状态良好",
    recordedBy: {
      name: "张三",
      avatar: "/placeholder-user.jpg",
      initials: "ZS",
    },
  },
  {
    id: "sr4",
    recordDate: new Date(2025, 1, 15),
    status: "dormant",
    description: "冬季休眠期，生长缓慢",
    recordedBy: {
      name: "王五",
      avatar: "/placeholder-user.jpg",
      initials: "WW",
    },
  },
  {
    id: "sr5",
    recordDate: new Date(2025, 0, 15),
    status: "dormant",
    description: "冬季休眠期，生长停滞",
    recordedBy: {
      name: "王五",
      avatar: "/placeholder-user.jpg",
      initials: "WW",
    },
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  healthy: { label: "健康", className: "bg-green-100 text-green-800" },
  treatment: { label: "治疗中", className: "bg-yellow-100 text-yellow-800" },
  sick: { label: "病害", className: "bg-red-100 text-red-800" },
  dormant: { label: "休眠", className: "bg-blue-100 text-blue-800" },
};

export function PlantStatusHistory() {
  // 在实际应用中，这里会根据id从API获取苗木状态历史数据
  const records = statusRecords;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">状态记录历史</h3>
        <div className="space-y-6">
          {records.map((record, index) => (
            <div key={record.id} className="relative pl-8">
              {/* 时间线 */}
              {index < records.length - 1 && (
                <div className="absolute left-4 top-4 bottom-0 w-px bg-border" />
              )}
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border">
                <div
                  className={`w-4 h-4 rounded-full ${
                    statusMap[record.status]?.className.split(" ")[0] || "bg-gray-100"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[record.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[record.status]?.label || record.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(record.recordDate)}
                  </span>
                </div>
                <p className="text-sm">{record.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={record.recordedBy.avatar} alt={record.recordedBy.name} />
                    <AvatarFallback>{record.recordedBy.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    记录人: {record.recordedBy.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
