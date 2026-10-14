/**
 * Synthetic data for the sensor playback demo.
 *
 * EVERYTHING in this file is invented for illustration. It is not CASAS data
 * and not output from any model. The activity labels are hand-written
 * annotations of the synthetic events, not predictions.
 */

export const FLOORPLAN = { width: 640, height: 400 } as const;

export type SensorKind = "motion" | "door";
export type SensorState = "ON" | "OFF" | "OPEN" | "CLOSE";

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Sensor {
  id: string;
  kind: SensorKind;
  zone: string;
  x: number;
  y: number;
  /** Short description shown to the user. */
  label: string;
}

export interface SensorEvent {
  /** Seconds since midnight on the synthetic day. */
  time: number;
  sensor: string;
  state: SensorState;
  /** Hand-written annotation of the synthetic day. Not a model prediction. */
  annotation: string;
}

export const zones: Zone[] = [
  { id: "bedroom", name: "Bedroom", x: 20, y: 20, width: 200, height: 170 },
  { id: "bathroom", name: "Bathroom", x: 220, y: 20, width: 120, height: 170 },
  { id: "kitchen", name: "Kitchen", x: 340, y: 20, width: 280, height: 170 },
  { id: "hallway", name: "Hallway", x: 20, y: 190, width: 230, height: 190 },
  { id: "living", name: "Living area", x: 250, y: 190, width: 370, height: 190 },
];

export const sensors: Sensor[] = [
  { id: "M01", kind: "motion", zone: "bedroom", x: 120, y: 100, label: "Bedroom motion" },
  { id: "M02", kind: "motion", zone: "hallway", x: 150, y: 300, label: "Hallway motion" },
  { id: "M03", kind: "motion", zone: "bathroom", x: 280, y: 100, label: "Bathroom motion" },
  { id: "M04", kind: "motion", zone: "kitchen", x: 420, y: 90, label: "Kitchen sink motion" },
  { id: "M05", kind: "motion", zone: "living", x: 430, y: 290, label: "Living area motion" },
  { id: "M06", kind: "motion", zone: "kitchen", x: 550, y: 90, label: "Kitchen stove motion" },
  { id: "D01", kind: "door", zone: "hallway", x: 20, y: 285, label: "Front door" },
];

const t = (h: number, m: number, s: number) => h * 3600 + m * 60 + s;

/** A short synthetic morning: wake up, bathroom, breakfast, leave home. */
export const events: SensorEvent[] = [
  { time: t(6, 52, 10), sensor: "M01", state: "ON", annotation: "Wake up" },
  { time: t(6, 53, 2), sensor: "M01", state: "OFF", annotation: "Wake up" },
  { time: t(6, 53, 9), sensor: "M02", state: "ON", annotation: "Bathroom visit" },
  { time: t(6, 53, 21), sensor: "M02", state: "OFF", annotation: "Bathroom visit" },
  { time: t(6, 53, 24), sensor: "M03", state: "ON", annotation: "Bathroom visit" },
  { time: t(6, 58, 40), sensor: "M03", state: "OFF", annotation: "Bathroom visit" },
  { time: t(6, 58, 47), sensor: "M02", state: "ON", annotation: "Bathroom visit" },
  { time: t(6, 58, 55), sensor: "M02", state: "OFF", annotation: "Bathroom visit" },
  { time: t(6, 59, 1), sensor: "M05", state: "ON", annotation: "Other" },
  { time: t(6, 59, 12), sensor: "M05", state: "OFF", annotation: "Other" },
  { time: t(6, 59, 15), sensor: "M04", state: "ON", annotation: "Meal preparation" },
  { time: t(6, 59, 50), sensor: "M04", state: "OFF", annotation: "Meal preparation" },
  { time: t(6, 59, 54), sensor: "M06", state: "ON", annotation: "Meal preparation" },
  { time: t(7, 3, 30), sensor: "M06", state: "OFF", annotation: "Meal preparation" },
  { time: t(7, 3, 36), sensor: "M04", state: "ON", annotation: "Meal preparation" },
  { time: t(7, 4, 10), sensor: "M04", state: "OFF", annotation: "Meal preparation" },
  { time: t(7, 4, 20), sensor: "M05", state: "ON", annotation: "Eating" },
  { time: t(7, 19, 45), sensor: "M05", state: "OFF", annotation: "Eating" },
  { time: t(7, 19, 58), sensor: "M04", state: "ON", annotation: "Other" },
  { time: t(7, 20, 40), sensor: "M04", state: "OFF", annotation: "Other" },
  { time: t(7, 20, 52), sensor: "M05", state: "ON", annotation: "Other" },
  { time: t(7, 21, 0), sensor: "M05", state: "OFF", annotation: "Other" },
  { time: t(7, 21, 5), sensor: "M02", state: "ON", annotation: "Leave home" },
  { time: t(7, 21, 18), sensor: "D01", state: "OPEN", annotation: "Leave home" },
  { time: t(7, 21, 24), sensor: "D01", state: "CLOSE", annotation: "Leave home" },
  { time: t(7, 21, 30), sensor: "M02", state: "OFF", annotation: "Leave home" },
];

export const sensorById = new Map(sensors.map((sensor) => [sensor.id, sensor]));
export const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

/** Events per window in the demo. The thesis uses 30; 8 keeps every view readable on screen. */
export const DEMO_WINDOW_SIZE = 8;

export function isActivation(state: SensorState): boolean {
  return state === "ON" || state === "OPEN";
}
