import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const LANGUAGES = ["en-US", "zh-CN"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en-US";

export const routing = defineRouting({
  locales: LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: "never",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
