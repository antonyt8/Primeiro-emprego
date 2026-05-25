import { useEffect, useState } from "react";
import SectionPage from "@/components/layout/SectionPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi, type ConvocationDashboardResponse } from "@/api/adminApi";
import { getApiErrorMessage } from "@/lib/api-error";

const ConvocationsDashboardPage = () => {
  const [dashboard, setDashboard] = useState<ConvocationDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setDashboard(await adminApi.getDashboard());
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const metrics = dashboard
    ? [
        { label: "Convocados", value: dashboard.total_convocados },
        { label: "Simulados", value: dashboard.total_simulados },
        { label: "Lotes abertos", value: dashboard.lotes_abertos },
        { label: "Cumprimento", value: `${dashboard.taxa_cumprimento}%` },
      ]
    : [];

  return (
    <SectionPage eyebrow="Admin" title="Dashboard de convocações" description="Monitore a operação com indicadores consolidados, sem sair da área administrativa.">
      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Carregando indicadores.</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{metric.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convocações por curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard?.by_course?.length ? dashboard.by_course.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, item.value)}%` }} />
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">Sem dados de distribuição disponíveis.</p>}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ConvocationsDashboardPage;