import type { ReactNode } from "react";
import {
  CircleCheck,
  CircleHelp,
  CircleX,
  FlaskConical,
  FlameIcon,
  Info,
  Lightbulb,
  List,
  ListTodo,
  OctagonAlert,
  SquareExclamationPoint,
  Star,
  StickyNote,
  TriangleAlert,
} from "lucide-react";

const CALLOUT_STYLES: Record<string, string> = {
  abstract: "border-sky-500/50 bg-sky-500/30 text-sky-200 dark:sky-700",
  caution: "border-amber-500/50 bg-amber-500/30 text-amber-200 dark:amber-700",
  danger: "border-red-500/50 bg-red-500/30 text-red-200 dark:red-700",
  example:
    "border-purple-500/50 bg-purple-500/30 text-purple-200 dark:purple-700",
  failure: "border-red-500/50 bg-red-500/30 text-red-200 dark:red-700",
  important:
    "border-green-500/50 bg-green-500/30 text-green-200 dark:green-700",
  info: "border-sky-500/50 bg-sky-500/30 text-sky-200 dark:sky-700",
  note: "border-sky-500/50 bg-sky-500/30 text-sky-200 dark:sky-700",
  question:
    "border-violet-500/50 bg-violet-500/30 text-violet-200 dark:violet-700",
  success:
    "border-emerald-500/50 bg-emerald-500/30 text-emerald-200 dark:emerald-700",
  summary: "border-cyan-500/50 bg-cyan-500/30 text-cyan-200 dark:cyan-700",
  tip: "border-emerald-500/50 bg-emerald-500/30 text-emerald-200 dark:emerald-700",
  todo: "border-blue-500/50 bg-blue-500/30 text-blue-200 dark:blue-700",
  warning: "border-amber-500/50 bg-amber-500/30 text-amber-200 dark:amber-700",
};

const CALLOUT_ICONS: Record<string, ReactNode> = {
  abstract: <FlameIcon className="h-4 w-4" />,
  caution: <SquareExclamationPoint className="h-4 w-4" />,
  danger: <OctagonAlert className="h-4 w-4" />,
  example: <FlaskConical className="h-4 w-4" />,
  failure: <CircleX className="h-4 w-4" />,
  important: <Star className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  note: <StickyNote className="h-4 w-4" />,
  question: <CircleHelp className="h-4 w-4" />,
  success: <CircleCheck className="h-4 w-4" />,
  summary: <List className="h-4 w-4" />,
  tip: <Lightbulb className="h-4 w-4" />,
  todo: <ListTodo className="h-4 w-4" />,
  warning: <TriangleAlert className="h-4 w-4" />,
};

function formatCalloutType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function Callout({
  type,
  title,
  fold,
  children,
}: {
  type: string;
  title?: string;
  fold?: "+" | "-";
  children: ReactNode;
}) {
  const normalizedType = type.toLowerCase();
  const className =
    CALLOUT_STYLES[normalizedType] ??
    "border-border bg-muted/30 dark:border-border/80";
  const heading = title || formatCalloutType(normalizedType);

  const content = (
    <div className="markdown-renderer prose-sm dark:prose-invert">
      {children}
    </div>
  );

  if (fold) {
    return (
      <details
        open={fold === "+"}
        className={`my-4 rounded-lg border px-4 py-3 ${className}`}
      >
        <summary className="cursor-pointer font-semibold select-none">
          <div className="flex items-center gap-2 pb-1">
            {CALLOUT_ICONS[normalizedType]}
            <span className="whitespace-nowrap font-semibold">{heading}</span>
          </div>
        </summary>
        <div className="mt-3">{content}</div>
      </details>
    );
  }

  return (
    <aside className={`my-4 border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 border-b border-border/80 pb-1">
        {CALLOUT_ICONS[normalizedType]}
        <span className="whitespace-nowrap font-semibold">{heading}</span>
      </div>
      <div className="mt-3">{content}</div>
    </aside>
  );
}
