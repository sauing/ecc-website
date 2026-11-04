import { adminAuth, quickLogin } from "../../lib/admin/service";
import s from "./admin.module.css";
import PasswordLogin from "./password-login";
import PinLogin from "./pin-login";
import AdminWorkspace from "./workspace";
export const metadata = { title: "ECC administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ auth?: string; section?: string }> }) {
  const params = await searchParams;
  const authFailed = params.auth === "failed";
  const session = await adminAuth.currentAccess();
  if (session.state === "ready") {
    return <AdminWorkspace identity={session.identity} section={params.section} pinConfigured={quickLogin.configured()}/>;
  }
  if (session.state === "forbidden") return <Gate title="Admin access required" text="You are signed in, but this account has no active admin or moderator role. Ask the website maintainer to approve your account."><form action="/auth/logout" method="post"><button>Sign out</button></form></Gate>;
  if (session.state === "unavailable") return <Gate title="Database setup needs attention" text="The access table could not be read. Ask the maintainer to check the database migration and connection." />;
  if (session.state === "setup") return <Gate title="Your club. In good hands." text="Admin sign-in is waiting for the database connection."><div className={s.setupSteps}><span>01 · Connect Supabase</span><span>02 · Create the admin-access table</span><span>03 · Create the first admin account</span></div><p>Contact the website maintainer to finish connecting the administration portal.</p></Gate>;
  return <Gate title="Welcome to ECC administration" text="Sign in with your club email and website password.">{authFailed && <p role="alert">Google sign-in could not be completed. Please try email sign-in or ask the maintainer for help.</p>}<PasswordLogin/><PinLogin/><div className={s.loginDivider}>or</div><form action="/auth/google" method="post"><button className={s.primary} disabled={process.env.AUTH_GOOGLE_ENABLED !== "true"}>Continue with Google →</button></form>{process.env.AUTH_GOOGLE_ENABLED !== "true" && <p>Google sign-in is being set up.</p>}</Gate>;
}
function Gate({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return <main className={s.gate}><a href="/">← Back to ECC</a><section><img src="/images/ecc-logo.png" alt="ECC crest"/><span className={s.kicker}>Eindhoven Cricket Club · Administration</span><h1>{title}</h1><p>{text}</p>{children}</section></main>;
}
