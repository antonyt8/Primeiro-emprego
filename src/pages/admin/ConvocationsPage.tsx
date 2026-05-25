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

type SelectedRow = Record<string, unknown>;

const ConvocationsPage = () => {
  const [form, setForm] = useState({ edital_id: "", curso_id: "", orgao_id: "", quantidade: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedRows, setSelectedRows] = useState<SelectedRow[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await adminApi.createConvocation({
        edital_id: form.edital_id,
        curso_id: form.curso_id,
        orgao_id: form.orgao_id,
        quantidade: Number(form.quantidade),
      });
      setMessage(response.message ?? `Lote convocado com ${response.total_convocados ?? form.quantidade} candidatos.`);
      setSelectedRows([]);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionPage eyebrow="Admin" title="Convocar lote" description="Informe edital, curso, órgão e quantidade para disparar uma convocação operacional.">
      <Card>
        <CardHeader>
          <CardTitle>Nova convocação</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
            {[
              ["edital_id", "Edital"],
              ["curso_id", "Curso"],
              ["orgao_id", "Órgão"],
              ["quantidade", "Quantidade"],
            ].map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{label}</Label>
                <Input id={field} value={form[field as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} type={field === "quantidade" ? "number" : "text"} />
              </div>
            ))}

            {(error || message) ? <p className={`xl:col-span-4 rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{error || message}</p> : null}

            <div className="xl:col-span-4 flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Convocando..." : "Convocar"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selecionados</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRows.length === 0 ? (
            <EmptyState title="Nenhum selecionado ainda" description="Após a convocação, esta grade exibirá posição, categoria da vaga e categoria do candidato." />
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
                    <TableCell>{String(row.vacancy_category ?? "-")}</TableCell>
                    <TableCell>{String(row.candidate_category ?? "-")}</TableCell>
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

export default ConvocationsPage;