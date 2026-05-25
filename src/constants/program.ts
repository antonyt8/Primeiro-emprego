import type { Course, Institution, Period, UserProfile } from "@/types/program";

export const INSTITUTIONS: Institution[] = ["UFAL", "UNEAL", "IFAL", "CESMAC", "UNIT", "FAT"];

export const COURSES: Course[] = [
  "Administração",
  "Direito",
  "Engenharia Civil",
  "Ciência da Computação",
  "Medicina",
  "Pedagogia",
  "Contabilidade",
];

export const PERIODS: { label: string; value: Period }[] = [
  { label: "1º Período", value: 1 },
  { label: "2º Período", value: 2 },
  { label: "3º Período", value: 3 },
  { label: "4º Período", value: 4 },
  { label: "5º Período", value: 5 },
  { label: "6º Período", value: 6 },
  { label: "7º Período", value: 7 },
  { label: "8º Período", value: 8 },
];

export const INITIAL_PROFILE: UserProfile = {
  fullName: "Antony Thiago",
  email: "antony@email.com",
  phone: "(82) 99999-9999",
  cpf: "000.000.000-00",
  institution: "UFAL",
  course: "Ciência da Computação",
};

export const PROGRAM_STORAGE_KEYS = {
  profile: "dashboard-profile-data",
  authToken: "auth_token",
  authUser: "auth_user",
  contrast: "portal-high-contrast",
  contrastPosition: "portal-contrast-position",
} as const;
