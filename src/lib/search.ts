export function createSearchRegex(value: string) {
  return new RegExp(value.trim().toLowerCase(), "ig");
}
