export function escapeLikeString(raw: string): string {
  return raw.replace(/[\\%_]/g, '\\$&');
}
