import type { Grinder } from "../types";

export const GRINDERS: Grinder[] = [
  { id: "c40",    name: "Comandante C40",  clicksPerMicron: 0.033,  type: "Hand"     },
  { id: "jx",     name: "1Zpresso JX",     clicksPerMicron: 0.077,  type: "Hand"     },
  { id: "k6",     name: "1Zpresso K-Ultra",clicksPerMicron: 0.0125, type: "Hand"     },
  { id: "encore", name: "Baratza Encore",  clicksPerMicron: 0.025,  type: "Electric" },
  { id: "c2",     name: "Timemore C2",     clicksPerMicron: 0.04,   type: "Hand"     },
  { id: "ode",    name: "Fellow Ode Gen 2",clicksPerMicron: 0.03,   type: "Electric" },
];
