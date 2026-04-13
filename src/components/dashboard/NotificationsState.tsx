import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialNotifications = [
  { id: "n1", title: "Nova convocatoria", text: "Voce recebeu uma nova convocatoria para analise.", icon: Bell, tone: "text-primary", read: false },
  { id: "n2", title: "Documento aprovado", text: "Seu documento de identidade foi aprovado.", icon: CheckCircle2, tone: "text-success", read: false },
  { id: "n3", title: "Atualize seu perfil", text: "Complete os dados faltantes para aumentar suas chances.", icon: Info, tone: "text-accent", read: true },
  { id: "n4", title: "Prazo se encerrando", text: "Faltam 2 dias para responder a convocatoria.", icon: AlertTriangle, tone: "text-warning", read: false },
];

const NotificationsState = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const clearAll = () => {
    setNotifications([]);
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
          <Button variant="outline" onClick={clearAll}>Limpar</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ultimas notificacoes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma notificacao no momento.</p>
          )}
          {notifications.map((item) => (
            <div key={item.id} className={`rounded-lg border p-4 ${!item.read ? "bg-primary/5" : ""}`}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.tone}`} />
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                </div>
                {!item.read && (
                  <Button size="sm" variant="ghost" onClick={() => markAsRead(item.id)}>Marcar como lida</Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsState;
