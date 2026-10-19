# Website visual QA

final result: passed

## Partners page: selected concept 3

### Visual truth and comparison evidence

- Source: `C:/Users/saurabh.singh2/.codex/generated_images/01a1537a-fc8b-79a2-ac5f-1520620ae9f2/exec-7e0b7c36-e487-4722-ad94-ccbe9d7644ae.png` (1039 × 1514 pixels), the third displayed Partners concept.
- Implementation: `http://127.0.0.1:3000/partners`, production build, empty form with Youth & development selected.
- Desktop viewport: 1440 × 1000 CSS pixels. Browser captures are 1425 × 990 pixels and normalized to 1440 × 1000 for comparison, as with the earlier Youth review. Density/viewport scaling is accounted for only in comparison artifacts.
- `.tmp/partners-qa/partners-desktop.png` (1440 × 2357) combines overlapping captures at scroll positions 0, 900 and 1356.8. Repeated sticky-navigation pixels are excluded from the later frames. Original captures: `desktop-top.png`, `desktop-middle.png`, `desktop-bottom.png`.
- Full source/implementation comparison opened together: `.tmp/partners-qa/comparison-final.jpg`.
- Focused comparisons opened together: `.tmp/partners-qa/hero-comparison-final.jpg` and `enquiry-comparison-final.jpg`. The latter makes labels, field spacing, interest selection and enquiry copy readable independently of the full-page comparison.
- Responsive evidence: `.tmp/partners-qa/mobile-hero.png`, `mobile-enquiry.png`, and `tablet-fixed.png`. Phone inspected at 390 × 844, narrow phone bounds checked at 320 × 740, compact navigation inspected at 850 × 1000.

### Findings and fixes

- [P2, resolved] Initial desktop panoramic crop clipped faces. Changed the desktop photo position from 56% to 40%; final hero comparison shows the entire group's heads.
- [P2, resolved] Adding Partners to the compact navigation caused horizontal overflow at 850 pixels (scroll width 880). Reduced compact navigation type and gaps only within its tablet media query. Rechecked: viewport 850, scroll width 835, Join ECC within the visible navigation.
- [P2, resolved] Initial heading proportions were smaller than the selected concept. Increased desktop hero, partner, enquiry and closing heading scales and adjusted hero padding. Rebuilt, recaptured, and reviewed final full-page and focused comparisons. Mobile-specific scales remain unchanged.

No actionable P0/P1/P2 findings remain.

### Required fidelity surfaces

- **Fonts:** Barlow Condensed display and Barlow body retain the existing club identity. Three-line hero and single-line desktop enquiry heading follow the selected visual hierarchy. Phone headings reflow without overflow.
- **Spacing:** Navy hero, panoramic community photograph, equally spaced three-part sponsor showcase, open enquiry area and red closing band follow the selected structure. Existing shared masthead, crest, announcement/login behavior and full club navigation are retained deliberately; these add height compared with the simplified concept header.
- **Colors:** Existing navy, cream, red and off-white tokens reused, with clear hover/focus and selected-radio states.
- **Images:** Original community photograph and all three existing sponsor logos used directly. No placeholder imagery, invented partners or altered sponsor branding. Logo containers have equal space; intrinsic aspect ratios remain intact. Actual source logo backgrounds are retained rather than reproducing generated image cleanup.
- **Copy:** Selected headline and core content retained. The mock's unsupported growth claim is omitted. Prospective partnerships are described as possibilities to discuss. Email drafting is explicitly explained; no implied successful transmission.

### Functional checks

- Homepage Our partners heading links to `/partners`; its Become a partner link reaches `/partners#partnership-enquiry`.
- Shared desktop/mobile navigation includes Partners with the active state. Mobile menu opens and Partners navigates successfully.
- Interest choices update descriptions and support native radio keyboard arrows.
- Valid test company, email and message produce a mailto draft with the correct destination, selected interest, encoded subject and body. Editing any field or changing interest removes the stale draft.
- Required company validation prevents draft creation when blank. Inputs use email validation and length limits.
- No message sent and no external email app launched during testing.
- No horizontal overflow at the tested phone/tablet widths; all page images loaded in the production browser review.
- Production browser warning/error logs: none. Development emitted lazy-image LCP advice when reloading at a sponsor anchor; the hero is preloaded and sponsor images remain lazy to avoid unnecessary loading on normal entry.
- `npm run typecheck` and final `npm run build` passed; `/partners` statically generated successfully. Existing routes still build.
- Temporary viewport overrides reset, local preview retained. This page has not been committed or deployed as part of this implementation turn.

### Follow-up polish

- [P3] The supplied FinancieelNext logo is a small raster image. A future original vector asset would improve sharpness at large sizes.
- [P3] Small decorative button arrows and the mock's selection notch are omitted; native controls, labels and focus states carry the interactions.

final result: passed

## Target and evidence

- Selected visual: the second displayed concept, `C:/Users/saurabh.singh2/.codex/generated_images/01a1537a-fc8b-79a2-ac5f-1520620ae9f2/exec-f54e319a-f24c-463b-941a-d0954518fec0.png` (946 × 1663 pixels).
- Implementation: `http://127.0.0.1:3000/youth`, production build, default page state.
- Desktop viewport: 1440 × 1000 CSS pixels. Browser captures are 1425 × 990 pixels; normalized to 1440 × 1000 for comparison. The browser's screenshot surface scales the viewport slightly. No typography or imagery was stretched in the implementation.
- Full desktop evidence: `.tmp/youth-qa/youth-desktop.png` (1440 × 2766), assembled from overlapping viewport captures at scroll positions 0, 866.4 and 1766.4; repeated sticky navigation removed from later captures. Originals: `desktop-top.png`, `desktop-middle.png`, `desktop-bottom.png` in the same folder.
- Full-view comparison: `.tmp/youth-qa/comparison-final.jpg`, source and implementation together at 600 pixels wide each, preserving their respective aspect ratios.
- Focused hero comparison: `.tmp/youth-qa/hero-comparison-final.jpg`, both hero regions together at 720 pixels wide each. Initial comparison: `.tmp/youth-qa/comparison-before.jpg`.
- Mobile: 390 × 844 CSS pixels; `.tmp/youth-qa/mobile-top.png`, `mobile-collage-final.png`, `mobile-discover.png`, and `mobile-memories.png`. Additional content-bound checks at 320 × 740 and 768 × 1024. No horizontal page overflow at these widths.
- Screenshots are local QA artifacts under the ignored `.tmp/` directory.

## Findings and comparison history

1. [P2, resolved] Initial hero framing showed too much background and gave the children less prominence than the concept. Increased photo scale with an origin that keeps the trophy visible. Re-captured and reviewed the focused hero comparison.
2. [P2, resolved] The initial memories crop cut into the visiting player's cap, and its overlaid caption covered photo subjects on mobile. Shifted the crop upward and placed the caption in the print's lower border. Reviewed corrected mobile and desktop captures.
3. [P2, resolved] At narrow widths, the overlapping secondary print could obscure the main photo caption. Limited the main caption to the uncovered portion of the print and reserved two lines. Reviewed `mobile-collage-final.png` after the final production build.

No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Fonts and typography:** Existing Barlow Condensed display and Barlow body fonts preserved; Caveat provides handwritten captions. Four-line hero, condensed section titles, and red emphasis match the selected direction. Phone layouts reflow without clipping.
- **Spacing and layout rhythm:** Overlapping rotated photo prints, red values band, cream team story, navy memories section, and closing invitation follow the concept. The site's existing shared masthead and navigation intentionally replace the simplified concept header. Native photo proportions preserve the original people rather than reproducing generated alterations.
- **Colors and tokens:** Existing navy `#071b2e`, cream `#f4f0e7`, red `#d42930`, and off-white retained. Buttons have hover and keyboard-focus states.
- **Image quality and asset fidelity:** All six supplied original photos are local project assets, served with Next Image and responsive sizes. Hero is preloaded; lower photographs load lazily. The social screenshot is clipped to its photographic area. No generated people, placeholder photos, or code-drawn image substitutes. The original club crest is reused.
- **Copy and content:** Selected headline and core editorial copy retained. No unconfirmed schedules, prices, age groups, results, or endorsements added. An explicit email explanation and contact-form alternative clarify the enquiry action.

## Interaction and technical validation

- Mobile Menu opens; its Youth link returns to `/youth`.
- Explore youth cricket navigates to `#discover`, with the section heading unobstructed.
- Get in touch navigates to the existing contact page with its Youth cricket topic available.
- Both primary enquiry links have the correct `mailto:info@eindhovencc.com` destination and encoded youth-enquiry subject/body. No email was sent or external mail application launched during QA; draft handling depends on the visitor's email app.
- All page images loaded successfully in the production browser review.
- Browser warning/error logs checked: none on the Youth page.
- `npm run typecheck`: passed. Final `npm run build`: passed, including TypeScript and static generation of `/youth`.
- Temporary viewport overrides reset; preview tab retained.

## Follow-up polish

- [P3] The concept's extra hand-drawn arrows, decorative ball illustration and scattered strokes are omitted; photographic prints and handwritten captions carry the scrapbook styling. This does not affect navigation or content.
- The full concept uses a simplified navigation bar; the implementation retains all existing club navigation destinations and shared announcement/login behavior.

## Implementation checklist

- [x] Replace Youth placeholder with selected scrapbook layout.
- [x] Place supplied photographs and retain their real subjects.
- [x] Connect enquiry, discovery, contact and navigation links.
- [x] Inspect desktop, phone, narrow-phone and tablet bounds.
- [x] Correct photo crop and caption findings and recheck.
- [x] Pass production build and preserve local preview.

## Follow-up: include the remaining photographs

At the user's request, added the parents/supporters photograph (`1000154782.jpg`) and the wider player-meeting photograph (`1000154784.jpg`) in an additional cream scrapbook section before the closing invitation. This is an intentional extension to the selected concept. All six supplied images now appear on the page.

The existing hero and other sections retain their approved design. New prints use the same off-white borders, gentle rotations, shadows, Caveat captions, Barlow headings, and club colors. Both images retain their natural aspect ratios, with all subjects visible; the desktop grid becomes a stacked composition on mobile.

Follow-up evidence: `.tmp/youth-qa/family-desktop.png` and `family-mobile.png`, inspected at 1440 × 1000 and 390 × 844 CSS pixels. Both images loaded successfully; no horizontal overflow or browser warnings/errors. Production build, including TypeScript, passed after this change. No actionable P0/P1/P2 findings. The earlier full-page comparison documents the original page before this requested extension.

final result: passed
