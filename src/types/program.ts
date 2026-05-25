export type Institution = "UFAL" | "UNEAL" | "IFAL" | "CESMAC" | "UNIT" | "FAT";

export type Course =
  | "Administração"
  | "Direito"
  | "Engenharia Civil"
  | "Ciência da Computação"
  | "Medicina"
  | "Pedagogia"
  | "Contabilidade";

export type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type EligibilityResult = "eligible" | "ineligible" | null;

export interface EligibilitySelection {
  institution: Institution | "";
  course: Course | "";
  period: Period | "";
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  institution: string;
  course: string;
}

export type DocumentStatus = "Aprovado" | "Em analise" | "Rejeitado";

export interface DocumentItem {
  name: string;
  status: DocumentStatus;
}

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  read: boolean;
}
