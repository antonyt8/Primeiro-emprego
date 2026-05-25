import type { AxiosProgressEvent } from "axios";
import { http, request } from "@/api/http";

export interface DocumentUploadResponse {
  id: string;
  name: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface DocumentListResponse {
  id: string;
  name: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface DocumentsListPayload {
  page?: number;
  per_page?: number;
}

export interface DocumentsListPaginatedResponse {
  data: DocumentListResponse[];
}

export const documentsApi = {
  // GET /v1/me/documents - List all documents with optional pagination
  listDocuments: (payload?: DocumentsListPayload) => {
    const params = new URLSearchParams();
    if (payload?.page) params.append("page", String(payload.page));
    if (payload?.per_page) params.append("per_page", String(payload.per_page));
    const query = params.toString();
    const suffix = query ? `?${query}` : "";
    return request<DocumentListResponse[] | DocumentsListPaginatedResponse>(`/me/documents${suffix}`);
  },

  // POST /v1/me/documents - Upload a new document (multipart/form-data)
  uploadDocument: (file: File, documentType?: string, onUploadProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    if (documentType) {
      formData.append("type", documentType);
    }

    return http.request<DocumentUploadResponse>({
      url: "/me/documents",
      method: "POST",
      data: formData,
      onUploadProgress: onUploadProgress
        ? (event: AxiosProgressEvent) => {
            if (typeof event.total === "number" && event.total > 0) {
              onUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
          }
        : undefined,
    }).then((response) => response.data);
  },

  // PUT /v1/me/documents/{documentId}/resend - Resend a document for analysis (after rejection)
  resendDocument: (documentId: string) =>
    request<DocumentUploadResponse>(`/me/documents/${documentId}/resend`, {
      method: "PUT",
    }),

  // DELETE /v1/me/documents/{documentId} - Delete a document
  deleteDocument: (documentId: string) =>
    request<void>(`/me/documents/${documentId}`, {
      method: "DELETE",
    }),
};
