// Deterministic mapping from any seed string/number to one of the 749
// sample face photos shipped in public/profiles/. Safe to call on every
// render — a stable hash means the same seed always returns the same URL.

export const PROFILE_IMAGE_COUNT = 749;

function hashSeed(seed) {
  const str = seed == null ? '' : String(seed);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getProfileImage(seed) {
  const n = (hashSeed(seed) % PROFILE_IMAGE_COUNT) + 1;
  return `/profiles/img-${n}.jpg`;
}

export function getRandomProfileImage() {
  const n = Math.floor(Math.random() * PROFILE_IMAGE_COUNT) + 1;
  return `/profiles/img-${n}.jpg`;
}
