import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initialDocs = [
  { name: "RG (frente e verso)", status: "Aprovado", icon: CheckCircle2, tone: "text-success" },
  { name: "Comprovativo de morada", status: "Em analise", icon: Clock, tone: "text-warning" },
  { name: "Dados bancarios", status: "Rejeitado", icon: XCircle, tone: "text-destructive" },
];

const DocumentsState = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (fileName: string) => {
    if (!fileName) return;
    setDocs((prev) => [
      { name: fileName, status: "Em analise", icon: Clock, tone: "text-warning" },
      ...prev,
    ]);
    setMessage(`Arquivo "${fileName}" enviado com sucesso.`);
  };

  const handleRemove = (name: string) => {
    setDocs((prev) => prev.filter((doc) => doc.name !== name));
  };

  const handleResend = (name: string) => {
    setDocs((prev) => prev.map((doc) => (
      doc.name === name
        ? { ...doc, status: "Em analise", icon: Clock, tone: "text-warning" }
        : doc
    )));
    setMessage(`Documento "${name}" reenviado para analise.`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Documentos</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o status dos seus documentos enviados.</p>
        </div>
        <>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0]?.name ?? "")}
          />
          <Button onClick={() => fileInputRef.current?.click()}>Enviar documento</Button>
        </>
      </div>

      {message && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.name} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <doc.icon className={`h-4 w-4 ${doc.tone}`} />
                <span className="text-sm text-foreground">{doc.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={doc.tone}>{doc.status}</Badge>
                {doc.status === "Rejeitado" && (
                  <Button size="sm" variant="outline" onClick={() => handleResend(doc.name)}>Reenviar</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleRemove(doc.name)}>Remover</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocumentsState;
