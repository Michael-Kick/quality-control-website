import styles from "./JumpNav.module.css";

type JumpLink = { id: string; label: string };

/** Outlined pills in the navy page head that jump to the sections further down the page. */
export function JumpNav({ label, links }: { label: string; links: JumpLink[] }) {
  return (
    <nav aria-label={label} className={styles.nav}>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.id}>
            <a className={styles.chip} href={`#${link.id}`}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
