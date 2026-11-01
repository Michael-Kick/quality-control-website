"use client";

import { useLocale, useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { sendContactRequest } from "@/lib/contact/actions";
import {
  HONEYPOT_FIELD,
  initialContactState,
  MAX_LENGTH,
  SALUTATIONS,
  STARTED_AT_FIELD,
  SUBMITTED_AT_FIELD,
  TIMEFRAMES,
  TOPICS,
  VISIBLE_FIELDS,
  type ContactField,
  type FieldErrors,
} from "@/lib/contact/fields";
import styles from "./ContactForm.module.css";

const TITLE_ID = "contact-form-title";
const HONEYPOT_ID = `contact-${HONEYPOT_FIELD}`;
const fieldId = (field: ContactField) => `contact-${field}`;
const errorId = (field: ContactField) => `contact-${field}-error`;

/** Props that connect a control with its error message. */
function errorProps(field: ContactField, errors: FieldErrors) {
  return errors[field]
    ? { "aria-invalid": true as const, "aria-describedby": errorId(field) }
    : {};
}

function RequiredMark() {
  return (
    <span className={styles.required} aria-hidden="true">
      {" *"}
    </span>
  );
}

function FieldError({ field, message }: { field: ContactField; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(field)} className={styles.error}>
      {message}
    </p>
  );
}

type TextFieldProps = {
  name: "name" | "company" | "email" | "phone";
  type: "text" | "email" | "tel";
  autoComplete: string;
  label: ReactNode;
  required?: boolean;
  errors: FieldErrors;
  errorMessage?: string;
};

function TextField({ name, type, autoComplete, label, required = false, errors, errorMessage }: TextFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={fieldId(name)} className={styles.label}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      <input
        id={fieldId(name)}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={MAX_LENGTH[name]}
        className={styles.control}
        {...errorProps(name, errors)}
      />
      <FieldError field={name} message={errorMessage} />
    </div>
  );
}

/**
 * Contact form for the free intro call. Validation and sending happen in the
 * `sendContactRequest` Server Action; this component shows the translated
 * field errors, the send error banner or the success panel.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendContactRequest, initialContactState);

  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const errors: FieldErrors = state.status === "invalid" ? state.errors : {};
  const errorMessage = (field: ContactField) =>
    errors[field] ? t(`form.errors.${errors[field]}`) : undefined;

  // Remember when the form became interactive (minimum fill time, see lib/contact/spam.ts).
  useEffect(() => {
    const input = startedAtRef.current;
    if (input && !input.value) input.value = String(Date.now());
  }, []);

  // Move focus to the outcome so keyboard and screen reader users notice it.
  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      resultRef.current?.focus();
    } else if (state.status === "invalid") {
      const first = VISIBLE_FIELDS.find((field) => state.errors[field]);
      const form = formRef.current;
      if (!first || !form) return;
      const target =
        form.querySelector<HTMLElement>(`[name="${first}"]:checked`) ??
        form.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Dispatch the action manually: with a plain form action React resets all
    // uncontrolled fields afterwards, which would wipe the input on validation errors.
    // The `action` prop stays for submissions before hydration.
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    formData.set(SUBMITTED_AT_FIELD, String(Date.now()));
    startTransition(() => formAction(formData));
  }

  if (state.status === "success") {
    return (
      <div className={styles.wrapper}>
        <h2 id={TITLE_ID} className="visually-hidden">
          {t("form.title")}
        </h2>
        <div ref={resultRef} tabIndex={-1} role="status" className={styles.success}>
          <p className={styles.successTitle}>{t("form.success.title")}</p>
          <p>{t("form.success.text")}</p>
        </div>
      </div>
    );
  }

  const phoneHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <div className={styles.wrapper}>
      <h2 id={TITLE_ID} className="visually-hidden">
        {t("form.title")}
      </h2>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby={TITLE_ID}
        aria-busy={pending || undefined}
        className={styles.form}
      >
        <input type="hidden" name="locale" value={locale} />
        <input ref={startedAtRef} type="hidden" name={STARTED_AT_FIELD} />

        <fieldset className={styles.fieldset} aria-describedby={errors.topic ? errorId("topic") : undefined}>
          <legend className={styles.legend}>{t("form.topic.legend")}</legend>
          <div className={styles.segmented}>
            {TOPICS.map((topic) => (
              <label key={topic} className={styles.segment}>
                <input type="radio" name="topic" value={topic} defaultChecked={topic === "audit"} required />
                <span>{t(`form.topic.options.${topic}`)}</span>
              </label>
            ))}
          </div>
          <FieldError field="topic" message={errorMessage("topic")} />
        </fieldset>

        <fieldset
          className={styles.fieldset}
          aria-describedby={errors.salutation ? errorId("salutation") : undefined}
        >
          <legend className={styles.legend}>{t("form.salutation.legend")}</legend>
          <div className={styles.segmented}>
            {SALUTATIONS.map((salutation) => (
              <label key={salutation} className={styles.segment}>
                <input type="radio" name="salutation" value={salutation} />
                <span>{t(`form.salutation.options.${salutation}`)}</span>
              </label>
            ))}
          </div>
          <FieldError field="salutation" message={errorMessage("salutation")} />
        </fieldset>

        <div className={styles.row}>
          <TextField
            name="name"
            type="text"
            autoComplete="name"
            label={t("form.name")}
            required
            errors={errors}
            errorMessage={errorMessage("name")}
          />
          <TextField
            name="company"
            type="text"
            autoComplete="organization"
            label={t("form.company")}
            required
            errors={errors}
            errorMessage={errorMessage("company")}
          />
        </div>

        <div className={styles.row}>
          <TextField
            name="email"
            type="email"
            autoComplete="email"
            label={t("form.email")}
            required
            errors={errors}
            errorMessage={errorMessage("email")}
          />
          <TextField
            name="phone"
            type="tel"
            autoComplete="tel"
            label={t("form.phone")}
            errors={errors}
            errorMessage={errorMessage("phone")}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={fieldId("timeframe")} className={styles.label}>
            {t("form.timeframe.label")}
          </label>
          <select
            id={fieldId("timeframe")}
            name="timeframe"
            defaultValue=""
            className={`${styles.control} ${styles.select}`}
            {...errorProps("timeframe", errors)}
          >
            <option value="">{t("form.timeframe.placeholder")}</option>
            {TIMEFRAMES.map((timeframe) => (
              <option key={timeframe} value={timeframe}>
                {t(`form.timeframe.options.${timeframe}`)}
              </option>
            ))}
          </select>
          <FieldError field="timeframe" message={errorMessage("timeframe")} />
        </div>

        <div className={styles.field}>
          <label htmlFor={fieldId("message")} className={styles.label}>
            {t("form.message.label")}
            <RequiredMark />
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={6}
            required
            maxLength={MAX_LENGTH.message}
            placeholder={t("form.message.placeholder")}
            className={`${styles.control} ${styles.textarea}`}
            {...errorProps("message", errors)}
          />
          <FieldError field="message" message={errorMessage("message")} />
        </div>

        <div className={styles.field}>
          <div className={styles.consent}>
            <input id={fieldId("consent")} type="checkbox" name="consent" required {...errorProps("consent", errors)} />
            <label htmlFor={fieldId("consent")}>
              {t.rich("form.consent", {
                // New tab, so following the link does not discard the entered data.
                link: (chunks) => (
                  <Link href="/datenschutz" target="_blank">
                    {chunks}
                    <span className="visually-hidden"> {t("newTab")}</span>
                  </Link>
                ),
              })}
              <RequiredMark />
            </label>
          </div>
          <FieldError field="consent" message={errorMessage("consent")} />
        </div>

        {/* Honeypot: invisible for people and assistive technology. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={HONEYPOT_ID}>{t("form.honeypot")}</label>
          <input
            id={HONEYPOT_ID}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className={styles.hint}>{t("form.requiredHint")}</p>

        {state.status === "error" ? (
          <div ref={resultRef} tabIndex={-1} role="alert" className={styles.alert}>
            <p className={styles.alertTitle}>{t("form.sendError.title")}</p>
            <p>
              {t.rich("form.sendError.text", {
                phone: siteConfig.phone,
                email: siteConfig.email,
                phoneLink: (chunks) => <a href={phoneHref}>{chunks}</a>,
                emailLink: (chunks) => <a href={`mailto:${siteConfig.email}`}>{chunks}</a>,
              })}
            </p>
          </div>
        ) : null}

        <button type="submit" className={buttonClassName("dark", styles.submit)} disabled={pending}>
          {pending ? t("form.submitting") : t("form.submit")}
        </button>
      </form>
    </div>
  );
}
