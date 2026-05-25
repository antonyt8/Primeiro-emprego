import { useState } from "react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi } from "@/api/adminApi";
import { getApiErrorMessage } from "@/lib/api-error";

const ConvocationSimulationPage = () => {
  const [form, setForm] = useState({ edital_id: "", curso_id: "", quantidade: "" });
  const [selectedRows, setSelectedRows] = useState<Array<Record<string, unknown>>>([]);
  const [exhausted, setExhausted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.simulateConvocation({
        edital_id: form.edital_id,
        curso_id: form.curso_id,
        quantidade: Number(form.quantidade),
      });
      setSelectedRows(response.selected ?? []);
      setExhausted(Boolean(response.exhausted));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionPage eyebrow="Admin" title="Simulação de convocações" description="Projete próximos lotes antes de publicar a convocação oficial.">
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
            {[
              ["edital_id", "Edital"],
              ["curso_id", "Curso"],
              ["quantidade", "Quantidade"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{label}</Label>
                <Input id={field} type={field === "quantidade" ? "number" : "text"} value={form[field as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} />
              </div>
            ))}
            {error ? <p className="md:col-span-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Simulando..." : "Simular"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent>
          {exhausted ? <p className="mb-4 rounded-xl bg-warning/10 px-4 py-3 text-sm text-warning-foreground">O lote esgotou candidatos disponíveis.</p> : null}
          {selectedRows.length === 0 ? (
            <EmptyState title="Sem simulação ainda" description="A tabela de próximos convocados será exibida aqui." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Candidato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{String(row.position ?? index + 1)}</TableCell>
                    <TableCell>{String(row.vacancy_category ?? row.category ?? "-")}</TableCell>
                    <TableCell>{String(row.candidate_category ?? row.name ?? "-")}</TableCell>
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

export default ConvocationSimulationPage;