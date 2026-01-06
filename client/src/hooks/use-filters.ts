import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

export type FilterState = {
  category: string[] | null;
  level: string[] | null;
  primaryLanguage: string[] | null;
};

export function useFilters() {
  const [filters, setFilters] = useQueryStates({
    category: parseAsArrayOf(parseAsString),
    level: parseAsArrayOf(parseAsString),
    primaryLanguage: parseAsArrayOf(parseAsString),
  });

  // Explicitly return typed values to help TypeScript inference elsewhere
  return { filters, setFilters };
}
