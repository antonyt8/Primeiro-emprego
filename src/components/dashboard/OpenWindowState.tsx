import { useMemo } from "react";
import { motion } from "framer-motion";
import { User, AlertTriangle, ChevronRight, TrendingUp, Calendar, FileText, Timer } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { applicationsApi } from "@/api/applicationsApi";
import { programApi } from "@/api/programApi";
import { toast } from "@/components/ui/sonner";
import { queryKeys } from "@/lib/queryKeys";
import { HttpError } from "@/api/http";
import { useSession } from "@/lib/session";

const CURRENT_PROGRAM_ID = "edital-01-2026";

interface OpenWindowStateProps {
  onGoToProfile: () => void;
}

const OpenWindowState = ({ onGoToProfile }: OpenWindowStateProps) => {
  const { authReady, isAuthenticated } = useSession();
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: () => programApi.getProfile(),
    enabled: authReady && isAuthenticated,
    retry: (failureCount, error) => {
      const status = error instanceof HttpError ? error.status : undefined;
      if (status === 401 || status === 403 || status === 419) return false;
      return failureCount < 2;
    },
  });

  const profile = useMemo(
    () => (profileData && "profile" in profileData ? profileData.profile : profileData ?? null),
    [profileData]
  );

  const hasAcademicData = Boolean(profile?.institution_id && profile?.course_id);

  const createApplicationMutation = useMutation({
    mutationFn: () => {
      const institutionId = profile?.institution_id;
      const courseId = profile?.course_id;

      if (!institutionId || !courseId) {
        throw new Error("Complete os dados academicos no perfil antes de concluir a inscricao.");
      }

      return applicationsApi.createApplication({
        program_id: CURRENT_PROGRAM_ID,
        edital_id: CURRENT_PROGRAM_ID,
        institution_id: institutionId,
        course_id: courseId,
      });
    },
    onSuccess: () => {
      toast.success("Inscricao enviada com sucesso.");
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.processStatus });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Nao foi possivel concluir a inscricao.";
      toast.error(message);
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    {/* Countdown banner */}
    <Card className="border-accent/30 bg-accent/5 shadow-md">
      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-accent" />
            <span className="font-semibold text-accent">Edital 01/2026 — Inscrições Abertas</span>
          </div>
          <p className="text-sm text-muted-foreground">Encerram em 5 dias, 14 horas e 32 minutos</p>
        </div>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow"
          onClick={() => createApplicationMutation.mutate()}
          disabled={createApplicationMutation.isPending || !hasAcademicData}
        >
          {createApplicationMutation.isPending ? "Enviando..." : "Concluir Inscricao"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>

    {!hasAcademicData && (
      <Card className="border-warning/40 bg-warning/5">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Complete instituicao e curso no perfil para habilitar a conclusao da inscricao.
          </p>
          <Button variant="outline" onClick={onGoToProfile}>Ir para Perfil</Button>
        </CardContent>
      </Card>
    )}

    {/* Profile health */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Saúde do Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Completude do perfil</span>
          <span className="text-sm font-semibold text-primary">75%</span>
        </div>
        <Progress value={75} className="h-3" />
        <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-warning-foreground">Pendência:</span>{" "}
            <span className="text-muted-foreground">Comprovativo de matrícula em falta</span>
          </div>
          <Button size="sm" variant="outline" className="ml-auto shrink-0 rounded-lg text-xs">
            Resolver
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Quick cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Período Atual</p>
              <p className="font-semibold text-foreground">6º Período</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CR Validado</p>
              <p className="font-semibold text-foreground">8.45</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documentos</p>
              <p className="font-semibold text-foreground">3 de 4 enviados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </motion.div>
  );
};

export default OpenWindowState;
