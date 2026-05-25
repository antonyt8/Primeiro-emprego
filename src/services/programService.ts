import { COURSES, INSTITUTIONS, PERIODS } from "@/constants/program";
import type { Course, EligibilityResult, EligibilitySelection, Institution, Period } from "@/types/program";

export const programCatalog = {
  institutions: INSTITUTIONS,
  courses: COURSES,
  periods: PERIODS,
} as const;

export const evaluateEligibility = (selection: EligibilitySelection): EligibilityResult => {
  if (!selection.institution || !selection.course || !selection.period) {
    return null;
  }

  return selection.period >= 3 ? "eligible" : "ineligible";
};

export const normalizePeriod = (period: string): Period | "" => {
  const parsed = Number(period);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 8) {
    return "";
  }

  return parsed as Period;
};

export const isInstitution = (value: string): value is Institution =>
  (INSTITUTIONS as readonly string[]).includes(value);

export const isCourse = (value: string): value is Course =>
  (COURSES as readonly string[]).includes(value);
