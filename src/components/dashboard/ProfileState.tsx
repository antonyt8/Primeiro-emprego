import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PROFILE_STORAGE_KEY = "dashboard-profile-data";

const initialProfile = {
  fullName: "Antony Thiago",
  email: "antony@email.com",
  phone: "(82) 99999-9999",
  cpf: "000.000.000-00",
  institution: "UFAL",
  course: "Ciencia da Computacao",
};

const ProfileState = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as typeof initialProfile;
      setProfile(parsed);
      setSavedProfile(parsed);
    } catch {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  }, []);

  const handleSave = () => {
    if (!profile.fullName.trim() || !profile.email.trim()) {
      setErrorMessage("Nome e e-mail sao obrigatorios.");
      setSavedMessage("");
      return;
    }

    setSavedProfile(profile);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setEditing(false);
    setSavedMessage("Dados salvos com sucesso.");
    setErrorMessage("");
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
        {!editing ? (
          <Button onClick={() => setEditing(true)}>Editar</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        )}
      </div>

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
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={profile.email}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
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
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, cpf: e.target.value }))}
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
            <Input
              value={profile.institution}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, institution: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Curso</label>
            <Input
              value={profile.course}
              readOnly={!editing}
              onChange={(e) => setProfile((prev) => ({ ...prev, course: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileState;
