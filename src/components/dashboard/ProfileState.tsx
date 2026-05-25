import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { programApi, type CatalogItem } from "@/api/programApi";
import { authApi } from "@/api/authApi";
import { getAuthUser } from "@/lib/auth";

interface ProfileForm {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  institutionId: string;
  courseId: string;
  period: string;
  cr: string;
}

const INITIAL_PROFILE: ProfileForm = {
  fullName: "",
  email: "",
  cpf: "",
  phone: "",
  institutionId: "",
  courseId: "",
  period: "",
  cr: "",
};

const ProfileState = () => {
  const [profile, setProfile] = useState<ProfileForm>(INITIAL_PROFILE);
  const [savedProfile, setSavedProfile] = useState<ProfileForm>(INITIAL_PROFILE);
  const [institutions, setInstitutions] = useState<CatalogItem[]>([]);
  const [courses, setCourses] = useState<CatalogItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [institutionData, courseData] = await Promise.all([
          programApi.getInstitutions(),
          programApi.getCourses(),
        ]);

        setInstitutions(institutionData);
        setCourses(courseData);

        const cachedUser = getAuthUser();
        let nextProfile: ProfileForm = {
          ...INITIAL_PROFILE,
          fullName: cachedUser?.name ?? "",
          email: cachedUser?.email ?? "",
          cpf: cachedUser?.cpf ?? "",
        };

        try {
          const me = await authApi.me();
          nextProfile = {
            ...nextProfile,
            fullName: me.name,
            email: me.email,
            cpf: me.cpf ?? "",
          };
        } catch {
          // Se o /auth/me falhar, mantem dados locais para evitar tela vazia.
        }

        const profileResponse = await programApi.getProfile();
        if (profileResponse) {
          const remoteProfile = "profile" in profileResponse ? profileResponse.profile : profileResponse;

          nextProfile = {
            ...nextProfile,
            phone: remoteProfile.phone ?? "",
            institutionId: remoteProfile.institution_id ?? "",
            courseId: remoteProfile.course_id ?? "",
            period: remoteProfile.period ? String(remoteProfile.period) : "",
            cr: typeof remoteProfile.cr === "number" ? String(remoteProfile.cr) : "",
          };
        }

        setProfile(nextProfile);
        setSavedProfile(nextProfile);
      } catch {
        setErrorMessage("Nao foi possivel carregar o perfil agora.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleSave = async () => {
    if (!profile.phone.trim() || !profile.institutionId || !profile.courseId || !profile.period) {
      setErrorMessage("Telefone, instituicao, curso e periodo sao obrigatorios.");
      setSavedMessage("");
      return;
    }

    const parsedPeriod = Number(profile.period);
    if (!Number.isInteger(parsedPeriod) || parsedPeriod < 1) {
      setErrorMessage("Periodo invalido.");
      setSavedMessage("");
      return;
    }

    const parsedCr = profile.cr.trim() ? Number(profile.cr) : null;
    if (parsedCr !== null && Number.isNaN(parsedCr)) {
      setErrorMessage("CR invalido.");
      setSavedMessage("");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      await programApi.updateProfile({
        phone: profile.phone.trim(),
        institution_id: profile.institutionId,
        course_id: profile.courseId,
        period: parsedPeriod,
        cr: parsedCr,
      });

      setSavedProfile(profile);
      setEditing(false);
      setSavedMessage("Dados salvos com sucesso.");
    } catch (error) {
      if (error instanceof HttpError) {
        const payload = (error.payload ?? {}) as { message?: string; reason?: string };
        setErrorMessage(payload.reason ?? payload.message ?? "Falha ao salvar dados do perfil.");
      } else {
        setErrorMessage("Falha ao salvar dados do perfil.");
      }
      setSavedMessage("");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditing(false);
    setSavedMessage("");
    setErrorMessage("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Perfil</h2>
          <p className="text-sm text-muted-foreground">Visualize e atualize seus dados cadastrais.</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>Salvar</Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>Editar</Button>
        )}
      </div>

      {loading && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">Carregando dados do perfil...</p>
      )}

      {savedMessage && (
        <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">{savedMessage}</p>
      )}
      {errorMessage && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome completo</label>
            <Input
              value={profile.fullName}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={profile.email}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <Input
              value={profile.phone}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CPF</label>
            <Input
              value={profile.cpf}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados academicos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Instituicao</label>
            <Select
              value={profile.institutionId}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, institutionId: value }))}
              disabled={!editing || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instituicao" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>{institution.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Curso</label>
            <Select
              value={profile.courseId}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, courseId: value }))}
              disabled={!editing || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Periodo</label>
            <Input
              value={profile.period}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, period: e.target.value.replace(/\D/g, "") }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CR</label>
            <Input
              value={profile.cr}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, cr: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileState;
