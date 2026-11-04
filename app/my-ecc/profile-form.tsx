"use client";
import {useState,type FormEvent} from "react";
import type {MemberProfile} from "../../lib/account/profile";
import s from "./account.module.css";
export default function ProfileForm({initial}:{initial:MemberProfile|null}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError("");const data=new FormData(event.currentTarget);
    try {
      const response=await fetch("/api/account/profile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({address:data.get("address"),phone:data.get("phone")})});
      const result=await response.json();
      if(!response.ok){setError(result.error??"Your details could not be saved.");return;}
      window.location.assign("/my-ecc");
    }catch{setError("Could not connect. Your details have not been confirmed as saved. Please try again.");}finally{setBusy(false);}
  }
  return <form className={s.form} onSubmit={submit}><label>Full postal address<textarea name="address" autoComplete="street-address" required minLength={8} maxLength={500} rows={4} defaultValue={initial?.address??""} disabled={busy} aria-describedby="address-hint"/></label><small id="address-hint">Include street, house number, postal code, city and country.</small><label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={40} defaultValue={initial?.phone??""} placeholder="+31 6 12345678" disabled={busy} aria-describedby="phone-hint"/></label><small id="phone-hint">Include your country code.</small>{error&&<p role="alert" className={s.error}>{error}</p>}<button className={s.primary} disabled={busy}>{busy?"Saving…":"Save and open My ECC →"}</button><p className={s.hint}>These details complete your ECC account. You can choose a membership later.</p></form>;
}
