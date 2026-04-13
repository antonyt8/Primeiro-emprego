import { motion } from "framer-motion";
import { Activity, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Inscricoes ativas", value: "3", icon: Briefcase, tone: "text-primary" },
  { label: "Analises pendentes", value: "2", icon: Clock, tone: "text-warning" },
  { label: "Documentos aprovados", value: "8", icon: CheckCircle2, tone: "text-success" },
  { label: "Novas notificacoes", value: "5", icon: Activity, tone: "text-accent" },
];

const PanelState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Painel</h2>
      <p className="text-sm text-muted-foreground">Resumo geral da sua participacao no programa.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
              </div>
              <item.icon className={`h-5 w-5 ${item.tone}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Atualizacoes recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Seu perfil foi atualizado com sucesso.</p>
        <p>Documento "Comprovativo de morada" esta em analise.</p>
        <p>Nova convocatoria disponivel para resposta.</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default PanelState;
