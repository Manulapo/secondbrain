export { cn } from "cn";

export function slugify(name: string) {
  return (
    name
      // Remove ordering prefix: "3 - ", "12 - ", etc.
      .replace(/^\d+\s*-\s*/, "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function isMocNote(title: string) {
  return /^\d+\s*-\s*MOC\s*-/i.test(title);
}
