import PasswordReset from "./password-reset";
import s from "../admin/admin.module.css";

export const metadata = { title: "Choose a new password | Eindhoven Cricket Club", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ recovery?: string }> }) {
  const invalid = (await searchParams).recovery === "invalid";
  return <main className={s.gate}>
    <a href="/login">← Back to sign in</a>
    <section>
      <img src="/images/ecc-logo.png" alt="ECC crest"/>
      <span className={s.kicker}>Eindhoven Cricket Club · My ECC</span>
      <h1>Choose a new password.</h1>
      {invalid ? <><p role="alert" className={s.error}>This reset link is invalid or has expired.</p><a className={s.primary} href="/forgot-password">Request another link →</a></> : <><p>Enter a new password for your ECC account.</p><PasswordReset/></>}
    </section>
  </main>;
}
