import type { MethodId } from "./method";

export interface PrepStep {
  title: string;
  desc: string;
}

export interface PrepChecklist {
  title: string;
  note: string;
  steps: PrepStep[];
}

export type PrepChecklistsByMethod = Partial<Record<MethodId, PrepChecklist>>;
