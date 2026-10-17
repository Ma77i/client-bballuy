// R02 + R02.1 presentation tokens. Functional state belongs to callers.
export const palette = {
  navy: '#0C1220', surface: '#171F30', raised: '#243047', cream: '#FFF7ED',
  orange: '#FF8A43', orangePressed: '#F97316', text: '#F8FAFC', muted: '#B8C3D6',
  orangeInk: '#A63B00',
  orangeAction: '#BA4300',
  separator: '#53647E', success: '#73DEAA', warning: '#FFD166', error: '#FFADB5',
  dangerSurface: '#3E2530', lightError: '#8C1831', lightSuccess: '#175F3E',
  lightWarning: '#704B00', white: '#FFFFFF', black: '#000000',
  // Existing primary consumers mix link and white-label fill roles. Migrate them
  // per screen in T03-T05 instead of changing their contrast implicitly in T02.
  legacyPrimary: '#0EA5E9', legacyPrimaryPressed: '#0284C7',
} as const;

export const surfaces = {
  dark: { background: palette.navy, panel: palette.surface, text: palette.text,
    muted: palette.muted, boundary: palette.muted, focus: palette.orange,
    success: palette.success, warning: palette.warning, error: palette.error },
  light: { background: palette.cream, panel: palette.cream, text: palette.navy,
    muted: palette.raised, boundary: palette.separator, focus: palette.navy,
    success: palette.lightSuccess, warning: palette.lightWarning, error: palette.lightError },
} as const;
export type SurfaceTone = keyof typeof surfaces;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, section: 48 } as const;
export const radii = { control: 12, card: 20, sheet: 28 } as const;
export const touchTarget = 48;
export const fonts = { body: 'Lexend-Regular', medium: 'Lexend-Medium',
  label: 'Lexend-SemiBold', bold: 'Lexend-Bold', display: 'Teko-SemiBold' } as const;
export const typography = {
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36 },
  section: { fontFamily: fonts.label, fontSize: 24, lineHeight: 32 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.label, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
} as const;
export const motion = { press: 100, release: 80, selection: 140, switch: 160,
  sheet: 240, confirmed: 180, pressScale: 0.98 } as const;
