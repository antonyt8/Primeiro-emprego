import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionPage from "@/components/layout/SectionPage";
import { applicationsApi, type ApplicationStatusResponse } from "@/api/applicationsApi";
import { getApiErrorMessage } from "@/lib/api-error";

const ProcessStatusPage = () => {
  const [status, setStatus] = useState<ApplicationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setStatus(await applicationsApi.getProcessStatus());
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Status do processo"
      description="Acompanhe a fase atual e a mensagem operacional mais recente retornada pela API."
    >
      <Card>
        <CardHeader>
          <CardTitle>Fase atual</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando status.</p>
          ) : error ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
          ) : status ? (
            <div className="space-y-3">
              <Badge>{status.status}</Badge>
              <p className="text-lg font-semibold">{status.stage}</p>
              <p className="text-sm text-muted-foreground">{status.message ?? "Sem mensagens adicionais."}</p>
              {status.deadline ? <p className="text-sm text-muted-foreground">Prazo: {new Date(status.deadline).toLocaleString("pt-BR")}</p> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ProcessStatusPage;