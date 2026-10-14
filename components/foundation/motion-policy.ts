import { motion } from '../../constants/design.ts';

export function pressPresentation(pressed: boolean, blocked: boolean, reduced: boolean, active: boolean) {
  return { scale: pressed && !blocked && !reduced && active ? motion.pressScale : 1,
    duration: reduced || !active || blocked ? 0 : pressed ? motion.press : motion.release };
}

// A preference event must win over a slower initial accessibility query.
export function observeMotionPreference(
  query: () => Promise<boolean>, subscribe: (listener: (value: boolean) => void) => () => void,
  update: (value: boolean) => void,
) {
  let alive = true;
  let changed = false;
  const remove = subscribe(value => { changed = true; if (alive) update(value); });
  try {
    void query().then(value => { if (alive && !changed) update(value); }, () => {
      if (alive && !changed) update(true);
    });
  } catch {
    if (alive && !changed) update(true);
  }
  return () => { alive = false; remove(); };
}
