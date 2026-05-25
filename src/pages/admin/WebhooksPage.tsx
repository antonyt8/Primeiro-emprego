import { useEffect, useMemo, useState } from "react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminApi, type WebhookEndpoint } from "@/api/adminApi";
import { getApiErrorMessage } from "@/lib/api-error";

const eventOptions = ["application.created", "document.uploaded", "convocation.created", "notification.sent"];

const WebhooksPage = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ url: "", events: [] as string[], active: true, secret: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setWebhooks(await adminApi.listWebhooks());
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const canSubmit = useMemo(() => Boolean(form.url && form.events.length > 0), [form.events.length, form.url]);

  const resetForm = () => {
    setForm({ url: "", events: [], active: true, secret: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setError("Informe uma URL válida e selecione ao menos um evento.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = { url: form.url, events: form.events, active: form.active };
      const response = editingId ? await adminApi.updateWebhook(editingId, payload) : await adminApi.createWebhook(payload);
      if (response.secret) {
        setForm((current) => ({ ...current, secret: response.secret ?? "" }));
      }
      setMessage(editingId ? "Webhook atualizado." : "Webhook criado.");
      await adminApi.listWebhooks().then(setWebhooks);
      if (!editingId) resetForm();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const toggleEvent = (eventName: string) => {
    setForm((current) => ({
      ...current,
      events: current.events.includes(eventName) ? current.events.filter((item) => item !== eventName) : [...current.events, eventName],
    }));
  };

  const handleDelete = async (webhookId: string) => {
    try {
      await adminApi.deleteWebhook(webhookId);
      setWebhooks((current) => current.filter((webhook) => webhook.id !== webhookId));
      setMessage("Webhook removido.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const handleEdit = (webhook: WebhookEndpoint) => {
    setEditingId(webhook.id);
    setForm({ url: webhook.url, events: webhook.events, active: webhook.active, secret: webhook.secret ?? "" });
  };

  return (
    <SectionPage eyebrow="Admin" title="Webhooks" description="Gerencie endpoints com eventos, ativação e segredo de criação.">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Editar endpoint" : "Novo endpoint"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="url" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} placeholder="https://example.com/webhook" />
            </div>

            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="flex flex-wrap gap-2">
                {eventOptions.map((eventName) => (
                  <Button key={eventName} type="button" variant={form.events.includes(eventName) ? "default" : "outline"} size="sm" onClick={() => toggleEvent(eventName)}>
                    {eventName}
                  </Button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
              Ativo
            </label>

            {form.secret ? <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">Segredo gerado: {form.secret}</p> : null}
            {error || message ? <p className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{error || message}</p> : null}

            <div className="flex justify-end gap-2">
              {editingId ? <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button> : null}
              <Button type="submit" disabled={saving || !canSubmit}>{saving ? "Salvando..." : editingId ? "Atualizar" : "Criar endpoint"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando webhooks.</p>
          ) : webhooks.length === 0 ? (
            <EmptyState title="Nenhum webhook cadastrado" description="Crie o primeiro endpoint para receber eventos do backend." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.url}</TableCell>
                    <TableCell>{webhook.events.join(", ")}</TableCell>
                    <TableCell>{webhook.active ? <Badge>Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(webhook)}>Editar</Button>
                        <Button variant="ghost" size="sm" onClick={() => void handleDelete(webhook.id)}>Remover</Button>
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

export default WebhooksPage;