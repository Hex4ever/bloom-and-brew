export type BeanSource = "scan" | "manual" | "curated";

export interface Bean {
  id: string;
  name: string;
  roaster: string;
  roast: string;
  notes: string;
  date: string;
  source: BeanSource;
  origin?: string;
  imageUrl?: string;
}

export interface CuratedBean {
  name: string;
  roaster: string;
  origin: string;
  notes: string;
  price: string;
  availability: string;
  desc: string;
}
