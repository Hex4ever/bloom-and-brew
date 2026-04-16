export type GrinderType = "Hand" | "Electric";

export interface Grinder {
  id: string;
  name: string;
  clicksPerMicron: number;
  type: GrinderType;
}
