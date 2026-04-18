import type { Locale } from "@/i18n/routing";

import enMessages from "../../messages/en.json";

export type AppMessages = typeof enMessages;

export async function loadMessages(locale: Locale): Promise<AppMessages> {
  return (await import(`../../messages/${locale}.json`)).default as AppMessages;
}

export function getMessageValue<T>(messages: AppMessages, path: string): T {
  const value = path.split(".").reduce<unknown>((result, key) => {
    if (typeof result !== "object" || result === null || !(key in result)) {
      throw new Error(`Missing message path: ${path}`);
    }

    return (result as Record<string, unknown>)[key];
  }, messages);

  return value as T;
}
