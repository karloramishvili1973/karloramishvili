export function sum(a: number, b: number) {
  return a + b;
}

export function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
