import type { ReactNode } from "react";
import s from "./account.module.css";
export default function AccountShell({children}:{children:ReactNode}) {
  return <div className={s.page}><header className={s.header}><a className={s.brand} href="/"><img src="/images/ecc-logo.png" alt="ECC crest"/>Eindhoven Cricket Club</a><div><a href="/">Club website ↗</a><form action="/auth/logout" method="post"><button>Sign out</button></form></div></header>{children}</div>;
}
