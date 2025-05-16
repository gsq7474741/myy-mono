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
import { formatCurrency } from "@/lib/utils/index";
import Link from "next/link";
import { IconEdit, IconEye } from "@tabler/icons-react";

// 模拟数据
const plants = [
  {
    id: "p1",
    name: "红枫",
    species: "Acer palmatum",
    variety: "Atropurpureum",
    specifications: { height: 250, diameter: 15, crownWidth: 180 },
    age: 5,
    value: 1200,
    status: "healthy",
    location: "A区-12号",
    categoryName: "落叶乔木",
  },
  {
    id: "p2",
    name: "银杏",
    species: "Ginkgo biloba",
    variety: null,
    specifications: { height: 300, diameter: 20, crownWidth: 200 },
    age: 8,
    value: 2500,
    status: "healthy",
    location: "B区-05号",
    categoryName: "落叶乔木",
  },
  {
    id: "p3",
    name: "紫薇",
    species: "Lagerstroemia indica",
    variety: "紫色",
    specifications: { height: 180, diameter: 12, crownWidth: 150 },
    age: 4,
    value: 800,
    status: "treatment",
    location: "C区-08号",
    categoryName: "落叶灌木",
  },
  {
    id: "p4",
    name: "黄杨",
    species: "Buxus sinica",
    variety: null,
    specifications: { height: 100, diameter: 8, crownWidth: 80 },
    age: 3,
    value: 500,
    status: "healthy",
    location: "D区-15号",
    categoryName: "常绿灌木",
  },
  {
    id: "p5",
    name: "雪松",
    species: "Cedrus deodara",
    variety: null,
    specifications: { height: 400, diameter: 25, crownWidth: 250 },
    age: 10,
    value: 3800,
    status: "healthy",
    location: "A区-03号",
    categoryName: "常绿乔木",
  },
];

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  healthy: { label: "健康", className: "bg-green-100 text-green-800" },
  treatment: { label: "治疗中", className: "bg-yellow-100 text-yellow-800" },
  sick: { label: "病害", className: "bg-red-100 text-red-800" },
  dormant: { label: "休眠", className: "bg-blue-100 text-blue-800" },
};

export function PlantsList() {
  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>种类</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>价值</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>位置</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell className="font-medium">{plant.name}</TableCell>
                <TableCell>
                  <div>{plant.species}</div>
                  <div className="text-xs text-muted-foreground">{plant.categoryName}</div>
                </TableCell>
                <TableCell>
                  <div>高度: {plant.specifications.height}cm</div>
                  <div>胸径: {plant.specifications.diameter}cm</div>
                </TableCell>
                <TableCell>{formatCurrency(plant.value)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[plant.status]?.className || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusMap[plant.status]?.label || plant.status}
                  </span>
                </TableCell>
                <TableCell>{plant.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/plants/${plant.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/plants/${plant.id}/edit`}>
                        <IconEdit className="h-4 w-4 mr-1" />
                        编辑
                      </Link>
                    </Button>
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
