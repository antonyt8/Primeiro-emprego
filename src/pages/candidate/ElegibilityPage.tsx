import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { programApi } from "@/api/programApi";
import { HttpError } from "@/api/http";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CatalogItem } from "@/api/programApi";

const ElegibilityPage = () => {
  const [institutions, setInstitutions] = useState<CatalogItem[]>([]);
  const [courses, setCourses] = useState<CatalogItem[]>([]);
  const [period, setPeriod] = useState("1");
  const [institutionId, setInstitutionId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [institutionList, courseList] = await Promise.all([programApi.getInstitutions(), programApi.getCourses()]);
        setInstitutions(institutionList);
        setCourses(courseList);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadCatalogs();
  }, []);

  const handleCheck = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChecking(true);
    setError("");
    setResult(null);

    try {
      const response = await programApi.checkEligibility({ institution_id: institutionId, course_id: courseId, period });
      setResult(response.eligible ? "Você está elegível para prosseguir." : response.reason ?? "Não elegível no momento.");
    } catch (requestError) {
      if (requestError instanceof HttpError && requestError.status === 422) {
        setResult(getApiErrorMessage(requestError, "Sua inscrição foi considerada inelegível."));
      } else {
        setError(getApiErrorMessage(requestError));
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Verificação de elegibilidade"
      description="Confirme instituição, curso e período antes de enviar uma inscrição ao processo seletivo."
    >
      <Card>
        <CardHeader>
          <CardTitle>Dados de elegibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando catálogos públicos.</p>
          ) : null}
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCheck}>
            <div className="space-y-2">
              <Label htmlFor="institution">Instituição</Label>
              <select id="institution" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={institutionId} onChange={(event) => setInstitutionId(event.target.value)}>
                <option value="">Selecione</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>{institution.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <select id="course" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                <option value="">Selecione</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="period">Período</Label>
              <Input id="period" type="number" min={1} max={20} value={period} onChange={(event) => setPeriod(event.target.value)} />
            </div>

            {(error || result) && (
              <div className={`md:col-span-2 rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                {error || result}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={checking}>
                <Search className="mr-2 h-4 w-4" />
                {checking ? "Verificando..." : "Verificar elegibilidade"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <EmptyState
        title="Fluxo guiado"
        description="Ao receber uma negativa 422, mostramos a razão retornada pela API para orientar a próxima ação do candidato."
      />
    </SectionPage>
  );
};

export default ElegibilityPage;