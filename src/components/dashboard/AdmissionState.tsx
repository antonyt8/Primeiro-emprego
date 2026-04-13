import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Upload, MessageCircle, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const documents = [
  { name: "RG (Frente e Verso)", status: "approved" as const },
  { name: "Comprovativo de Morada", status: "pending" as const },
  { name: "Dados Bancários", status: "rejected" as const, comment: "Imagem cortada, por favor reenvie com todos os dados visíveis." },
  { name: "Declaração de Matrícula", status: "empty" as const },
];

const statusConfig = {
  approved: { label: "Aprovado", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  pending: { label: "A aguardar Análise", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  rejected: { label: "Rejeitado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  empty: { label: "Pendente", icon: Upload, color: "text-muted-foreground", bg: "bg-muted" },
};

const AdmissionState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-foreground">Documentação para Admissão</h2>
      <p className="text-sm text-muted-foreground mt-1">Envie todos os documentos exigidos pelo órgão SEPLAG</p>
    </div>

    <div className="space-y-3">
      {documents.map((doc) => {
        const config = statusConfig[doc.status];
        return (
          <Card key={doc.name} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground truncate">{doc.name}</p>
                    <Badge variant="secondary" className={`shrink-0 text-xs ${config.color} ${config.bg} border-0`}>
                      {config.label}
                    </Badge>
                  </div>

                  {doc.status === "rejected" && doc.comment && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-destructive/5 p-2.5">
                      <MessageCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">{doc.comment}</p>
                    </div>
                  )}

                  {(doc.status === "empty" || doc.status === "rejected") && (
                    <div className="mt-3">
                      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-4 transition-colors hover:border-primary/50 hover:bg-primary/5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Upload className="h-4 w-4" />
                          <span>Arraste o ficheiro ou clique para selecionar</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground md:hidden">
                          <Camera className="h-3 w-3" />
                          <span>Ou tire uma foto</span>
                        </div>
                        <input type="file" className="hidden" accept="image/*,.pdf" capture="environment" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">Progresso da Documentação</p>
        <p className="text-xs text-muted-foreground">1 de 4 documentos aprovados</p>
      </div>
      <span className="text-2xl font-bold text-primary">25%</span>
    </div>
  </motion.div>
);

export default AdmissionState;
