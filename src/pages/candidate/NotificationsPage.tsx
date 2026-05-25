import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import SectionPage from "@/components/layout/SectionPage";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notificationsApi, type NotificationResponse } from "@/api/notificationsApi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/api-error";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await notificationsApi.listNotifications();
        setNotifications(Array.isArray(response) ? response : response.data ?? []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => (!onlyUnread || !item.read) && `${item.title} ${item.message}`.toLowerCase().includes(debouncedQuery.toLowerCase())),
    [debouncedQuery, notifications, onlyUnread],
  );

  const markAsRead = async (notificationId: string) => {
    await notificationsApi.markAsRead(notificationId);
    setNotifications((current) => current.map((item) => (item.id === notificationId ? { ...item, read: true } : item)));
  };

  const markAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <SectionPage
      eyebrow="Candidato"
      title="Notificações"
      description="Filtre notificações, marque individualmente como lidas ou conclua tudo em lote."
      actions={<Button variant="outline" onClick={() => void markAllAsRead()}><CheckCheck className="mr-2 h-4 w-4" />Marcar todas como lidas</Button>}
    >
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full items-center gap-3">
            <Checkbox id="onlyUnread" checked={onlyUnread} onCheckedChange={(checked) => setOnlyUnread(Boolean(checked))} />
            <label htmlFor="onlyUnread" className="text-sm font-medium text-foreground">Mostrar apenas não lidas</label>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar notificações" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:max-w-sm" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando notificações.</p>
          ) : error ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
          ) : visibleNotifications.length === 0 ? (
            <EmptyState icon={Bell} title="Sem notificações" description="Não há notificações para os filtros selecionados." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleNotifications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.read ? <Badge variant="secondary">Lida</Badge> : <Badge>Nova</Badge>}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell className="text-right">
                      {!item.read ? <Button variant="ghost" size="sm" onClick={() => void markAsRead(item.id)}>Marcar como lida</Button> : null}
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

export default NotificationsPage;