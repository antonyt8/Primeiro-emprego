import { useEffect, useMemo, useState } from "react";
import SectionPage from "@/components/layout/SectionPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi, type ReportRow } from "@/api/adminApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const toCsv = (rows: ReportRow[]) => {
  const header = "label,total,fulfilled";
  const body = rows.map((row) => `${row.label},${row.total},${row.fulfilled}`).join("\n");
  return [header, body].join("\n");
};

const ReportsPage = () => {
  const [filter, setFilter] = useState("");
  const [convocationRows, setConvocationRows] = useState<ReportRow[]>([]);
  const [quotaRows, setQuotaRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedFilter = useDebouncedValue(filter, 350);

  useEffect(() => {
    const load = async () => {
      try {
        const [convocations, quota] = await Promise.all([
          adminApi.getConvocationReports(debouncedFilter || undefined),
          adminApi.getQuotaFulfillmentReports(debouncedFilter || undefined),
        ]);
        setConvocationRows(convocations.rows ?? []);
        setQuotaRows(quota.rows ?? []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [debouncedFilter]);

  const summary = useMemo(
    () => [
      { label: "Convocações", value: convocationRows.length },
      { label: "Categorias", value: quotaRows.length },
      { label: "Filtro", value: debouncedFilter || "Todos" },
    ],
    [convocationRows.length, debouncedFilter, quotaRows.length],
  );

  const exportCsv = () => {
    const csv = toCsv([...convocationRows, ...quotaRows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = globalThis.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "relatorios-convocacao.csv";
    anchor.click();
    globalThis.URL.revokeObjectURL(url);
  };

  return (
    <SectionPage
      eyebrow="Admin"
      title="Relatórios analíticos"
      description="Veja tabelas resumidas, exporte CSV e compare o cumprimento por categoria no cliente."
      actions={<Button variant="outline" onClick={exportCsv}>Exportar CSV</Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Filtro por edital</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Digite o edital para filtrar" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{item.value}</CardContent>
          </Card>
        ))}
      </div>

      {loading ? <Card><CardContent className="p-6 text-sm text-muted-foreground">Carregando relatórios.</CardContent></Card> : null}
      {error ? <Card><CardContent className="p-6 text-sm text-destructive">{error}</CardContent></Card> : null}

      <Card>
        <CardHeader>
          <CardTitle>Convocações por edital/curso</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Cumprido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {convocationRows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.fulfilled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cumprimento por categoria de vaga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quotaRows.map((row) => (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">{row.fulfilled}/{row.total}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${row.total ? Math.round((row.fulfilled / row.total) * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ReportsPage;