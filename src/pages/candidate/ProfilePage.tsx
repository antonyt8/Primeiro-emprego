import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { programApi } from "@/api/programApi";
import { getApiErrorMessage, getFieldErrors } from "@/lib/api-error";
import { useSession } from "@/lib/session";

const ProfilePage = () => {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fields, setFields] = useState({ phone: "", institution_id: "", course_id: "", period: "1", cr: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await programApi.getProfile();
        const candidateProfile = profile && "profile" in profile ? profile.profile : profile;

        if (!candidateProfile) {
          setNotFound(true);
          return;
        }

        setFields({
          phone: candidateProfile.phone ?? "",
          institution_id: candidateProfile.institution_id ?? "",
          course_id: candidateProfile.course_id ?? "",
          period: String(candidateProfile.period ?? 1),
          cr: candidateProfile.cr === null || candidateProfile.cr === undefined ? "" : String(candidateProfile.cr),
        });
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const summary = useMemo(
    () => [
      { label: "Usuário", value: user?.name ?? "Candidato" },
      { label: "E-mail", value: user?.email ?? "-" },
      { label: "Status", value: notFound ? "Primeiro preenchimento" : "Perfil carregado" },
    ],
    [notFound, user?.email, user?.name],
  );

  let content = null;
  if (loading) {
    content = (
      <Card>
        <CardHeader>
          <CardTitle>Carregando perfil</CardTitle>
        </CardHeader>
        <CardContent className="pb-6 text-sm text-muted-foreground">Buscando dados salvos.</CardContent>
      </Card>
    );
  } else if (notFound) {
    content = (
      <EmptyState icon={AlertCircle} title="Primeiro preenchimento" description="Seu perfil ainda não foi cadastrado. Preencha os campos abaixo para criar o registro inicial." />
    );
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setSaving(true);
      await programApi.updateProfile({
        phone: fields.phone,
        institution_id: fields.institution_id,
        course_id: fields.course_id,
        period: Number(fields.period),
        cr: fields.cr ? Number(fields.cr) : null,
      });
      setNotFound(false);
      setMessage("Perfil atualizado com sucesso.");
    } catch (requestError) {
      const fieldErrors = getFieldErrors(requestError);
      if (Object.keys(fieldErrors).length > 0) {
        setError(Object.values(fieldErrors)[0]);
      } else {
        setError(getApiErrorMessage(requestError));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Perfil do candidato"
      description="Mantenha seus dados acadêmicos e de contato atualizados para participar do processo sem inconsistências."
      actions={
        <>
          {summary.map((item) => (
            <Card key={item.label} className="min-w-40">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </>
      }
    >
      {content}

      <Card>
        <CardHeader>
          <CardTitle>Dados do perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={fields.phone} onChange={(event) => setFields((current) => ({ ...current, phone: event.target.value }))} placeholder="(82) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution_id">Instituição</Label>
              <Input id="institution_id" value={fields.institution_id} onChange={(event) => setFields((current) => ({ ...current, institution_id: event.target.value }))} placeholder="ID da instituição" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso</Label>
              <Input id="course_id" value={fields.course_id} onChange={(event) => setFields((current) => ({ ...current, course_id: event.target.value }))} placeholder="ID do curso" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Input id="period" type="number" min={1} max={20} value={fields.period} onChange={(event) => setFields((current) => ({ ...current, period: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr">CR</Label>
              <Input id="cr" type="number" step="0.01" value={fields.cr} onChange={(event) => setFields((current) => ({ ...current, cr: event.target.value }))} placeholder="3.50" />
            </div>

            {(error || message) && (
              <p className={`md:col-span-2 rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                {error || message}
              </p>
            )}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Salvando..." : "Salvar perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default ProfilePage;