import type { ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, FileText, Home, LayoutDashboard, LogOut, Settings2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";

interface NavigationItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const candidateNavigation: NavigationItem[] = [
  { to: "/app/status-processo", label: "Status", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/app/perfil", label: "Perfil", icon: <User className="h-4 w-4" /> },
  { to: "/app/elegibilidade", label: "Elegibilidade", icon: <Shield className="h-4 w-4" /> },
  { to: "/app/inscricoes", label: "Inscrições", icon: <Home className="h-4 w-4" /> },
  { to: "/app/documentos", label: "Documentos", icon: <FileText className="h-4 w-4" /> },
  { to: "/app/notificacoes", label: "Notificações", icon: <Bell className="h-4 w-4" /> },
];

const adminNavigation: NavigationItem[] = [
  { to: "/admin/dashboard-convocacoes", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/admin/convocacoes", label: "Convocações", icon: <Home className="h-4 w-4" /> },
  { to: "/admin/convocacoes/simulacao", label: "Simulação", icon: <Shield className="h-4 w-4" /> },
  { to: "/admin/convocacoes/posicao", label: "Posição", icon: <User className="h-4 w-4" /> },
  { to: "/admin/webhooks", label: "Webhooks", icon: <Settings2 className="h-4 w-4" /> },
  { to: "/admin/relatorios", label: "Relatórios", icon: <FileText className="h-4 w-4" /> },
];

const AppShell = ({ children }: { children?: ReactNode }) => {
  const { pathname } = useLocation();
  const { role, logout, user } = useSession();
  const navigation = pathname.startsWith("/admin") ? adminNavigation : candidateNavigation;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Primeiro Emprego AL</p>
            <h1 className="text-lg font-semibold text-foreground">{role === "admin" ? "Portal Administrativo" : "Área do Candidato"}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{user?.name ?? "Usuário"}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-3xl border bg-card p-4 shadow-sm">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main id="conteudo-principal" className="min-w-0">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppShell;