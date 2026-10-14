"use client";
import { useState, type FormEvent } from "react";
import s from "./contact.module.css";

export default function ContactForm() {
  const [draftOpened, setDraftOpened] = useState(false);
  function openDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `[${data.get("topic")}] ${data.get("subject")}`;
    const body = `Reply email: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:info@eindhovencc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftOpened(true);
  }
  return <form className={s.form} onSubmit={openDraft}>
    <span className={s.eyebrow}>Get in touch</span><h2>Send us a message</h2>
    <label htmlFor="contact-topic">Contact type <span>*</span></label>
    <select id="contact-topic" name="topic" required defaultValue=""><option value="" disabled>Select a topic</option><option>General enquiry</option><option>Membership</option><option>Youth cricket</option><option>Facilities</option><option>Club administration</option></select>
    <label htmlFor="contact-email">Your email <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} />
    <label htmlFor="contact-subject">Subject <span>*</span></label><input id="contact-subject" name="subject" required maxLength={150} />
    <label htmlFor="contact-message">Message <span>*</span></label><textarea id="contact-message" name="message" required rows={5} maxLength={2000} />
    <button type="submit">Open email draft <span aria-hidden="true">→</span></button>
    <p className={s.formNote}>Opens your email app. Review and send the message there; this website does not send or store it.</p>
    {draftOpened && <p className={s.formNote} role="status">Email draft requested. If no app opened, email <a href="mailto:info@eindhovencc.com">info@eindhovencc.com</a> directly. Your message has not been sent by this website.</p>}
  </form>;
}
