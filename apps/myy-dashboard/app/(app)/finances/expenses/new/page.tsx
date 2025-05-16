"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconArrowLeft, IconReceipt } from "@tabler/icons-react";
import { FormData } from "@/lib/types/common";

// 支出类别
const expenseCategories = [
  { id: "purchase", name: "采购支出" },
  { id: "salary", name: "工资薪酬" },
  { id: "rent", name: "租金物业" },
  { id: "utilities", name: "水电费用" },
  { id: "transport", name: "运输物流" },
  { id: "marketing", name: "市场营销" },
  { id: "maintenance", name: "设备维护" },
  { id: "office", name: "办公用品" },
  { id: "travel", name: "差旅费用" },
  { id: "other", name: "其他支出" }
];

// 支付方式
const paymentMethods = [
  { id: "bank", name: "银行转账" },
  { id: "cash", name: "现金" },
  { id: "wechat", name: "微信支付" },
  { id: "alipay", name: "支付宝" },
  { id: "pos", name: "POS机刷卡" },
  { id: "credit", name: "公司信用卡" }
];

// 模拟创建支出记录
async function createExpense(data: FormData) {
  console.log("创建支出记录", data);
  // 实际项目中应调用API创建数据
  return { success: true, expenseId: "exp" + Date.now() };
}

export default function NewExpensePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [hasReceipt, setHasReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paymentMethod: "bank",
    vendor: "",
    reference: "",
    notes: "",
    needApproval: true,
  });
  
  // 处理表单变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理复选框变更
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
      setHasReceipt(true);
    } else {
      setReceiptFile(null);
      setHasReceipt(false);
    }
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 验证必填字段
      if (!formData.category || !formData.amount || !formData.vendor) {
        alert("请填写所有必填字段");
        setSaving(false);
        return;
      }
      
      // 构建提交数据
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        expenseNumber: `EXP${formData.expenseDate.replace(/-/g, "")}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: formData.needApproval ? "pending" : "approved",
        createdBy: "当前用户", // 实际项目中应从用户会话获取
        approvedBy: formData.needApproval ? null : "当前用户",
        hasReceipt: hasReceipt,
        receiptFile: receiptFile ? {
          name: receiptFile.name,
          size: receiptFile.size,
          type: receiptFile.type
        } : null
      };
      
      const result = await createExpense(submitData);
      
      if (result.success) {
        router.push("/finances");
      }
    } catch (error) {
      console.error("保存失败", error);
      // 处理错误
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finances">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回财务管理
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">记录支出</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>支出信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  支出类别 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择支出类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium">
                  支出金额 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="请输入金额"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expenseDate" className="block text-sm font-medium">
                  支出日期 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="expenseDate"
                  name="expenseDate"
                  type="date"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-sm font-medium">
                  支付方式 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择支付方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="vendor" className="block text-sm font-medium">
                  供应商/收款方 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  placeholder="请输入供应商或收款方名称"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reference" className="block text-sm font-medium">
                  参考编号
                </label>
                <Input
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="发票号、合同号等参考编号"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium">
                备注
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="可选，添加支出相关说明"
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="needApproval" 
                  checked={formData.needApproval}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("needApproval", checked as boolean)
                  }
                />
                <label
                  htmlFor="needApproval"
                  className="text-sm font-medium leading-none"
                >
                  需要审批
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>上传凭证</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="receipt" className="block text-sm font-medium">
                凭证/发票扫描件
              </label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                支持JPG、PNG、PDF格式，文件大小不超过10MB
              </p>
            </div>
            
            {receiptFile && (
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconReceipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{receiptFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(receiptFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReceiptFile(null);
                    setHasReceipt(false);
                  }}
                >
                  移除
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/finances">取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存支出"}
          </Button>
        </div>
      </form>
    </div>
  );
}
