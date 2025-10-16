import Filter from 'bad-words';

const filter = new Filter();

export function containsProfanity(text: string): boolean {
  return filter.isProfane(text);
}

export function cleanProfanity(text: string): string {
  return filter.clean(text);
}

export function validateContent(text: string): { valid: boolean; cleaned: string; hasProfanity: boolean } {
  const hasProfanity = containsProfanity(text);
  return {
    valid: !hasProfanity,
    cleaned: cleanProfanity(text),
    hasProfanity,
  };
}
