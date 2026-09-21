import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { BrainCircuit } from "lucide-react";

export const appConfig = {
  name: "Secondbrain",
  shortName: "Secondbrain",
  description: "A personal knowledge base for organizing notes and ideas.",
  icon: BrainCircuit,
  iconPath: "/icon.svg",
} satisfies {
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  iconPath: string;
};

export const appMetadata: Metadata = {
  applicationName: appConfig.name,
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  icons: {
    icon: appConfig.iconPath,
  },
};
