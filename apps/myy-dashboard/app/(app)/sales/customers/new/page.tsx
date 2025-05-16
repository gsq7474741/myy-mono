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
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconUserPlus } from "@tabler/icons-react";

// 模拟创建客户
async function createCustomer(data: any) {
  console.log("创建客户数据", data);
  // 实际项目中应调用API创建数据
  return { success: true, customerId: "cust" + Date.now() };
}

export default function NewCustomerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    type: "company", // company, individual, government
    level: "regular", // vip, regular, new
    contact: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
    bankName: "",
    bankAccount: "",
    notes: "",
    hasTaxInfo: false,
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
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 构建提交数据
      const submitData = {
        ...formData,
        // 如果没有税务信息，则不提交相关字段
        ...(formData.hasTaxInfo ? {} : { taxNumber: "", bankName: "", bankAccount: "" }),
        // 添加创建时间
        createdAt: new Date().toISOString().split("T")[0],
        // 添加联系人信息
        contacts: [
          {
            name: formData.contact,
            position: formData.position,
            phone: formData.phone,
            email: formData.email,
            isPrimary: true
          }
        ],
        // 初始化统计数据
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
      };
      
      const result = await createCustomer(submitData);
      
      if (result.success) {
        router.push(`/sales/customers/${result.customerId}`);
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
          <Link href="/sales/customers">
            <IconArrowLeft className="h-4 w-4 mr-1" />
            返回客户列表
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">新增客户</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  客户名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="公司名称或个人姓名"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">
                  客户类型 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">企业客户</SelectItem>
                    <SelectItem value="individual">个人客户</SelectItem>
                    <SelectItem value="government">政府单位</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="level" className="block text-sm font-medium">
                  客户等级
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP客户</SelectItem>
                    <SelectItem value="regular">普通客户</SelectItem>
                    <SelectItem value="new">新客户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                地址 <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                required
                placeholder="详细地址"
              />
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
                placeholder="客户特殊需求或其他重要信息"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>联系人信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contact" className="block text-sm font-medium">
                  联系人姓名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="主要联系人姓名"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="position" className="block text-sm font-medium">
                  职位
                </label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="联系人职位"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="手机或固定电话"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  电子邮箱
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="电子邮箱地址"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>发票信息</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasTaxInfo" 
                  checked={formData.hasTaxInfo}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("hasTaxInfo", checked as boolean)
                  }
                />
                <label
                  htmlFor="hasTaxInfo"
                  className="text-sm font-medium leading-none"
                >
                  添加发票信息
                </label>
              </div>
            </div>
          </CardHeader>
          {formData.hasTaxInfo && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="taxNumber" className="block text-sm font-medium">
                    税号 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    required={formData.hasTaxInfo}
                    placeholder="统一社会信用代码"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bankName" className="block text-sm font-medium">
                    开户行 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required={formData.hasTaxInfo}
                    placeholder="开户银行名称"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bankAccount" className="block text-sm font-medium">
                    银行账号 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    required={formData.hasTaxInfo}
                    placeholder="银行账号"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/sales/customers">取消</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存客户"}
          </Button>
        </div>
      </form>
    </div>
  );
}
