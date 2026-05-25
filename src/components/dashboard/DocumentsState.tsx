import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documentsApi, type DocumentListResponse } from "@/api/documentsApi";
import { HttpError } from "@/api/http";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/lib/session";

interface DocumentWithIcon extends DocumentListResponse {
  icon: typeof CheckCircle2;
  tone: string;
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; tone: string; label: string }> = {
  approved: { icon: CheckCircle2, tone: "text-success", label: "Aprovado" },
  pending: { icon: Clock, tone: "text-warning", label: "Em analise" },
  rejected: { icon: XCircle, tone: "text-destructive", label: "Rejeitado" },
};

const normalizeDocuments = (response: DocumentListResponse[] | { data: DocumentListResponse[] }) =>
  Array.isArray(response) ? response : response.data;

const getStatusUi = (status: string) =>
  statusConfig[status] ?? { icon: Clock, tone: "text-muted-foreground", label: "Em analise" };

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (!(error instanceof HttpError) || typeof error.payload !== "object" || error.payload === null) {
    return fallback;
  }

  const payload = error.payload as {
    reason?: string;
    message?: string;
  };

  return payload.reason ?? payload.message ?? fallback;
};

const DocumentsState = () => {
  const { authReady, isAuthenticated } = useSession();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentsQuery = useQuery({
    queryKey: queryKeys.documents.list(1, 50),
    queryFn: () => documentsApi.listDocuments({ page: 1, per_page: 50 }),
    enabled: authReady && isAuthenticated,
    retry: (failureCount, error) => {
      const status = error instanceof HttpError ? error.status : undefined;
      if (status === 401 || status === 403 || status === 419) return false;
      return failureCount < 2;
    },
  });

  const docs: DocumentWithIcon[] = normalizeDocuments(documentsQuery.data ?? []).map((doc) => ({
    ...doc,
    ...getStatusUi(doc.status),
  }));

  useEffect(() => {
    if (documentsQuery.error) {
      setMessage({ text: "Erro ao carregar documentos.", type: "error" });
    }
  }, [documentsQuery.error]);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentsApi.uploadDocument(file),
    onSuccess: (response, file) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      setMessage({ text: `Arquivo "${file.name}" enviado com sucesso.`, type: "success" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      const errorMsg = extractErrorMessage(error, "Erro ao enviar documento.");
      setMessage({ text: errorMsg, type: "error" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ docId }: { docId: string }) => documentsApi.deleteDocument(docId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      setMessage({ text: `Documento "${variables.docName}" removido.`, type: "success" });
    },
    onError: () => {
      setMessage({ text: "Erro ao remover documento.", type: "error" });
    },
  });

  const resendMutation = useMutation({
    mutationFn: ({ docId }: { docId: string }) => documentsApi.resendDocument(docId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      setMessage({ text: `Documento "${variables.docName}" reenviado para analise.`, type: "success" });
    },
    onError: () => {
      setMessage({ text: "Erro ao reenviar documento.", type: "error" });
    },
  });

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;

    setMessage(null);
    await uploadMutation.mutateAsync(file);
  };

  const handleRemove = async (docId: string, docName: string) => {
    await removeMutation.mutateAsync({ docId, docName });
  };

  const handleResend = async (docId: string, docName: string) => {
    await resendMutation.mutateAsync({ docId, docName });
  };

  const busy = uploadMutation.isPending || removeMutation.isPending || resendMutation.isPending;

  let content: JSX.Element;

  if (documentsQuery.isLoading) {
    content = <p className="text-sm text-muted-foreground">Carregando documentos...</p>;
  } else if (docs.length === 0) {
    content = <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>;
  } else {
    content = (
      <>
        {docs.map((doc) => (
          <div key={doc.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <doc.icon className={`h-4 w-4 ${doc.tone}`} />
              <span className="text-sm text-foreground">{doc.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={doc.tone}>{getStatusUi(doc.status).label}</Badge>
              {doc.status === "rejected" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResend(doc.id, doc.name)}
                  disabled={busy}
                >
                  Reenviar
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemove(doc.id, doc.name)}
                disabled={busy}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Documentos</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o status dos seus documentos enviados.</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
          disabled={busy}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          {uploadMutation.isPending ? "Enviando..." : "Enviar documento"}
        </Button>
      </div>

      {message && (
        <div 
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success" 
              ? "bg-success/10 text-success" 
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {content}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocumentsState;
