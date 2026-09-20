type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
  };
};

function getText(node: MarkdownNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(getText).join("");
}

function visit(node: MarkdownNode) {
  if (node.type === "blockquote") {
    const firstChild = node.children?.[0];
    const firstText = firstChild ? getText(firstChild) : "";
    const firstLine = firstText.split(/\r?\n/, 1)[0].trim();
    const match = firstLine.match(/^\[!([^\]\s]+)\]([+-])?(?:\s+(.*))?$/i);

    if (match) {
      node.data = {
        hName: "div",
        hProperties: {
          "data-callout-type": match[1],
          ...(match[2] ? { "data-callout-fold": match[2] } : {}),
          ...(match[3] ? { "data-callout-title": match[3].trim() } : {}),
        },
      };

      if (firstChild) {
        const firstTextNode = firstChild.children?.find(
          (child) => child.type === "text",
        );

        if (firstTextNode?.value) {
          const remaining = firstTextNode.value
            .split(/\r?\n/)
            .slice(1)
            .join("\n");

          if (remaining) {
            firstTextNode.value = remaining;
          } else {
            node.children = node.children?.slice(1);
          }
        }
      }
    }
  }

  node.children?.forEach(visit);
}

export function remarkCallouts() {
  return (tree: MarkdownNode) => visit(tree);
}
