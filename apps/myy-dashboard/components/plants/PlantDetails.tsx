"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/index";
import Image from "next/image";
import { IconPlant2, IconRuler, IconCalendar, IconCoin, IconMapPin } from "@tabler/icons-react";


// 模拟数据
const plantData = {
  id: "p1",
  name: "红枫",
  species: "Acer palmatum",
  variety: "Atropurpureum",
  specifications: { 
    height: 250, 
    diameter: 15, 
    crownWidth: 180 
  },
  age: 5,
  source: "江苏苗圃",
  value: 1200,
  status: "healthy",
  location: "A区-12号",
  categoryName: "落叶乔木",
  description: "红枫是一种落叶乔木，原产于日本、韩国和中国。其叶色随季节变化，春季为红色，夏季为绿色，秋季又转为鲜红色。是园林绿化中常用的观赏树种。",
  images: [
    "/placeholder-plant-1.jpg",
    "/placeholder-plant-2.jpg",
    "/placeholder-plant-3.jpg",
  ],
  createdAt: new Date(2024, 9, 15),
  updatedAt: new Date(2025, 3, 1),
};

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  healthy: { label: "健康", className: "bg-green-100 text-green-800" },
  treatment: { label: "治疗中", className: "bg-yellow-100 text-yellow-800" },
  sick: { label: "病害", className: "bg-red-100 text-red-800" },
  dormant: { label: "休眠", className: "bg-blue-100 text-blue-800" },
};

export function PlantDetails() {
  // 在实际应用中，这里会根据id从API获取苗木详情数据
  const plant = plantData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 苗木图片 */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
              <Image
                src={plant.images[0] || "/placeholder-image.jpg"}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {plant.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${plant.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{plant.name}</h2>
                <p className="text-muted-foreground">
                  {plant.species} {plant.variety ? `'${plant.variety}'` : ""}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  statusMap[plant.status]?.className || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusMap[plant.status]?.label || plant.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <IconPlant2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">分类</p>
                  <p>{plant.categoryName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconRuler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">规格</p>
                  <p>高度: {plant.specifications.height}cm, 胸径: {plant.specifications.diameter}cm</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">树龄</p>
                  <p>{plant.age} 年</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconCoin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">价值</p>
                  <p>{formatCurrency(plant.value)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">位置</p>
                  <p>{plant.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                  来源
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">来源</p>
                  <p>{plant.source || "未知"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">描述</h3>
              <p className="text-muted-foreground">{plant.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
