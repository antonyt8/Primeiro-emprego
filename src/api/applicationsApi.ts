import { request } from "@/api/http";

export interface ApplicationStatusResponse {
  status: "open_window" | "talent_bank" | "convocation" | "admission";
  stage: string;
  deadline?: string;
  message?: string;
}

export interface ApplicationResponse {
  id: string;
  program_id: string;
  institution_id: string;
  course_id: string;
  status: "active" | "completed" | "rejected" | "accepted";
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreatePayload {
  program_id?: string;
  edital_id?: string;
  institution_id: string;
  course_id: string;
}

export interface ApplicationHistoryItemResponse {
  id: string;
  application_id: string;
  event: string;
  status: string;
  timestamp: string;
  description?: string;
}

export interface ApplicationHistoryResponse {
  application_id: string;
  events: ApplicationHistoryItemResponse[];
}

export interface ApplicationsListPayload {
  page?: number;
  per_page?: number;
  status?: string;
}

export interface ApplicationsListResponse {
  data: ApplicationResponse[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const applicationsApi = {
  // GET /v1/me/process-status - Get current process status (open window, talent bank, etc.)
  getProcessStatus: () =>
    request<ApplicationStatusResponse>("/me/process-status"),

  // POST /v1/me/applications - Create new application
  createApplication: (payload: ApplicationCreatePayload) =>
    request<ApplicationResponse>("/me/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // GET /v1/me/applications - List all applications of current user with pagination
  listApplications: (payload?: ApplicationsListPayload) => {
    const params = new URLSearchParams();
    if (payload?.page) params.append("page", String(payload.page));
    if (payload?.per_page) params.append("per_page", String(payload.per_page));
    if (payload?.status) params.append("status", payload.status);
    const query = params.toString();
    const path = query ? `/me/applications?${query}` : "/me/applications";
    return request<ApplicationsListResponse>(
      path
    );
  },

  // GET /v1/me/applications/{applicationId}/history - Get application history
  getApplicationHistory: (applicationId: string) =>
    request<ApplicationHistoryResponse>(`/me/applications/${applicationId}/history`),
};
