"use server";

import type { ContactFormState } from "./fields";
import { processContactForm } from "./submit";

/** Server Action behind the contact form, used with `useActionState`. */
export async function sendContactRequest(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Server Actions are public endpoints: reject anything that is not a form post.
  if (!(formData instanceof FormData)) return { status: "error" };
  return processContactForm(formData);
}
