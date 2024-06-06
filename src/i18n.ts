import { locales } from "@/lib/config";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    defaultTranslationValues: {
      p: (chunks) => `<p>${chunks}</p>`,
    },
  };
});
