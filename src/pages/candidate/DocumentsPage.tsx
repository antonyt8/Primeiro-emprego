import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Trash2, Upload } from "lucide-react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { documentsApi, type DocumentListResponse } from "@/api/documentsApi";
import { getApiErrorMessage } from "@/lib/api-error";

const normalizeDocuments = (payload: DocumentListResponse[] | { data: DocumentListResponse[] }) =>
  Array.isArray(payload) ? payload : payload.data ?? [];

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentListResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedFileName = useMemo(() => selectedFile?.name ?? "Nenhum arquivo selecionado", [selectedFile]);

  const loadDocuments = async () => {
    try {
      const response = await documentsApi.listDocuments();
      setDocuments(normalizeDocuments(response));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage("");
    setError("");
    setProgress(0);

    try {
      const uploaded = await documentsApi.uploadDocument(selectedFile, documentType || undefined, setProgress);
      setDocuments((current) => [uploaded, ...current]);
      setSelectedFile(null);
      setDocumentType("");
      setMessage("Documento enviado com sucesso.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await documentsApi.deleteDocument(documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
      setMessage("Documento excluído.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const handleResend = async (documentId: string) => {
    try {
      await documentsApi.resendDocument(documentId);
      setMessage("Reenvio solicitado com sucesso.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Documentos"
      description="Envie, reenviar e exclua documentos com feedback por item e progresso visual do upload."
    >
      <Card>
        <CardHeader>
          <CardTitle>Envio de documento</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleUpload}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="file">Arquivo</Label>
              <Input id="file" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
              <p className="text-xs text-muted-foreground">{selectedFileName}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document_type">Tipo</Label>
              <Input id="document_type" value={documentType} onChange={(event) => setDocumentType(event.target.value)} placeholder="Comprovante, RG..." />
            </div>

            {uploading ? <Progress value={progress} className="md:col-span-3" /> : null}
            {error || message ? <p className={`md:col-span-3 rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{error || message}</p> : null}

            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={!selectedFile || uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Enviando..." : "Enviar documento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando documentos.</p>
          ) : documents.length === 0 ? (
            <EmptyState title="Sem documentos enviados" description="Faça o primeiro upload para iniciar o acompanhamento." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.name}</TableCell>
                    <TableCell>{document.status}</TableCell>
                    <TableCell>{new Date(document.updated_at).toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => void handleResend(document.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reenviar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void handleDelete(document.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SectionPage>
  );
};

export default DocumentsPage;