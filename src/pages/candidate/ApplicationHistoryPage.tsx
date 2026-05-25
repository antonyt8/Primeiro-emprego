import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applicationsApi, type ApplicationHistoryResponse } from "@/api/applicationsApi";
import { getApiErrorMessage } from "@/lib/api-error";

const ApplicationHistoryPage = () => {
  const { id } = useParams();
  const [history, setHistory] = useState<ApplicationHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setHistory(await applicationsApi.getApplicationHistory(id));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Histórico da inscrição"
      description="Acompanhe cada etapa registrada pela API para a inscrição selecionada."
      actions={<Button asChild variant="outline"><Link to="/app/inscricoes">Voltar</Link></Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando histórico.</p>
          ) : error ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
          ) : !history || history.events.length === 0 ? (
            <EmptyState title="Sem eventos registrados" description="Ainda não existem marcos para esta inscrição." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.event}</TableCell>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>{new Date(event.timestamp).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{event.description ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ApplicationHistoryPage;