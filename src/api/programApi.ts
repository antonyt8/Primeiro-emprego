import { HttpError, request } from "@/api/http";

export interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
}

export interface EligibilityPayload {
  institution?: string;
  course?: string;
  institution_id?: string;
  course_id?: string;
  period: number | string;
}

export interface CatalogItem {
  id: string;
  name: string;
}

type CatalogEnvelope =
  | CatalogItem[]
  | { data?: unknown; items?: unknown; institutions?: unknown; courses?: unknown };

const parseCatalogList = (payload: unknown): CatalogItem[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const rawId =
        record.id ??
        record.value ??
        record.uuid ??
        record.institution_id ??
        record.course_id;

      const rawName = record.name ?? record.label ?? record.title;

      if (rawId === undefined || rawName === undefined) {
        return null;
      }

      const idType = typeof rawId;
      const nameType = typeof rawName;
      const canSerializeId = idType === "string" || idType === "number";
      const canSerializeName = nameType === "string" || nameType === "number";

      if (!canSerializeId || !canSerializeName) {
        return null;
      }

      return {
        id: String(rawId),
        name: String(rawName),
      };
    })
    .filter((item): item is CatalogItem => item !== null);
};

const normalizeCatalogResponse = (response: CatalogEnvelope, key: "institutions" | "courses") => {
  if (Array.isArray(response)) {
    return parseCatalogList(response);
  }

  const fromData = parseCatalogList(response.data);
  if (fromData.length > 0) {
    return fromData;
  }

  const fromItems = parseCatalogList(response.items);
  if (fromItems.length > 0) {
    return fromItems;
  }

  return parseCatalogList(response[key]);
};

export interface CandidateProfilePayload {
  phone: string;
  institution_id: string;
  course_id: string;
  period: number;
  cr: number | null;
}

export interface CandidateProfileResponse {
  phone?: string;
  institution_id?: string;
  course_id?: string;
  period?: number;
  cr?: number | null;
}

export const programApi = {
  checkEligibility: (payload: EligibilityPayload) =>
    request<EligibilityResponse>("/me/eligibility/check", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getInstitutions: async () => {
    const response = await request<CatalogEnvelope>("/public/institutions");
    return normalizeCatalogResponse(response, "institutions");
  },

  getCourses: async () => {
    const response = await request<CatalogEnvelope>("/public/courses");
    return normalizeCatalogResponse(response, "courses");
  },

  getProfile: async () => {
    try {
      return await request<CandidateProfileResponse | { profile: CandidateProfileResponse }>("/me/profile");
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },

  updateProfile: (payload: CandidateProfilePayload) =>
    request<CandidateProfileResponse | { profile: CandidateProfileResponse }>("/me/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
