import { errorText } from './error-copy';

// Scoped display vocabulary; server errors, contracts and classifications stay intact.
export function detailErrorText(value?: string) {
  return errorText(value)?.replace(/La convocatoria/g, 'El partido')
    .replace(/la convocatoria/g, 'el partido').replace(/esta convocatoria/g, 'este partido')
    .replace(/Esta convocatoria/g, 'Este partido').replace(/convocatorias/g, 'partidos')
    .replace(/convocatoria/g, 'partido').replace(/no está disponible/g, 'no está disponible');
}
