"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

export function MermaidDiagram({ code }: { code: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

     mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",

    themeVariables: {
      primaryColor: "#3b2155",
      primaryTextColor: "#ffffff",
      primaryBorderColor: "#000000",
      lineColor: "#777777",
      textColor: "#56238a",
    },

    themeCSS: `
      /* Remove shadows */
      .node,
      .node rect,
      .node polygon,
      .node path,
      .node circle,
      .cluster rect {
        filter: none !important;
        box-shadow: none !important;
        border: none !important;
      }

      /* Rounded rectangular nodes */
      .node rect,
      .cluster rect {
        rx: 12px;
        ry: 12px;
      }
    `,
    });

    void mermaid
      .render(`mermaid-${id}`, code)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSvg(null);
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <pre className="m-0 overflow-x-auto p-4">
        <code>{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return <div className="min-h-24 animate-pulse bg-muted/30" aria-hidden />;
  }

  return (
    <div
      className="flex justify-center overflow-x-auto p-4 [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
