export function splitSiteName(name: string): { before: string; after: string } {
  const parts = name.split(" & ");
  return {
    before: parts[0] || name,
    after: parts[1] || "",
  };
}
