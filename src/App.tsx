import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PortalAccessibility from "@/components/accessibility/PortalAccessibility";
import { authApi } from "@/api/authApi";
import { getAuthToken, getAuthUser, clearSession, subscribeAuthSession } from "@/lib/auth";
import { SessionContext } from "@/lib/session";
import { useEffect, useMemo, useState } from "react";
import Index from "./pages/Index.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import FaqPage from "./pages/FaqPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import AccessibilityPage from "./pages/AccessibilityPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppShell from "@/components/layout/AppShell";
import { RequireRole, AccessDeniedView } from "@/components/routing/RouteGuards";
import ProfilePage from "./pages/candidate/ProfilePage";
import ElegibilityPage from "./pages/candidate/ElegibilityPage";
import ApplicationsPage from "./pages/candidate/ApplicationsPage";
import ApplicationHistoryPage from "./pages/candidate/ApplicationHistoryPage";
import DocumentsPage from "./pages/candidate/DocumentsPage";
import NotificationsPage from "./pages/candidate/NotificationsPage";
import ProcessStatusPage from "./pages/candidate/ProcessStatusPage";
import ConvocationsDashboardPage from "./pages/admin/ConvocationsDashboardPage";
import ConvocationsPage from "./pages/admin/ConvocationsPage";
import ConvocationSimulationPage from "./pages/admin/ConvocationSimulationPage";
import PositionCalculatorPage from "./pages/admin/PositionCalculatorPage";
import WebhooksPage from "./pages/admin/WebhooksPage";
import ReportsPage from "./pages/admin/ReportsPage";

const queryClient = new QueryClient();

type SessionState = "loading" | "authenticated" | "unauthenticated";

const defaultPathForRole = (role: string | null) => (role === "admin" ? "/admin/dashboard-convocacoes" : "/app/status-processo");

const AuthPageRoute = () => {
  const user = getAuthUser();

  if (user) {
    return <Navigate to={defaultPathForRole(user.role ?? null)} replace />;
  }

  return <AuthPage />;
};

const RoleRedirect = () => {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={defaultPathForRole(user.role ?? null)} replace />;
};

const App = () => {
  const [sessionState, setSessionState] = useState<SessionState>(getAuthUser() ? "authenticated" : "loading");
  const [currentUser, setCurrentUser] = useState(getAuthUser());

  const sessionValue = useMemo(
    () => ({
      authReady: sessionState !== "loading",
      isAuthenticated: Boolean(currentUser),
      user: currentUser,
      role: currentUser?.role ?? null,
      setIsAuthenticated: (value: boolean) => {
        if (!value) {
          clearSession();
          setCurrentUser(null);
          setSessionState("unauthenticated");
          return;
        }

        const nextUser = getAuthUser();
        setCurrentUser(nextUser);
        setSessionState(nextUser ? "authenticated" : "unauthenticated");
      },
      logout: () => authApi.logout(),
    }),
    [currentUser, sessionState]
  );

  useEffect(() => {
    const syncFromStorage = () => {
      const user = getAuthUser();
      setCurrentUser(user);
      setSessionState(user ? "authenticated" : "unauthenticated");
    };

    const unsubscribe = subscribeAuthSession(syncFromStorage);

    const bootstrapSession = async () => {
      try {
        if (getAuthToken()) {
          await authApi.me();
        }
      } catch {
        clearSession();
      } finally {
        syncFromStorage();
      }
    };

    void bootstrapSession();

    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SessionContext.Provider value={sessionValue}>
          <PortalAccessibility />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthPageRoute />} />
              <Route path="/cadastro" element={<AuthPageRoute />} />
              <Route path="/auth" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<RoleRedirect />} />
              <Route
                path="/app"
                element={
                  <RequireRole allowedRoles={["candidate"]}>
                    <AppShell />
                  </RequireRole>
                }
              >
                <Route index element={<Navigate to="status-processo" replace />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="elegibilidade" element={<ElegibilityPage />} />
                <Route path="inscricoes" element={<ApplicationsPage />} />
                <Route path="inscricoes/:id/historico" element={<ApplicationHistoryPage />} />
                <Route path="documentos" element={<DocumentsPage />} />
                <Route path="notificacoes" element={<NotificationsPage />} />
                <Route path="status-processo" element={<ProcessStatusPage />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <RequireRole allowedRoles={["admin"]}>
                    <AppShell />
                  </RequireRole>
                }
              >
                <Route index element={<Navigate to="dashboard-convocacoes" replace />} />
                <Route path="convocacoes" element={<ConvocationsPage />} />
                <Route path="convocacoes/simulacao" element={<ConvocationSimulationPage />} />
                <Route path="convocacoes/posicao" element={<PositionCalculatorPage />} />
                <Route path="dashboard-convocacoes" element={<ConvocationsDashboardPage />} />
                <Route path="webhooks" element={<WebhooksPage />} />
                <Route path="relatorios" element={<ReportsPage />} />
              </Route>
              <Route path="/acesso-negado" element={<AccessDeniedView />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
              <Route path="/acessibilidade" element={<AccessibilityPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SessionContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
