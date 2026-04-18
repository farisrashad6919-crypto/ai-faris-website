import type { Locale } from "@/i18n/routing";
import type { AppMessages } from "@/lib/messages";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: AppMessages;
  }
}
