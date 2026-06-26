import { ActionStrategy } from "@/hooks/useResourceActions";

export const TRIP_FORM_CONFIGS = {} satisfies Record<string, ActionStrategy>;

export type TripFormAction = keyof typeof TRIP_FORM_CONFIGS;
