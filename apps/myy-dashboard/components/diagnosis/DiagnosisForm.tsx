"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { IconPlus, IconX } from "@tabler/icons-react";
import Image from "next/image";

// 植物列表模拟数据
const plants = [
  { id: "p1", name: "红枫 (Acer palmatum)" },
  { id: "p2", name: "银杏 (Ginkgo biloba)" },
  { id: "p3", name: "紫薇 (Lagerstroemia indica)" },
  { id: "p4", name: "黄杨 (Buxus sinica)" },
  { id: "p5", name: "雪松 (Cedrus deodara)" },
];

// 表单类型
type DiagnosisFormProps = {
  initialData?: {
    id?: string;
    plantId?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    status?: string;
    images?: { url: string; caption: string }[];
    notes?: string;
  };
  type: "create" | "diagnose" | "edit";
  onSubmit: (data: any) => void;
};

export function DiagnosisForm({ initialData, type, onSubmit }: DiagnosisFormProps) {
  const [formData, setFormData] = useState({
    plantId: initialData?.plantId || "",
    symptoms: initialData?.symptoms || "",
    diagnosis: initialData?.diagnosis || "",
    treatment: initialData?.treatment || "",
    status: initialData?.status || (type === "create" ? "pending" : "diagnosed"),
    images: initialData?.images || [],
    notes: initialData?.notes || "",
  });
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageCaptions, setImageCaptions] = useState<string[]>([]);
  
  // 处理表单字段变化
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
      
      // 创建预览URL
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      
      // 为每个新图片添加空白标题
      setImageCaptions((prev) => [...prev, ...Array(files.length).fill("")]);
    }
  };
  
  // 处理图片标题变化
  const handleCaptionChange = (index: number, caption: string) => {
    const newCaptions = [...imageCaptions];
    newCaptions[index] = caption;
    setImageCaptions(newCaptions);
  };
  
  // 移除上传的图片
  const removeImage = (index: number) => {
    // 释放预览URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageCaptions((prev) => prev.filter((_, i) => i !== index));
  };
  
  // 移除已有图片
  const removeExistingImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  
  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 在实际应用中，这里应该处理图片上传到服务器
    // 然后将返回的URL添加到表单数据中
    
    // 模拟添加新图片
    const newImageData = imagePreviews.map((url, index) => ({
      url, // 在实际应用中，这应该是服务器返回的URL
      caption: imageCaptions[index] || `图片 ${index + 1}`,
      uploadedAt: new Date().toISOString().split("T")[0],
    }));
    
    const submissionData = {
      ...formData,
      images: [...(formData.images || []), ...newImageData],
    };
    
    onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {type === "create" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="plantId">选择植物</Label>
            <Select
              value={formData.plantId}
              onValueChange={(value) => handleChange("plantId", value)}
              required
            >
              <SelectTrigger id="plantId">
                <SelectValue placeholder="选择需要诊断的植物" />
              </SelectTrigger>
              <SelectContent>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="symptoms">症状描述</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              placeholder="请详细描述植物的异常症状..."
              rows={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="notes">附加说明</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="其他需要说明的情况，如近期养护情况、环境变化等..."
              rows={3}
            />
          </div>
        </div>
      )}
      
      {(type === "diagnose" || type === "edit") && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="diagnosis">诊断结果</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleChange("diagnosis", e.target.value)}
              placeholder="请输入诊断结果..."
              rows={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="treatment">处理方案</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => handleChange("treatment", e.target.value)}
              placeholder="请输入建议的处理方案..."
              rows={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">状态</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="选择诊断状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnosed">已诊断</SelectItem>
                <SelectItem value="treated">已处理</SelectItem>
                <SelectItem value="resolved">已解决</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* 图片上传部分 */}
      <div className="space-y-4">
        <Label>诊断图片</Label>
        
        {/* 已有图片展示 */}
        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <Card key={`existing-${index}`} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={image.url}
                    alt={image.caption}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeExistingImage(index)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm truncate">{image.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* 新上传图片预览 */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <Card key={`preview-${index}`} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={preview}
                    alt={`预览图片 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <Input
                    type="text"
                    placeholder="图片说明"
                    value={imageCaptions[index]}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* 图片上传按钮 */}
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <IconPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">
              <label htmlFor="image-upload" className="cursor-pointer font-medium text-primary hover:text-primary/80">
                点击上传图片
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
              <p>或拖放图片至此处</p>
            </div>
            <p className="text-xs text-muted-foreground">
              支持 JPG, PNG, GIF 格式，单张图片不超过 5MB
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button type="submit">
          {type === "create" ? "提交诊断申请" : type === "diagnose" ? "提交诊断结果" : "更新诊断信息"}
        </Button>
      </div>
    </form>
  );
}
