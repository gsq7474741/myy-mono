"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { useState } from "react";

// 模拟数据
const categories = [
  { id: "cat1", name: "落叶乔木" },
  { id: "cat2", name: "常绿乔木" },
  { id: "cat3", name: "落叶灌木" },
  { id: "cat4", name: "常绿灌木" },
  { id: "cat5", name: "藤本植物" },
  { id: "cat6", name: "地被植物" },
];

const locations = [
  { id: "loc1", name: "A区" },
  { id: "loc2", name: "B区" },
  { id: "loc3", name: "C区" },
  { id: "loc4", name: "D区" },
];

export function InventoryFilters() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索苗木名称、种类或位置..."
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <IconFilter className="h-4 w-4" />
          <span className="sr-only">筛选</span>
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="category">苗木分类</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">库存位置</Label>
            <Select>
              <SelectTrigger id="location">
                <SelectValue placeholder="选择位置" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部位置</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-quantity">最小数量</Label>
            <Input
              id="min-quantity"
              type="number"
              placeholder="最小数量"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-quantity">最大数量</Label>
            <Input
              id="max-quantity"
              type="number"
              placeholder="最大数量"
              min={0}
            />
          </div>

          <div className="md:col-span-3 lg:col-span-4 flex justify-end gap-2">
            <Button variant="outline">重置</Button>
            <Button>应用筛选</Button>
          </div>
        </div>
      )}
    </div>
  );
}
