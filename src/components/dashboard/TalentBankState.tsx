import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TalentBankState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    {/* Status badge */}
    <Card className="border-success/30 bg-success/5">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/20">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">O seu perfil está ativo no Banco de Talentos</p>
          <p className="text-sm text-muted-foreground">Desde 15 de Janeiro de 2026</p>
        </div>
      </CardContent>
    </Card>

    {/* CR score */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Coeficiente de Rendimento Validado</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--success))" strokeWidth="8"
              strokeDasharray={`${84.5 * 2.51} ${100 * 2.51}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-2xl font-bold text-foreground">8.45</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Curso: Ciência da Computação</p>
          <p className="text-sm text-muted-foreground">Instituição: UFAL</p>
          <p className="text-sm text-muted-foreground">Período: 6º</p>
        </div>
      </CardContent>
    </Card>

    {/* Info card */}
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-start gap-3 p-6">
        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            A aguardar procura dos órgãos estatais para o curso de Ciência da Computação.
          </p>
          <p className="text-sm text-muted-foreground">
            Será notificado por e-mail e através deste painel quando surgir uma vaga compatível.
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default TalentBankState;
