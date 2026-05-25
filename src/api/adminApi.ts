import { request } from "@/api/http";

export interface ConvocationDashboardResponse {
  total_convocados: number;
  total_simulados: number;
  lotes_abertos: number;
  taxa_cumprimento: number;
  by_course?: Array<{ label: string; value: number }>;
}

export interface ConvocationFormPayload {
  edital_id: string;
  curso_id: string;
  orgao_id: string;
  quantidade: number;
}

export interface ConvocationSimulationPayload {
  edital_id: string;
  curso_id: string;
  quantidade: number;
}

export interface ConvocationPositionPayload {
  candidate_id: string;
  edital_id: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
}

export interface WebhookPayload {
  url: string;
  events: string[];
  active: boolean;
}

export interface ReportRow {
  label: string;
  total: number;
  fulfilled: number;
}

export const adminApi = {
  getDashboard: () => request<ConvocationDashboardResponse>("/admin/dashboard"),
  createConvocation: (payload: ConvocationFormPayload) => request<{ total_convocados?: number; message?: string }>("/admin/convocations", { method: "POST", body: payload }),
  simulateConvocation: (payload: ConvocationSimulationPayload) => request<{ selected: Array<Record<string, unknown>>; exhausted?: boolean }>("/admin/convocations/simulate", { method: "POST", body: payload }),
  calculatePosition: (payload: ConvocationPositionPayload) => request<{ current_position?: number; future_position?: number }>("/admin/convocations/calculate-position", { method: "POST", body: payload }),
  listWebhooks: () => request<WebhookEndpoint[]>("/admin/webhooks"),
  createWebhook: (payload: WebhookPayload) => request<WebhookEndpoint>("/admin/webhooks", { method: "POST", body: payload }),
  updateWebhook: (id: string, payload: WebhookPayload) => request<WebhookEndpoint>(`/admin/webhooks/${id}`, { method: "PUT", body: payload }),
  deleteWebhook: (id: string) => request<void>(`/admin/webhooks/${id}`, { method: "DELETE" }),
  getConvocationReports: (editalId?: string) => {
    const query = editalId ? `?edital_id=${encodeURIComponent(editalId)}` : "";
    return request<{ summary?: Record<string, number>; rows?: ReportRow[] }>(`/admin/reports/convocations${query}`);
  },
  getQuotaFulfillmentReports: (editalId?: string) => {
    const query = editalId ? `?edital_id=${encodeURIComponent(editalId)}` : "";
    return request<{ rows?: ReportRow[] }>(`/admin/reports/quota-fulfillment${query}`);
  },
};