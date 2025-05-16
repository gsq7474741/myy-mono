"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconEye, IconEdit, IconStethoscope } from "@tabler/icons-react";

// 模拟数据
const diagnosisRecords = [
  {
    id: "dr1",
    plant: {
      id: "p1",
      name: "红枫",
      species: "Acer palmatum",
    },
    reportedBy: {
      id: "user1",
      name: "张三",
    },
    reportDate: "2025-03-28",
    symptoms: "叶片边缘发黄，有轻微卷曲",
    diagnosis: "可能是缺水或光照过强",
    treatment: "增加浇水频率，移至半阴处",
    status: "diagnosed",
    images: ["/placeholder-diagnosis-1.jpg", "/placeholder-diagnosis-2.jpg"],
  },
  {
    id: "dr2",
    plant: {
      id: "p3",
      name: "紫薇",
      species: "Lagerstroemia indica",
    },
    reportedBy: {
      id: "user2",
      name: "李四",
    },
    reportDate: "2025-03-27",
    symptoms: "新芽生长缓慢，叶片有白色斑点",
    diagnosis: "疑似白粉病初期症状",
    treatment: "喷洒杀菌剂，隔离观察",
    status: "treated",
    images: ["/placeholder-diagnosis-3.jpg"],
  },
  {
    id: "dr3",
    plant: {
      id: "p5",
      name: "雪松",
      species: "Cedrus deodara",
    },
    reportedBy: {
      id: "user3",
      name: "王五",
    },
    reportDate: "2025-03-26",
    symptoms: "部分枝条针叶脱落，树干有树脂流出",
    diagnosis: null,
    treatment: null,
    status: "pending",
    images: ["/placeholder-diagnosis-4.jpg", "/placeholder-diagnosis-5.jpg"],
  },
  {
    id: "dr4",
    plant: {
      id: "p2",
      name: "银杏",
      species: "Ginkgo biloba",
    },
    reportedBy: {
      id: "user4",
      name: "赵六",
    },
    reportDate: "2025-03-25",
    symptoms: "叶片发黄过早，树干底部有黑色斑点",
    diagnosis: "根部感染真菌",
    treatment: "挖松根部周围土壤，施加杀菌剂，改善排水",
    status: "resolved",
    images: ["/placeholder-diagnosis-6.jpg"],
  },
  {
    id: "dr5",
    plant: {
      id: "p4",
      name: "黄杨",
      species: "Buxus sinica",
    },
    reportedBy: {
      id: "user5",
      name: "钱七",
    },
    reportDate: "2025-03-24",
    symptoms: "叶片有虫蛀痕迹，新梢生长受阻",
    diagnosis: "黄杨木虱侵害",
    treatment: "喷洒杀虫剂，修剪受害枝条",
    status: "treated",
    images: ["/placeholder-diagnosis-7.jpg", "/placeholder-diagnosis-8.jpg"],
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "待诊断", className: "bg-yellow-100 text-yellow-800" },
  diagnosed: { label: "已诊断", className: "bg-blue-100 text-blue-800" },
  treated: { label: "已处理", className: "bg-purple-100 text-purple-800" },
  resolved: { label: "已解决", className: "bg-green-100 text-green-800" },
};

export function DiagnosisRecordsList() {
  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>植物信息</TableHead>
              <TableHead>报告日期</TableHead>
              <TableHead>症状描述</TableHead>
              <TableHead>诊断结果</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnosisRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="font-medium">
                    <Link href={`/plants/${record.plant.id}`} className="hover:underline">
                      {record.plant.name}
                    </Link>
                  </div>
                  <div className="text-xs text-muted-foreground">{record.plant.species}</div>
                  <div className="text-xs text-muted-foreground">
                    报告人: {record.reportedBy.name}
                  </div>
                </TableCell>
                <TableCell>{record.reportDate}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={record.symptoms}>
                    {record.symptoms}
                  </div>
                </TableCell>
                <TableCell>
                  {record.diagnosis ? (
                    <div className="max-w-[200px] truncate" title={record.diagnosis}>
                      {record.diagnosis}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">暂无诊断</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[record.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[record.status]?.label || record.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/diagnosis/${record.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    {record.status === "pending" && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/diagnosis/${record.id}/diagnose`}>
                          <IconStethoscope className="h-4 w-4 mr-1" />
                          诊断
                        </Link>
                      </Button>
                    )}
                    {(record.status === "diagnosed" || record.status === "treated") && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/diagnosis/${record.id}/edit`}>
                          <IconEdit className="h-4 w-4 mr-1" />
                          编辑
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
