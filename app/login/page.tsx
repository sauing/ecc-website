import { redirect } from "next/navigation";
import { accountAuth } from "../../lib/account/service";
import { adminAuth } from "../../lib/admin/service";
import PasswordLogin from "../admin/password-login";
import PinLogin from "../admin/pin-login";
import s from "../admin/admin.module.css";
export const metadata = { title: "My ECC login | Eindhoven Cricket Club", robots: { index:false, follow:false } };
export const dynamic = "force-dynamic";
export default async function LoginPage({searchParams}:{searchParams:Promise<{auth?:string}>}) {
  const failed=(await searchParams).auth==="failed";
  const session=await accountAuth.currentAccount();
  let unavailable=session.state==="unavailable";
  if(session.state==="ready"&&session.account.verified&&!failed) {
    const access=await adminAuth.currentAccess();
    if(access.state==="ready") redirect("/admin");
    if(access.state==="forbidden") redirect("/my-ecc");
    unavailable=true;
  }
  return <main className={s.gate}><a href="/">← Back to ECC</a><section><img src="/images/ecc-logo.png" alt="ECC crest"/><span className={s.kicker}>Eindhoven Cricket Club · My ECC</span><h1>Welcome back.</h1><p>Sign in to your ECC account.</p>{(failed||unavailable)&&<p role="alert">{unavailable?"The account service is temporarily unavailable. Please try again.":"Sign-in could not be completed. Please try again."}</p>}
    <form action="/auth/google" method="post"><button className={s.primary} disabled={process.env.AUTH_GOOGLE_ENABLED!=="true"}>Continue with Google →</button></form>{process.env.AUTH_GOOGLE_ENABLED!=="true"&&<p>Google sign-in is being connected.</p>}<div className={s.loginDivider}>or use your website password</div><PasswordLogin/><PinLogin/><a href="/join">New to ECC? Create your account →</a></section></main>;
}
