import styles from "./Portrait.module.css";

type PortraitProps = {
  /** Shown inside the placeholder and used as accessible label. */
  label: string;
  size?: "lg" | "md" | "sm";
  tone?: "light" | "dark";
};

/**
 * Placeholder for the portrait photo. Replace the inner content with
 * `next/image` once a real photo exists (keep the wrapper for sizing).
 */
export function Portrait({ label, size = "lg", tone = "light" }: PortraitProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={[styles.portrait, styles[size], tone === "dark" && styles.dark].filter(Boolean).join(" ")}
    >
      <span aria-hidden="true">{label}</span>
    </div>
  );
}
