import type { ScheduleFields } from './schedule-policy';
export type PlannedScheduleProps = {
  value: ScheduleFields; disabled: boolean; expanded: boolean;
  errors: { date?: string; time?: string };
  onChange(fields: ScheduleFields): void;
};
