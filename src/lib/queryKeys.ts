export const queryKeys = {
  documents: {
    all: ["documents"] as const,
    list: (page: number, perPage: number) => ["documents", "list", page, perPage] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (page: number, perPage: number) => ["notifications", "list", page, perPage] as const,
  },
  applications: {
    all: ["applications"] as const,
    list: (page: number, perPage: number) => ["applications", "list", page, perPage] as const,
    processStatus: ["applications", "process-status"] as const,
  },
  dashboard: {
    metrics: ["dashboard", "metrics"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
};