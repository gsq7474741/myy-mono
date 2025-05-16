import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft, IconEdit, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils/index";
import Link from "next/link";

// 模拟数据获取函数
async function getInventoryItem(id: string) {
  // 实际项目中应从数据库获取
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
        contact: "张经理",
        phone: "13912345678"
      },
      status: "normal",
      minStock: 10,
      maxStock: 50,
      images: ["/demo/plant1.jpg", "/demo/plant2.jpg"],
      transactions: [
        {
          id: "tr1",
          type: "inbound",
          date: "2025-03-15",
          quantity: 10,
          unitPrice: 1200,
          totalPrice: 12000,
          source: "采购入库",
          operator: "李库管",
          notes: "春季补货"
        },
        {
          id: "tr2",
          type: "inbound",
          date: "2025-03-20",
          quantity: 20,
          unitPrice: 1200,
          totalPrice: 24000,
          source: "采购入库",
          operator: "李库管",
          notes: "客户订单备货"
        },
        {
          id: "tr3",
          type: "outbound",
          date: "2025-03-25",
          quantity: 5,
          unitPrice: 1200,
          totalPrice: 6000,
          source: "销售出库",
          operator: "王库管",
          notes: "客户订单#SO-2025-0325"
        }
      ],
      stockChanges: [
        { date: "2025-03-10", quantity: 0 },
        { date: "2025-03-15", quantity: 10 },
        { date: "2025-03-20", quantity: 30 },
        { date: "2025-03-25", quantity: 25 },
        { date: "2025-03-30", quantity: 25 }
      ]
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
        contact: "李经理",
        phone: "15887654321"
      },
      status: "normal",
      minStock: 5,
      maxStock: 30,
      images: ["/demo/plant3.jpg"],
      transactions: [
        {
          id: "tr4",
          type: "inbound",
          date: "2025-03-10",
          quantity: 20,
          unitPrice: 2500,
          totalPrice: 50000,
          source: "采购入库",
          operator: "李库管",
          notes: "春季主要品种补货"
        },
        {
          id: "tr5",
          type: "outbound",
          date: "2025-03-22",
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000,
          source: "销售出库",
          operator: "王库管",
          notes: "客户订单#SO-2025-0322"
        }
      ],
      stockChanges: [
        { date: "2025-03-05", quantity: 0 },
        { date: "2025-03-10", quantity: 20 },
        { date: "2025-03-22", quantity: 18 },
        { date: "2025-03-30", quantity: 18 }
      ]
    }
  ];
  
  return items.find(item => item.id === id) || null;
}

// 状态映射
const statusMap: Record<string, { label: string; className: string }> = {
  normal: { label: "正常", className: "bg-green-100 text-green-800" },
  low: { label: "库存不足", className: "bg-yellow-100 text-yellow-800" },
  excess: { label: "库存过量", className: "bg-blue-100 text-blue-800" },
  critical: { label: "库存紧急", className: "bg-red-100 text-red-800" },
};

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const item = await getInventoryItem((await params).id);
  
  if (!item) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">库存项不存在</h2>
        <p className="mt-2 text-muted-foreground">找不到ID为 {(await params).id} 的库存项</p>
        <Button asChild className="mt-4">
          <Link href="/inventory">返回库存管理</Link>
        </Button>
      </div>
    );
  }
  
  // 确定库存状态
  let status = "normal";
  if (item.quantity <= item.minStock) {
    status = item.quantity <= Math.floor(item.minStock / 2) ? "critical" : "low";
  } else if (item.quantity >= item.maxStock) {
    status = "excess";
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/inventory">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{item.plantName} 库存详情</h1>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="text-muted-foreground">{item.species}</p>
          <p className="mt-1">
            <span className="font-medium">类别:</span> {item.categoryName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/inventory/inbound/new?plantId=${item.plantId}`}>
              <IconArrowDown className="h-4 w-4 mr-1" />
              入库登记
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/inventory/outbound/new?plantId=${item.plantId}`}>
              <IconArrowUp className="h-4 w-4 mr-1" />
              出库登记
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/inventory/${(await params).id}/edit`}>
              <IconEdit className="h-4 w-4 mr-1" />
              编辑信息
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>库存信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">当前库存</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{item.quantity}</span>
                <Badge className={statusMap[status]?.className || "bg-gray-100"}>
                  {statusMap[status]?.label || status}
                </Badge>
              </div>
              
              <div className="text-muted-foreground">库存单价</div>
              <div>{formatCurrency(item.unitValue)}</div>
              
              <div className="text-muted-foreground">库存总值</div>
              <div className="font-medium">{formatCurrency(item.unitValue * item.quantity)}</div>
              
              <div className="text-muted-foreground">库存位置</div>
              <div>{item.location}</div>
              
              <div className="text-muted-foreground">最低库存</div>
              <div>{item.minStock}</div>
              
              <div className="text-muted-foreground">最高库存</div>
              <div>{item.maxStock}</div>
              
              <div className="text-muted-foreground">最后更新</div>
              <div>{item.lastUpdated}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>供应商信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">供应商名称</div>
              <div>
                <Link href={`/inventory/suppliers/${item.supplier.id}`} className="hover:underline text-primary">
                  {item.supplier.name}
                </Link>
              </div>
              
              <div className="text-muted-foreground">联系人</div>
              <div>{item.supplier.contact}</div>
              
              <div className="text-muted-foreground">联系电话</div>
              <div>{item.supplier.phone}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>苗木信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">苗木ID</div>
              <div>
                <Link href={`/plants/${item.plantId}`} className="hover:underline text-primary">
                  {item.plantId}
                </Link>
              </div>
              
              <div className="text-muted-foreground">描述</div>
              <div className="col-span-2 text-sm">{item.description}</div>
            </div>
            
            {item.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {item.images.map((image, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${item.plantName} 图片 ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">库存交易记录</TabsTrigger>
          <TabsTrigger value="chart">库存变化趋势</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>交易记录</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">日期</th>
                    <th className="text-left py-2 font-medium">类型</th>
                    <th className="text-left py-2 font-medium">数量</th>
                    <th className="text-left py-2 font-medium">单价</th>
                    <th className="text-left py-2 font-medium">总金额</th>
                    <th className="text-left py-2 font-medium">来源/去向</th>
                    <th className="text-left py-2 font-medium">操作人</th>
                    <th className="text-left py-2 font-medium">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {item.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-2">{transaction.date}</td>
                      <td className="py-2">
                        <Badge 
                          className={
                            transaction.type === "inbound" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {transaction.type === "inbound" ? "入库" : "出库"}
                        </Badge>
                      </td>
                      <td className="py-2">
                        {transaction.type === "inbound" ? "+" : "-"}{transaction.quantity}
                      </td>
                      <td className="py-2">{formatCurrency(transaction.unitPrice)}</td>
                      <td className="py-2">{formatCurrency(transaction.totalPrice)}</td>
                      <td className="py-2">{transaction.source}</td>
                      <td className="py-2">{transaction.operator}</td>
                      <td className="py-2">{transaction.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>库存变化趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* 在实际项目中，这里应该使用图表库如Chart.js或Recharts */}
                <div className="h-full flex items-end justify-between gap-2 border-b border-l relative">
                  {/* Y轴标签 */}
                  <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
                    <span>{Math.max(...item.stockChanges.map(sc => sc.quantity))}</span>
                    <span>{Math.floor(Math.max(...item.stockChanges.map(sc => sc.quantity)) / 2)}</span>
                    <span>0</span>
                  </div>
                  
                  {/* 柱状图 */}
                  {item.stockChanges.map((change, index) => {
                    const maxQuantity = Math.max(...item.stockChanges.map(sc => sc.quantity));
                    const height = maxQuantity > 0 ? (change.quantity / maxQuantity) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-primary rounded-t"
                          style={{ height: `${height}%` }}
                        />
                        <div className="mt-2 text-xs text-muted-foreground">{change.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
