export function isEmpty(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === "" || value === null || value === undefined;
}
