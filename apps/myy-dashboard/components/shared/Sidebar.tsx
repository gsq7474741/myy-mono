"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconPlant2, 
  IconPackage, 
  IconShoppingCart, 
  IconCoin, 
  IconTool, 
  IconStethoscope,
  IconHome 
} from "@tabler/icons-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

const NavItem = ({ href, icon, title }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar/80 hover:text-sidebar-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex flex-col items-start gap-0 font-semibold">
          <div className="flex items-center gap-2">
            <IconPlant2 size={24} />
            <span>木易销</span>
          </div>
          <span className="text-xs text-sidebar-foreground/70 pl-7">园林销售管理系统</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-1">
          <NavItem href="/dashboard" icon={<IconHome size={20} />} title="仪表盘" />
          <NavItem href="/plants" icon={<IconPlant2 size={20} />} title="苗木资产" />
          <NavItem href="/inventory" icon={<IconPackage size={20} />} title="库存管理" />
          <NavItem href="/sales" icon={<IconShoppingCart size={20} />} title="销售管理" />
          <NavItem href="/finances" icon={<IconCoin size={20} />} title="财务管理" />
          <NavItem href="/maintenance" icon={<IconTool size={20} />} title="养护服务" />
          <NavItem href="/diagnosis" icon={<IconStethoscope size={20} />} title="远程诊断" />
        </div>
      </div>
    </div>
  );
}
