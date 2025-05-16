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
import { IconEdit, IconEye, IconArrowUp, IconArrowDown } from "@tabler/icons-react";

// 模拟数据
const inventoryItems = [
  {
    id: "inv1",
    plantId: "p1",
    plantName: "红枫",
    species: "Acer palmatum",
    quantity: 25,
    location: "A区-12号",
    unitValue: 1200,
    categoryName: "落叶乔木",
    lastUpdated: "2025-03-28",
  },
  {
    id: "inv2",
    plantId: "p2",
    plantName: "银杏",
    species: "Ginkgo biloba",
    quantity: 18,
    location: "B区-05号",
    unitValue: 2500,
    categoryName: "落叶乔木",
    lastUpdated: "2025-03-25",
  },
  {
    id: "inv3",
    plantId: "p3",
    plantName: "紫薇",
    species: "Lagerstroemia indica",
    quantity: 32,
    location: "C区-08号",
    unitValue: 800,
    categoryName: "落叶灌木",
    lastUpdated: "2025-03-30",
  },
  {
    id: "inv4",
    plantId: "p4",
    plantName: "黄杨",
    species: "Buxus sinica",
    quantity: 45,
    location: "D区-15号",
    unitValue: 500,
    categoryName: "常绿灌木",
    lastUpdated: "2025-03-29",
  },
  {
    id: "inv5",
    plantId: "p5",
    plantName: "雪松",
    species: "Cedrus deodara",
    quantity: 12,
    location: "A区-03号",
    unitValue: 3800,
    categoryName: "常绿乔木",
    lastUpdated: "2025-03-27",
  },
];

export function InventoryList() {
  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>苗木名称</TableHead>
              <TableHead>种类</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  数量
                  <div className="flex flex-col">
                    <IconArrowUp className="h-3 w-3" />
                    <IconArrowDown className="h-3 w-3" />
                  </div>
                </div>
              </TableHead>
              <TableHead>单价</TableHead>
              <TableHead>总价值</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>最后更新</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.plantName}</TableCell>
                <TableCell>
                  <div>{item.species}</div>
                  <div className="text-xs text-muted-foreground">{item.categoryName}</div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unitValue)}</TableCell>
                <TableCell>{formatCurrency(item.unitValue * item.quantity)}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/inventory/${item.id}`}>
                        <IconEye className="h-4 w-4 mr-1" />
                        查看
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/inventory/${item.id}/edit`}>
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
