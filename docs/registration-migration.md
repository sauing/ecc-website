# ECC registration migration

## Delivered
- `/youth`: intentional “To be created” placeholder.
- `/membership`: native, responsive catalogue of five publicly listed 2026 programmes.
- Main navigation and Join ECC link to the new routes.
- No SportsPlus embed, personal-data collection, payment or submission simulation.

## Source review — 15 October 2026
Source: https://www.eindhovencc.com/registration
Senior annual, Student annual, Women annual, Lagere Klassen T20 and Practice membership were visible. Programme dates are not registration windows. Most detail pages could not be fetched. Practice details contained conflicting availability labels; do not copy these as live availability. Fees and eligibility need verification before publication.

## Still needed to replace SportsPlus registration
- Club-approved programme definitions, fees, eligibility and opening/closing dates.
- Confirm registration fields and existing member renewal requirements.
- Authenticated member accounts, server validation and persistent applications.
- Restricted admin review, programme editing and membership status management.
- Approved policy/waiver text with versioned acceptance records; privacy and retention decisions.
- Payment provider choice (existing system mentions iDEAL), signed webhook verification, reconciliation and refunds.
- Confirmation emails, error handling and duplicate-submission protection.
- Authorized export and migration of existing members; no private records have been accessed.

The catalogue is the first UI stage, not a completed registration backend.
