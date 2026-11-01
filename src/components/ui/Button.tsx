import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "dark";

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

type LinkProps = ComponentProps<typeof Link>;

/** Locale-aware link styled as a button. `secondary` is meant for navy backgrounds. */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: LinkProps & { variant?: ButtonVariant }) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}

/** Inline call-to-action link in the accent colour, e.g. "Zu den Audits →". */
export function TextLink({ className, ...props }: LinkProps) {
  return <Link className={[styles.textLink, className].filter(Boolean).join(" ")} {...props} />;
}
