import { Section } from "@/components/ui/Section";
import { ContactAside } from "./ContactAside";
import { ContactForm } from "./ContactForm";
import styles from "./ContactSection.module.css";

/** Form (about 60 %) and aside (about 40 %) side by side, stacked on smaller screens. */
export function ContactSection() {
  return (
    <Section>
      <div className={styles.layout}>
        <ContactForm />
        <ContactAside />
      </div>
    </Section>
  );
}
