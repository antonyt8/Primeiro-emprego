import { Building2, Home, User, FileText, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type DashboardNavState = "panel" | "profile" | "docs" | "notifications";

export const navItems = [
  { icon: Home, label: "Painel", id: "panel" },
  { icon: User, label: "Perfil", id: "profile" },
  { icon: FileText, label: "Documentos", id: "docs" },
  { icon: Bell, label: "Notificações", id: "notifications" },
] as const;

interface DashboardSidebarProps {
  active: DashboardNavState;
  onSelect: (id: DashboardNavState) => void;
}

export const DashboardSidebar = ({ active, onSelect }: DashboardSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Building2 className="h-5 w-5 text-primary" />
        <span className="font-bold text-primary text-sm">Primeiro Emprego AL</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
};
