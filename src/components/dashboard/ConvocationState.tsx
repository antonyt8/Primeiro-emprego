import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConvocationStateProps {
  onRefuse: () => void;
}

const ConvocationState = ({ onRefuse }: ConvocationStateProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    {/* Alert banner */}
    <div className="rounded-lg bg-accent p-3 text-center text-sm font-semibold text-accent-foreground animate-pulse-soft">
      🔔 Tem uma nova convocatória! Responda antes do prazo limite.
    </div>

    {/* Vacancy card */}
    <Card className="border-2 border-primary shadow-lg">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg">Estágio em TI — SEPLAG</CardTitle>
            <p className="text-sm text-muted-foreground">Secretaria de Estado do Planejamento</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">Órgão</p>
            <p className="font-medium text-foreground">SEPLAG</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">Carga Horária</p>
            <p className="font-medium text-foreground">20h semanais</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">Bolsa</p>
            <p className="font-medium text-foreground">R$ 1.200,00</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-3">
            <p className="text-xs text-accent">Prazo para Resposta</p>
            <p className="font-bold text-accent text-lg">2 dias 18h restantes</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row pt-2">
          <Button className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-base shadow-lg">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Aceitar Vaga e Ver Documentos
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 border-destructive/50 text-destructive hover:bg-destructive/10 rounded-lg"
            onClick={onRefuse}
          >
            <XCircle className="mr-2 h-5 w-5" />
            Recusar Vaga
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default ConvocationState;
