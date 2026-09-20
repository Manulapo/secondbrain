import { slugify } from "@/lib/utils";

const INTERNAL_NOTE_PATH = /^\/notes\/([^/?#]+)(?:[?#].*)?$/;

export function internalNoteHref(slug: string) {
  return `/notes/${slug}`;
}

export function getInternalNoteSlug(href: string | undefined) {
  if (!href) return null;

  const match = href.match(INTERNAL_NOTE_PATH);
  return match ? decodeURIComponent(match[1]) : null;
}

function normalizeTarget(target: string) {
  const cleanTarget = target
    .trim()
    .replace(/\\?\.md$/i, "")
    .split("#")[0];
  return slugify(cleanTarget);
}

function convertLinks(value: string) {
  const convertedWikiLinks = value.replace(
    /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
    (_, target, label) => {
      const slug = normalizeTarget(target);
      return slug
        ? `[${label?.trim() || target.trim()}](${internalNoteHref(slug)})`
        : _;
    },
  );

  return convertMarkdownLinks(convertedWikiLinks);
}

function convertMarkdownOutsideCode(line: string) {
  let converted = "";
  let cursor = 0;

  while (cursor < line.length) {
    const openingMatch = line.slice(cursor).match(/^`+/);

    if (!openingMatch) {
      const nextCode = line.indexOf("`", cursor);
      const end = nextCode === -1 ? line.length : nextCode;
      converted += convertLinks(line.slice(cursor, end));
      cursor = end;
      continue;
    }

    const opening = openingMatch[0];
    let closingIndex = -1;
    let searchFrom = cursor + opening.length;

    while (searchFrom < line.length) {
      const candidate = line.slice(searchFrom).match(/^`+/);

      if (!candidate) {
        searchFrom += 1;
        continue;
      }

      if (candidate[0].length === opening.length) {
        closingIndex = searchFrom;
        break;
      }

      searchFrom += candidate[0].length;
    }

    if (closingIndex === -1) {
      converted += convertLinks(line.slice(cursor));
      break;
    }

    converted += line.slice(cursor, closingIndex + opening.length);
    cursor = closingIndex + opening.length;
  }

  return converted;
}

function convertMarkdownLinks(line: string) {
  return line.replace(/\[([^\]]+)\]\(<?([^)>]+)>?\)/g, (match, label, href) => {
    const trimmedHref = href.trim();

    if (
      !trimmedHref ||
      trimmedHref.startsWith("/") ||
      trimmedHref.startsWith("#") ||
      trimmedHref.startsWith("./") ||
      trimmedHref.startsWith("../") ||
      /^[a-z][a-z\d+.-]*:/i.test(trimmedHref)
    ) {
      return match;
    }

    const slug = normalizeTarget(trimmedHref);
    return slug ? `[${label}](${internalNoteHref(slug)})` : match;
  });
}

export function resolveInternalLinks(markdown: string) {
  let fence: { marker: "`" | "~"; length: number } | null = null;

  return markdown
    .split("\n")
    .map((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

      if (fence) {
        if (
          fenceMatch?.[1][0] === fence.marker &&
          fenceMatch[1].length >= fence.length
        ) {
          fence = null;
        }

        return line;
      }

      if (fenceMatch) {
        fence = {
          marker: fenceMatch[1][0] as "`" | "~",
          length: fenceMatch[1].length,
        };
        return line;
      }

      return convertMarkdownOutsideCode(line);
    })
    .join("\n");
}

export function getInternalNoteSlugs(markdown: string) {
  const slugs = new Set<string>();
  const resolved = resolveInternalLinks(markdown);

  for (const match of resolved.matchAll(
    /\]\(\/notes\/([^)?#]+)(?:[?#][^)]*)?\)/g,
  )) {
    slugs.add(decodeURIComponent(match[1]));
  }

  return [...slugs];
}
