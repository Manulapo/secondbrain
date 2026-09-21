export function getRouteSlug(
  pathname: string,
  route: "folders" | "notes",
): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const routeIndex = segments.indexOf(route);
  return routeIndex >= 0 ? (segments[routeIndex + 1] ?? null) : null;
}
