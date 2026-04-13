import { motion } from "framer-motion";
import { User, AlertTriangle, ChevronRight, TrendingUp, Calendar, FileText, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const OpenWindowState = () => (
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
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow">
          Concluir Inscrição
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>

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

export default OpenWindowState;
