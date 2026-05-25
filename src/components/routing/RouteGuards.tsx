import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { useSession } from "@/lib/session";

export const AccessDeniedView = ({ title = "Sem permissão", description = "A sua conta não tem acesso a esta área." }: { title?: string; description?: string }) => (
  <EmptyState icon={ShieldAlert} title={title} description={description} />
);

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { authReady, isAuthenticated } = useSession();
  const location = useLocation();

  if (!authReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando sessão</CardTitle>
          <CardDescription>Estamos validando o acesso.</CardDescription>
        </CardHeader>
        <CardContent className="pb-6 text-sm text-muted-foreground">Aguarde um instante.</CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export const RequireRole = ({ allowedRoles, children }: { allowedRoles: Array<"candidate" | "admin">; children: ReactNode }) => {
  const { authReady, isAuthenticated, role } = useSession();
  const location = useLocation();

  if (!authReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando sessão</CardTitle>
          <CardDescription>Estamos validando o acesso.</CardDescription>
        </CardHeader>
        <CardContent className="pb-6 text-sm text-muted-foreground">Aguarde um instante.</CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!role || !allowedRoles.includes(role as "candidate" | "admin")) {
    return <AccessDeniedView description="Você não tem permissão para acessar esta rota." />;
  }

  return <>{children}</>;
};