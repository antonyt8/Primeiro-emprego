import { useEffect, useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { DashboardSidebar, navItems } from "@/components/dashboard/DashboardSidebar";
import type { DashboardNavState } from "@/components/dashboard/DashboardSidebar";
import PanelState from "@/components/dashboard/PanelState";
import ProfileState from "@/components/dashboard/ProfileState";
import DocumentsState from "@/components/dashboard/DocumentsState";
import NotificationsState from "@/components/dashboard/NotificationsState";
import OpenWindowState from "@/components/dashboard/OpenWindowState";
import TalentBankState from "@/components/dashboard/TalentBankState";
import ConvocationState from "@/components/dashboard/ConvocationState";
import AdmissionState from "@/components/dashboard/AdmissionState";
import RefuseModal from "@/components/dashboard/RefuseModal";
import { authApi } from "@/api/authApi";
import { applicationsApi } from "@/api/applicationsApi";
import { getAuthUser } from "@/lib/auth";

type DashboardProcessState = "open-window" | "talent-bank" | "convocation" | "admission";

const stateOptions: { id: DashboardProcessState; label: string }[] = [
  { id: "open-window", label: "Inscrições Abertas" },
  { id: "talent-bank", label: "Banco de Talentos" },
  { id: "convocation", label: "Convocatória" },
  { id: "admission", label: "Admissão" },
];

const DashboardPage = () => {
  const [navState, setNavState] = useState<DashboardNavState>("panel");
  const [processState, setProcessState] = useState<DashboardProcessState>("open-window");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refuseModalOpen, setRefuseModalOpen] = useState(false);
  const [userName, setUserName] = useState(getAuthUser()?.name ?? "Candidato");

  useEffect(() => {
    const loadSession = async () => {
      try {
        const me = await authApi.me();
        setUserName(me.name);
      } catch {
        return;
      }

      try {
        const process = await applicationsApi.getProcessStatus();
        if (process.status === "open_window") setProcessState("open-window");
        if (process.status === "talent_bank") setProcessState("talent-bank");
        if (process.status === "convocation") setProcessState("convocation");
        if (process.status === "admission") setProcessState("admission");
      } catch {
        // Keep default process state when status endpoint is unavailable.
      }
    };

    void loadSession();
  }, []);

  const handleSelectNav = (nextState: DashboardNavState) => {
    setNavState(nextState);
    setSidebarOpen(false);
    setRefuseModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar active={navState} onSelect={handleSelectNav} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu lateral"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <span className="font-bold text-primary text-sm">PE-AL</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    navState === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => handleSelectNav(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Olá,</span>
            <span className="text-sm font-semibold text-foreground"> {userName} </span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </header>

        {/* State switcher - demo only */}
        <div className="border-b bg-card px-4 py-2 md:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navState === "panel" && stateOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => setProcessState(s.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  processState === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <main id="conteudo-principal" className="flex-1 p-4 md:p-6 space-y-6">
          {navState === "panel" && <PanelState />}
          {navState === "profile" && <ProfileState />}
          {navState === "docs" && <DocumentsState />}
          {navState === "notifications" && <NotificationsState />}

          {navState === "panel" && (
            <>
              {processState === "open-window" && <OpenWindowState onGoToProfile={() => handleSelectNav("profile")} />}
              {processState === "talent-bank" && <TalentBankState />}
              {processState === "convocation" && <ConvocationState onRefuse={() => setRefuseModalOpen(true)} />}
              {processState === "admission" && <AdmissionState />}
            </>
          )}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t bg-card" aria-label="Navegação principal">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleSelectNav(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 ${
                navState === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <RefuseModal open={refuseModalOpen} onOpenChange={setRefuseModalOpen} />
    </div>
  );
};

export default DashboardPage;
