import { useState } from "react";
import SectionPage from "@/components/layout/SectionPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/api/adminApi";
import { getApiErrorMessage } from "@/lib/api-error";

const PositionCalculatorPage = () => {
  const [candidateId, setCandidateId] = useState("");
  const [editalId, setEditalId] = useState("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const response = await adminApi.calculatePosition({ candidate_id: candidateId, edital_id: editalId });
      setResult(`Posição atual: ${response.current_position ?? "-"} | Posição futura: ${response.future_position ?? "-"}`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionPage eyebrow="Admin" title="Calcular posição futura" description="Veja a projeção de posição de um candidato em um edital específico.">
      <Card>
        <CardHeader>
          <CardTitle>Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="candidate_id">Candidato</Label>
              <Input id="candidate_id" value={candidateId} onChange={(event) => setCandidateId(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edital_id">Edital</Label>
              <Input id="edital_id" value={editalId} onChange={(event) => setEditalId(event.target.value)} />
            </div>

            {error || result ? <p className={`md:col-span-2 rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{error || result}</p> : null}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading}>{loading ? "Calculando..." : "Calcular"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default PositionCalculatorPage;