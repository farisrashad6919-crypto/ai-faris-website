import type { MouseEventHandler, ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn, isExternalHref } from "@/lib/utils";

const variants = {
  primary: "button-primary",
  secondary: "button-secondary",
  tertiary: "button-tertiary",
} as const;

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  external = false,
  onClick,
}: ButtonLinkProps) {
  const classes = cn(variants[variant], className);
  const isExternal = external || isExternalHref(href);

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{children}</span>
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link className={classes} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}
