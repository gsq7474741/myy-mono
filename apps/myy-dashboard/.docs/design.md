# 园林销售企业管理系统设计文档

## 1. 需求描述

### 1.1 项目背景
园林销售企业需要一个集中管理系统，用于跟踪苗木资产、销售流程、库存变化、财务记录以及养护服务，以提高运营效率和决策质量。

### 1.2 核心需求
1. **苗木资产管理**：建立完整的苗木数字化档案，包括基础信息、生长状态、价值评估和唯一标识
2. **进销存管理**：追踪所有苗木的采购、销售、库存变动，支持批次管理和盘点功能
3. **财务记账**：记录所有业务相关财务数据，包括收支管理、发票管理和财务报表
4. **养护订单管理**：创建和跟踪苗木养护计划、工单分配和执行记录
5. **远程诊断工单**：支持客户远程咨询、植物问题诊断和解决方案提供

### 1.3 用户角色
- 管理员：系统全部功能访问权限
- 库存管理员：负责苗木入库、出库、调拨、盘点
- 销售人员：负责客户管理、订单处理
- 财务人员：负责财务记录、账目管理
- 技术/养护人员：负责养护服务和远程诊断

## 2. 系统设计

### 2.1 技术架构
- **前端框架**：Next.js 14+ with App Router
- **开发语言**：TypeScript
- **UI框架**：shadcn/ui + Tailwind CSS v4
- **渲染模式**：服务端渲染(SSR)
- **API路由**：Next.js API Routes
- **数据库**：Prisma ORM + PostgreSQL
- **认证**：NextAuth.js
- **状态管理**：React Context + SWR/React Query
- **文件存储**：Vercel Blob Storage / AWS S3
- **部署**：Vercel / Docker

### 2.2 项目结构
```
/app
  /api                    # API路由
  /(auth)                 # 认证相关页面
  /(dashboard)            # 受保护的应用页面
    /plants               # 苗木资产管理
    /inventory            # 库存管理
    /sales                # 销售管理
    /finances             # 财务管理
    /maintenance          # 养护服务
    /diagnosis            # 远程诊断
  /layout.tsx             # 应用布局
/components
  /ui                     # shadcn/ui组件
  /shared                 # 通用组件
  /forms                  # 表单组件
  /plants                 # 苗木相关组件
  /inventory              # 库存相关组件 
  ...                     # 其他模块组件
/lib
  /actions                # 服务器操作（Server Actions）
  /hooks                  # 自定义钩子
  /utils                  # 工具函数
  /validations            # 表单验证
  /db                     # 数据库配置
/prisma
  schema.prisma           # Prisma模型定义
/public                   # 静态资源
```

### 2.3 核心模块设计

#### 2.3.1 苗木资产管理模块
- **功能点**：
  - 苗木档案建立与维护
  - 苗木分类与标签管理
  - 苗木状态追踪
  - 苗木价值评估
  - 苗木位置管理

- **数据模型**（Prisma Schema）：
```prisma
model Plant {
  id           String   @id @default(cuid())
  name         String
  species      String
  variety      String?
  specifications Json    // 高度、胸径、冠幅等
  age          Int?
  source       String?
  value        Decimal  @db.Decimal(10, 2)
  status       String
  location     String?
  images       PlantImage[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  inventory    Inventory?
  category     Category @relation(fields: [categoryId], references: [id])
  categoryId   String
  statusRecords PlantStatusRecord[]
  maintenanceRecords MaintenanceRecord[]
}

model PlantImage {
  id        String   @id @default(cuid())
  url       String
  plant     Plant    @relation(fields: [plantId], references: [id])
  plantId   String
  createdAt DateTime @default(now())
}

model Category {
  id          String   @id @default(cuid())
  name        String
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  plants      Plant[]
  description String?
}

model PlantStatusRecord {
  id          String   @id @default(cuid())
  plant       Plant    @relation(fields: [plantId], references: [id])
  plantId     String
  recordDate  DateTime @default(now())
  status      String
  description String?
  recordedBy  User     @relation(fields: [userId], references: [id])
  userId      String
}
```

#### 2.3.2 进销存管理模块
- **功能点**：
  - 入库管理：采购入库, 调拨入库
  - 出库管理：销售出库, 调拨出库, 报废出库
  - 库存查询：实时库存, 库存预警
  - 盘点管理：定期盘点, 盘点差异处理

- **数据模型**：
```prisma
model Inventory {
  id          String   @id @default(cuid())
  plant       Plant    @relation(fields: [plantId], references: [id])
  plantId     String   @unique
  quantity    Int
  location    String?
  updatedAt   DateTime @updatedAt
  inboundRecords InboundRecordItem[]
  outboundRecords OutboundRecordItem[]
  inventoryChecks InventoryCheckItem[]
}

model InboundRecord {
  id          String   @id @default(cuid())
  type        String   // purchase, transfer
  date        DateTime @default(now())
  operator    User     @relation(fields: [userId], references: [id])
  userId      String
  supplier    String?
  batchNumber String?
  totalAmount Decimal  @db.Decimal(10, 2)
  items       InboundRecordItem[]
  status      String   @default("completed")
}

model InboundRecordItem {
  id            String   @id @default(cuid())
  inboundRecord InboundRecord @relation(fields: [recordId], references: [id])
  recordId      String
  inventory     Inventory @relation(fields: [inventoryId], references: [id])
  inventoryId   String
  quantity      Int
  unitPrice     Decimal  @db.Decimal(10, 2)
}

model OutboundRecord {
  id          String   @id @default(cuid())
  type        String   // sale, transfer, discard
  date        DateTime @default(now())
  operator    User     @relation(fields: [userId], references: [id])
  userId      String
  customer    Customer? @relation(fields: [customerId], references: [id])
  customerId  String?
  order       Order?    @relation(fields: [orderId], references: [id])
  orderId     String?
  items       OutboundRecordItem[]
  status      String   @default("completed")
}

model OutboundRecordItem {
  id            String   @id @default(cuid())
  outboundRecord OutboundRecord @relation(fields: [recordId], references: [id])
  recordId      String
  inventory     Inventory @relation(fields: [inventoryId], references: [id])
  inventoryId   String
  quantity      Int
  unitPrice     Decimal  @db.Decimal(10, 2)
}

model InventoryCheck {
  id          String   @id @default(cuid())
  checkDate   DateTime @default(now())
  operator    User     @relation(fields: [userId], references: [id])
  userId      String
  status      String   // planned, in-progress, completed
  items       InventoryCheckItem[]
  notes       String?
}

model InventoryCheckItem {
  id            String   @id @default(cuid())
  check         InventoryCheck @relation(fields: [checkId], references: [id])
  checkId       String
  inventory     Inventory @relation(fields: [inventoryId], references: [id])
  inventoryId   String
  systemQuantity Int
  actualQuantity Int
  difference    Int
  notes         String?
}
```

#### 2.3.3 财务管理模块
- **功能点**：
  - 收入记录：销售收入, 服务收入
  - 支出记录：采购支出, 运营支出
  - 发票管理：发票开具, 发票查询
  - 账目报表：收支明细, 利润报表

- **数据模型**：
```prisma
model FinancialRecord {
  id          String   @id @default(cuid())
  type        String   // income, expense
  amount      Decimal  @db.Decimal(10, 2)
  date        DateTime @default(now())
  category    String
  relatedOrderId String?
  order       Order?   @relation(fields: [relatedOrderId], references: [id])
  relatedInboundId String?
  inbound     InboundRecord? @relation(fields: [relatedInboundId], references: [id])
  recorder    User     @relation(fields: [userId], references: [id])
  userId      String
  notes       String?
  invoices    Invoice[]
}

model Invoice {
  id          String   @id @default(cuid())
  invoiceNumber String  @unique
  type        String   // regular, special
  issueDate   DateTime @default(now())
  customer    Customer? @relation(fields: [customerId], references: [id])
  customerId  String?
  amount      Decimal  @db.Decimal(10, 2)
  status      String   // issued, canceled, invalid
  financialRecord FinancialRecord? @relation(fields: [recordId], references: [id])
  recordId    String?
}

model Account {
  id          String   @id @default(cuid())
  name        String
  type        String   // cash, bank, other
  balance     Decimal  @db.Decimal(10, 2)
  updatedAt   DateTime @updatedAt
  transactions Transaction[]
}

model Transaction {
  id          String   @id @default(cuid())
  account     Account  @relation(fields: [accountId], references: [id])
  accountId   String
  amount      Decimal  @db.Decimal(10, 2)
  type        String   // deposit, withdrawal
  date        DateTime @default(now())
  description String?
  operator    User     @relation(fields: [userId], references: [id])
  userId      String
}
```

#### 2.3.4 养护服务模块
- **功能点**：
  - 养护计划管理：定期养护计划, 临时养护计划
  - 养护工单管理：工单创建, 工单分配, 工单执行
  - 养护记录查询：按苗木, 按时间, 按执行人

- **数据模型**：
```prisma
model MaintenancePlan {
  id          String   @id @default(cuid())
  name        String
  type        String   // regular, special
  startDate   DateTime
  endDate     DateTime?
  frequency   String?  // daily, weekly, monthly
  status      String   // active, completed, canceled
  workOrders  MaintenanceWorkOrder[]
  createdBy   User     @relation(fields: [userId], references: [id])
  userId      String
}

model MaintenanceWorkOrder {
  id          String   @id @default(cuid())
  plan        MaintenancePlan? @relation(fields: [planId], references: [id])
  planId      String?
  title       String
  description String
  assignee    User     @relation("AssignedWorkOrders", fields: [assigneeId], references: [id])
  assigneeId  String
  creator     User     @relation("CreatedWorkOrders", fields: [creatorId], references: [id])
  creatorId   String
  scheduledDate DateTime
  completedDate DateTime?
  status      String   // pending, in-progress, completed, canceled
  records     MaintenanceRecord[]
}

model MaintenanceRecord {
  id          String   @id @default(cuid())
  workOrder   MaintenanceWorkOrder @relation(fields: [workOrderId], references: [id])
  workOrderId String
  plant       Plant    @relation(fields: [plantId], references: [id])
  plantId     String
  content     String
  performer   User     @relation(fields: [userId], references: [id])
  userId      String
  executionDate DateTime @default(now())
  images      MaintenanceImage[]
}

model MaintenanceImage {
  id          String   @id @default(cuid())
  url         String
  record      MaintenanceRecord @relation(fields: [recordId], references: [id])
  recordId    String
  uploadedAt  DateTime @default(now())
}
```

#### 2.3.5 远程诊断模块
- **功能点**：
  - 诊断请求管理：客户问题提交, 图片/视频上传
  - 诊断工单分配：专家分配, 优先级管理
  - 诊断方案提供：问题分析, 解决方案
  - 诊断记录管理：历史诊断记录, 知识积累

- **数据模型**：
```prisma
model DiagnosisRequest {
  id          String   @id @default(cuid())
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  String
  issue       String
  description String
  urgency     String   // low, medium, high
  status      String   // pending, in-progress, resolved, closed
  submittedAt DateTime @default(now())
  media       DiagnosisMedia[]
  workOrder   DiagnosisWorkOrder?
}

model DiagnosisMedia {
  id          String   @id @default(cuid())
  request     DiagnosisRequest @relation(fields: [requestId], references: [id])
  requestId   String
  type        String   // image, video
  url         String
  uploadedAt  DateTime @default(now())
}

model DiagnosisWorkOrder {
  id          String   @id @default(cuid())
  request     DiagnosisRequest @relation(fields: [requestId], references: [id])
  requestId   String   @unique
  expert      User     @relation(fields: [expertId], references: [id])
  expertId    String
  diagnosis   String?
  solution    String?
  completedAt DateTime?
  status      String   // assigned, in-progress, completed
  knowledgeBase KnowledgeBase?
}

model KnowledgeBase {
  id          String   @id @