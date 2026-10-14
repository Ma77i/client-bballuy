import { fonts } from '../../constants/design.ts';
export function presentationFont(requested: string, loaded: (family: string) => boolean) {
  if (!Object.values(fonts).some(family => family === requested) || loaded(requested)) return requested;
  return requested === fonts.display && loaded(fonts.bold) ? fonts.bold : undefined;
}
