"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n/hook";
import { LANGUAGES } from "@/i18n/routing";
import { EarthIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const LanguageToggle = () => {
  const t = useTranslations("locale");
  const { currentLocale, handleChangeLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10">
          <EarthIcon className="!size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Languages" className="min-w-fit">
        {LANGUAGES.map((locale) => (
          <DropdownMenuCheckboxItem
            key={locale}
            onClick={() => handleChangeLocale(locale)}
            checked={currentLocale === locale}
          >
            {t(locale)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
