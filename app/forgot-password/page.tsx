import RecoveryRequest from "./recovery-request";
import s from "../admin/admin.module.css";

export const metadata = { title: "Reset password | Eindhoven Cricket Club", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <main className={s.gate}>
    <a href="/login">← Back to sign in</a>
    <section>
      <img src="/images/ecc-logo.png" alt="ECC crest"/>
      <span className={s.kicker}>Eindhoven Cricket Club · My ECC</span>
      <h1>Reset your password.</h1>
      <p>Enter your club email and we’ll send you a secure link to choose a new password.</p>
      <RecoveryRequest/>
    </section>
  </main>;
}
