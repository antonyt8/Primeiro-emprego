import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { applicationsApi } from "@/api/applicationsApi";
import { documentsApi } from "@/api/documentsApi";
import { HttpError } from "@/api/http";
import { notificationsApi } from "@/api/notificationsApi";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/lib/session";

interface PanelMetrics {
  activeApplications: number;
  pendingAnalyses: number;
  approvedDocuments: number;
  unreadNotifications: number;
}

const normalizeApplications = (
  response: Awaited<ReturnType<typeof applicationsApi.listApplications>>
) => response.data;

const normalizeDocuments = (
  response: Awaited<ReturnType<typeof documentsApi.listDocuments>>
) => (Array.isArray(response) ? response : response.data);

const normalizeNotifications = (
  response: Awaited<ReturnType<typeof notificationsApi.listNotifications>>
) => (Array.isArray(response) ? response : response.data);

const PanelState = () => {
  const { authReady, isAuthenticated } = useSession();
  const [metrics, setMetrics] = useState<PanelMetrics>({
    activeApplications: 0,
    pendingAnalyses: 0,
    approvedDocuments: 0,
    unreadNotifications: 0,
  });

  const metricsQuery = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: async () => {
      const [applicationsRes, documentsRes, notificationsRes] = await Promise.all([
        applicationsApi.listApplications({ page: 1, per_page: 50 }),
        documentsApi.listDocuments({ page: 1, per_page: 50 }),
        notificationsApi.listNotifications({ page: 1, per_page: 50 }),
      ]);

      const applications = normalizeApplications(applicationsRes);
      const documents = normalizeDocuments(documentsRes);
      const notifications = normalizeNotifications(notificationsRes);

      return {
        activeApplications: applications.filter((item) => item.status === "active").length,
        pendingAnalyses: documents.filter((item) => item.status === "pending").length,
        approvedDocuments: documents.filter((item) => item.status === "approved").length,
        unreadNotifications: notifications.filter((item) => !item.read).length,
      } satisfies PanelMetrics;
    },
    enabled: authReady && isAuthenticated,
    retry: (failureCount, error) => {
      const status = error instanceof HttpError ? error.status : undefined;
      if (status === 401 || status === 403 || status === 419) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (!metricsQuery.data) return;
    setMetrics(metricsQuery.data);
  }, [metricsQuery.data]);

  const loading = metricsQuery.isLoading;

  const stats = useMemo(
    () => [
      { label: "Inscricoes ativas", value: String(metrics.activeApplications), icon: Briefcase, tone: "text-primary" },
      { label: "Analises pendentes", value: String(metrics.pendingAnalyses), icon: Clock, tone: "text-warning" },
      { label: "Documentos aprovados", value: String(metrics.approvedDocuments), icon: CheckCircle2, tone: "text-success" },
      { label: "Novas notificacoes", value: String(metrics.unreadNotifications), icon: Activity, tone: "text-accent" },
    ],
    [metrics]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Painel</h2>
        <p className="text-sm text-muted-foreground">Resumo geral da sua participacao no programa.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{loading ? "-" : item.value}</p>
                </div>
                <item.icon className={`h-5 w-5 ${item.tone}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atualizacoes recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Inscricoes ativas: {loading ? "carregando" : metrics.activeApplications}.</p>
          <p>Documentos pendentes de analise: {loading ? "carregando" : metrics.pendingAnalyses}.</p>
          <p>Notificacoes nao lidas: {loading ? "carregando" : metrics.unreadNotifications}.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PanelState;
