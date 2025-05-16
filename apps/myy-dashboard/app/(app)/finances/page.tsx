import { InvoicesList } from "@/components/finances/InvoicesList";
import { PaymentsList } from "@/components/finances/PaymentsList";
import { ExpensesList } from "@/components/finances/ExpensesList";
import { FinanceFilters } from "@/components/finances/FinanceFilters";
import { FinanceSummary } from "@/components/finances/FinanceSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">财务管理</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/finances/expenses/new">记录支出</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/finances/reports">财务报表</Link>
          </Button>
        </div>
      </div>
      
      <FinanceSummary />
      
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">发票管理</TabsTrigger>
          <TabsTrigger value="payments">收款记录</TabsTrigger>
          <TabsTrigger value="expenses">支出记录</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <FinanceFilters type="invoice" />
          <InvoicesList />
        </TabsContent>
        <TabsContent value="payments">
          <FinanceFilters type="payment" />
          <div className="mt-4">
            <PaymentsList />
          </div>
        </TabsContent>
        <TabsContent value="expenses">
          <FinanceFilters type="expense" />
          <div className="mt-4">
            <ExpensesList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
