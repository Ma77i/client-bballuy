export type ScheduleFields = { date: string; time: string };
export type SchedulePart = 'date' | 'time';
const pad = (value: number) => String(value).padStart(2, '0');

export function localDateField(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}
export function localTimeField(value: Date) { return `${pad(value.getHours())}:${pad(value.getMinutes())}`; }

// Same local wall-clock interpretation as the existing organizer contract.
export function localSchedule({ date, time }: ScheduleFields): Date | null {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date), clock = /^(\d{2}):(\d{2})$/.exec(time);
  if (!parts || !clock) return null;
  const [year, month, day, hour, minute] = [parts[1], parts[2], parts[3], clock[1], clock[2]].map(Number);
  const result = new Date(year, month - 1, day, hour, minute);
  if (year < 2000 || result.getFullYear() !== year || result.getMonth() !== month - 1 || result.getDate() !== day ||
    result.getHours() !== hour || result.getMinutes() !== minute) return null;
  return result;
}

export function nextMinute(now = new Date()) { return new Date(Math.floor(now.getTime() / 60000) * 60000 + 60000); }
export function todayMinimum(now = new Date()) { return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
export function scheduleDateLabel(fields: ScheduleFields) {
  const date = localSchedule({ date: fields.date, time: '12:00' });
  return date ? date.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Elegí fecha';
}
export function scheduleTimezoneLabel() {
  try { return `Hora local · ${Intl.DateTimeFormat().resolvedOptions().timeZone}`; }
  catch { return 'Hora local de tu dispositivo'; }
}

export function pickerValue(fields: ScheduleFields, now = new Date()) {
  const value = localSchedule(fields);
  if (value && value.getTime() > now.getTime()) return value;
  const noon = localSchedule({ date: fields.date, time: '12:00' });
  if (noon && localDateField(noon) > localDateField(now)) return noon;
  return nextMinute(now);
}

export function scheduleSelection(fields: ScheduleFields, part: SchedulePart, value: Date, now = new Date()): {
  fields: ScheduleFields; accepted: boolean; error?: string;
} {
  if (!Number.isFinite(value.getTime())) return { fields, accepted: false, error: 'Elegí una fecha y hora válidas.' };
  const proposed = { date: part === 'date' ? localDateField(value) : fields.date, time: part === 'time' ? localTimeField(value) : fields.time };
  if (proposed.date < localDateField(now)) return { fields, accepted: false, error: 'Elegí hoy o una fecha futura.' };
  const candidate = localSchedule(proposed);
  if (part === 'time' && candidate && localDateField(value) === proposed.date && candidate.getTimezoneOffset() !== value.getTimezoneOffset()) {
    return { fields, accepted: false, error: 'Ese horario se repite por el cambio de hora. Elegí otro.' };
  }
  const error = !candidate ? 'Elegí una hora válida para esa fecha.' : candidate.getTime() <= now.getTime() ? localDateField(nextMinute(now)) !== proposed.date ? 'Para un horario futuro, elegí otra fecha.' : 'Elegí una hora futura.' : undefined;
  // Today is a valid calendar date; require an explicit new hour if the old one elapsed.
  if (error && part === 'time') return { fields, accepted: false, error };
  return { fields: proposed, accepted: true, error };
}
