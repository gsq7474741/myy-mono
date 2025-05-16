import { notFound } from "next/navigation";
import EditInventoryForm from "@/components/inventory/EditInventoryForm";

// 从数据库获取库存项
async function getInventoryItem(id: string) {
  // 实际项目中应从数据库获取
  // 这里使用模拟数据
  const items = [
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
      description: "三年生红枫，高度约1.5米，冠幅约1米",
      supplier: {
        id: "sup1",
        name: "江苏绿林苗圃",
      },
      minStock: 10,
      maxStock: 50,
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
      description: "五年生银杏，高度约2.5米，胸径约8厘米",
      supplier: {
        id: "sup2",
        name: "山东泰山苗木基地",
      },
      minStock: 5,
      maxStock: 30,
    }
  ];
  
  return items.find(item => item.id === id) || null;
}

// 从数据库获取供应商列表
async function getSuppliers() {
  // 实际项目中应从数据库获取
  // 这里使用模拟数据
  return [
    { id: "sup1", name: "江苏绿林苗圃" },
    { id: "sup2", name: "山东泰山苗木基地" },
    { id: "sup3", name: "浙江花卉基地" },
    { id: "sup4", name: "安徽绿色家园" },
    { id: "sup5", name: "广东热带植物基地" },
  ];
}

export default async function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  // 并行获取数据
  const [item, suppliers] = await Promise.all([
    getInventoryItem((await params).id),
    getSuppliers(),
  ]);
  
  // 如果找不到库存项，返回404
  if (!item) {
    notFound();
  }
  
  return <EditInventoryForm item={item} suppliers={suppliers} />;
}
