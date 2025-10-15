import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { DEFAULT_LANGUAGE, LANGUAGES, Language } from "./routing";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("NEXT_LOCALE")?.value || (await detectLanguage());

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});

const detectLanguage = async () => {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  const languages = acceptLanguage.split(",");
  for (const language of languages) {
    if (LANGUAGES.includes(language as Language)) return language as Language;
  }
  return DEFAULT_LANGUAGE;
};
