import type { Metadata } from "next";
import Image from "next/image";
import TeamHeader from "../teams/team-header";
import PartnershipEnquiry from "./partnership-enquiry";
import { partners } from "./partners";
import s from "./partners.module.css";

export const metadata: Metadata = {
  title: "Our Partners | Eindhoven Cricket Club",
  description: "Meet the businesses supporting Eindhoven Cricket Club and explore a partnership through youth development, matchdays, events and community cricket.",
};

export default function PartnersPage() {
  return <>
    <TeamHeader />
    <main className={s.page} id="main-content">
      <section className={s.hero} aria-labelledby="partners-title">
        <div className={s.heroInner}>
          <div><p className={s.eyebrow}>Partnerships at ECC</p><h1 id="partners-title">Your business.<br />Our community.<br /><em>One team.</em></h1></div>
          <div className={s.heroCopy}><p>Partner with Eindhoven Cricket Club and be part of a welcoming, diverse community. Together we can create opportunities, memorable experiences and a stronger local connection through cricket.</p><a className={s.cta} href="#partnership-enquiry">Become a partner</a><a className={s.heroLink} href="#our-partners">Meet our partners</a></div>
        </div>
        <div className={s.communityPhoto}><Image src="/images/youth/cricket-family.jpg" alt="ECC families and club supporters together on the cricket ground" fill sizes="100vw" preload /></div>
      </section>

      <section className={s.partners} id="our-partners" aria-labelledby="our-partners-heading">
        <div className={s.partnersHeading}><div><p className={s.eyebrow}>The businesses in our corner.</p><h2 id="our-partners-heading">Our partners</h2></div><p>We’re grateful for the support of businesses who share our passion for cricket and community. Their partnership helps us grow, include and create opportunities on and off the field.</p></div>
        <div className={s.partnerGrid}>{partners.map(partner => <article className={s.partner} key={partner.name}>
          <a className={s.logoLink} href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name} website (opens in a new tab)`}><Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="(max-width: 600px) 70vw, 25vw" /></a>
          <h3>{partner.name}</h3><a className={s.websiteLink} href={partner.website} target="_blank" rel="noopener noreferrer">Visit website<span className={s.srOnly}> for {partner.name} (opens in a new tab)</span></a>
        </article>)}</div>
      </section>

      <section className={s.enquiry} id="partnership-enquiry" aria-labelledby="enquiry-heading">
        <div className={s.enquiryHeading}><p className={s.eyebrow}>Explore a partnership possibility</p><h2 id="enquiry-heading">Let’s find your fit.</h2></div>
        <PartnershipEnquiry />
      </section>
      <section className={s.closing} aria-labelledby="closing-heading"><h2 id="closing-heading">A local connection.<br />A lasting conversation.</h2><p>Businesses, supporters and community members all play a part in a stronger, more inclusive future for cricket in Eindhoven.</p></section>
    </main>
    <footer className={s.footer}><a className={s.footerBrand} href="/">Eindhoven Cricket Club<small>Established 1915</small></a><nav aria-label="Footer navigation"><a href="/about">Club</a><a href="/youth">Youth</a><a href="/partners" aria-current="page">Partners</a><a href="/contact">Contact</a></nav></footer>
  </>;
}
