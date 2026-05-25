import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applicationsApi, type ApplicationResponse } from "@/api/applicationsApi";
import { programApi, type CatalogItem } from "@/api/programApi";
import { getApiErrorMessage } from "@/lib/api-error";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [institutions, setInstitutions] = useState<CatalogItem[]>([]);
  const [courses, setCourses] = useState<CatalogItem[]>([]);
  const [institutionId, setInstitutionId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [listResponse, institutionList, courseList] = await Promise.all([
          applicationsApi.listApplications(),
          programApi.getInstitutions(),
          programApi.getCourses(),
        ]);
        setApplications(listResponse.data ?? []);
        setInstitutions(institutionList);
        setCourses(courseList);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const created = await applicationsApi.createApplication({
        program_id: programId || undefined,
        institution_id: institutionId,
        course_id: courseId,
      });
      setApplications((current) => [created, ...current]);
      setProgramId("");
      setInstitutionId("");
      setCourseId("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Já existe uma inscrição ativa ou os dados informados são inválidos."));
    } finally {
      setSaving(false);
    }
  };

  let listContent = <EmptyState title="Nenhuma inscrição encontrada" description="Crie uma nova inscrição para começar o acompanhamento." />;
  if (loading) {
    listContent = <p className="text-sm text-muted-foreground">Carregando inscrições.</p>;
  } else if (applications.length > 0) {
    listContent = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.id}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>{new Date(application.created_at).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/app/inscricoes/${application.id}/historico`}>Histórico</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Inscrições"
      description="Abra uma nova inscrição, acompanhe o histórico e navegue até a linha do tempo de cada processo."
      actions={<Button asChild variant="outline"><Link to="/app/inscricoes/novo/historico">Ver histórico modelo</Link></Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Nova inscrição</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="program_id">Edital / programa</Label>
              <Input id="program_id" value={programId} onChange={(event) => setProgramId(event.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution_id">Instituição</Label>
              <select id="institution_id" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={institutionId} onChange={(event) => setInstitutionId(event.target.value)}>
                <option value="">Selecione</option>
                {institutions.map((institution) => <option key={institution.id} value={institution.id}>{institution.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso</Label>
              <select id="course_id" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                <option value="">Selecione</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
              </select>
            </div>

            {error ? <p className="md:col-span-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={saving}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {saving ? "Enviando..." : "Criar inscrição"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Minhas inscrições</CardTitle>
        </CardHeader>
        <CardContent>
          {listContent}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ApplicationsPage;