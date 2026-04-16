export type Units = "metric" | "imperial";

export type TempUnit = "C" | "F";

export interface UserSettings {
  name: string;
  units: Units;
  tempUnit: TempUnit;
  musicAuto: boolean;
  notifications: boolean;
}
