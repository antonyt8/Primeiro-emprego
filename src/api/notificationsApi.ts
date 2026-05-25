import { request } from "@/api/http";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsListPayload {
  page?: number;
  per_page?: number;
}

export interface NotificationsListResponse {
  data: NotificationResponse[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const notificationsApi = {
  // GET /v1/me/notifications - List all notifications with pagination
  listNotifications: (payload?: NotificationsListPayload) => {
    const params = new URLSearchParams();
    if (payload?.page) params.append("page", String(payload.page));
    if (payload?.per_page) params.append("per_page", String(payload.per_page));
    const query = params.toString();
    const path = query ? `/me/notifications?${query}` : "/me/notifications";
    return request<NotificationsListResponse | NotificationResponse[]>(path);
  },

  // PATCH /v1/me/notifications/{notificationId}/read - Mark single notification as read
  markAsRead: (notificationId: string) =>
    request<NotificationResponse>(`/me/notifications/${notificationId}/read`, {
      method: "PATCH",
    }),

  // PATCH /v1/me/notifications/read-all - Mark all notifications as read
  markAllAsRead: () =>
    request<{ updated: number }>("/me/notifications/read-all", {
      method: "PATCH",
    }),
};
