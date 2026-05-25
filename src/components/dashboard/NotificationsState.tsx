import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notificationsApi, type NotificationResponse } from "@/api/notificationsApi";
import { HttpError } from "@/api/http";
import { queryKeys } from "@/lib/queryKeys";
import { useSession } from "@/lib/session";

interface NotificationWithIcon extends NotificationResponse {
  icon: typeof Bell;
  tone: string;
}

const typeConfig: Record<string, { icon: typeof Bell; tone: string }> = {
  info: { icon: Info, tone: "text-accent" },
  warning: { icon: AlertTriangle, tone: "text-warning" },
  success: { icon: CheckCircle2, tone: "text-success" },
  error: { icon: AlertTriangle, tone: "text-destructive" },
};

const toUiNotification = (item: NotificationResponse): NotificationWithIcon => ({
  ...item,
  icon: typeConfig[item.type]?.icon || Bell,
  tone: typeConfig[item.type]?.tone || "text-primary",
});

const normalizeNotifications = (
  response: Awaited<ReturnType<typeof notificationsApi.listNotifications>>
) => {
  if (Array.isArray(response)) {
    return {
      items: response,
      hasMore: false,
    };
  }

  return {
    items: response.data,
    hasMore: response.pagination.current_page < response.pagination.last_page,
  };
};

const NotificationsState = () => {
  const { authReady, isAuthenticated } = useSession();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<NotificationWithIcon[]>([]);
  const [page, setPage] = useState(1);

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.list(page, 10),
    queryFn: () => notificationsApi.listNotifications({ page, per_page: 10 }),
    enabled: authReady && isAuthenticated,
    retry: (failureCount, error) => {
      const status = error instanceof HttpError ? error.status : undefined;
      if (status === 401 || status === 403 || status === 419) return false;
      return failureCount < 2;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  // Load notifications on mount and when page changes
  useEffect(() => {
    if (!notificationsQuery.data) return;

    const normalized = normalizeNotifications(notificationsQuery.data);
    const notificationsWithIcons = normalized.items.map(toUiNotification);

    if (page === 1) {
      setNotifications(notificationsWithIcons);
      return;
    }

    setNotifications((prev) => {
      const ids = new Set(prev.map((item) => item.id));
      const incoming = notificationsWithIcons.filter((item) => !ids.has(item.id));
      return [...prev, ...incoming];
    });
  }, [notificationsQuery.data, page]);

  const hasMore = notificationsQuery.data
    ? normalizeNotifications(notificationsQuery.data).hasMore
    : false;
  const loading = notificationsQuery.isLoading;

  const markAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const clearAll = async () => {
    await markAllAsReadMutation.mutateAsync();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notificacoes</h2>
          <p className="text-sm text-muted-foreground">Mensagens e alertas importantes do programa.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Nao lidas: {unreadCount}</span>
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={markAllAsReadMutation.isPending || loading || notifications.length === 0}
          >
            {markAllAsReadMutation.isPending ? "Atualizando..." : "Marcar todas como lidas"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ultimas notificacoes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {loading && (
              <p className="text-sm text-muted-foreground">Carregando notificacoes...</p>
            )}
            {!loading && notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma notificacao no momento.</p>
          )}
          {notifications.map((item) => (
            <div key={item.id} className={`rounded-lg border p-4 ${item.read ? "" : "bg-primary/5"}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.tone}`} />
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                </div>
                {!item.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(item.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    {markAsReadMutation.isPending ? "Atualizando..." : "Marcar como lida"}
                  </Button>
                )}
              </div>
                <p className="text-sm text-muted-foreground">{item.message}</p>
            </div>
          ))}
            {hasMore && (
              <div className="pt-2">
                <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
                  Carregar mais
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsState;
