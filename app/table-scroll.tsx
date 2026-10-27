import type { ReactNode } from "react";

export default function TableScroll({ children, className, label }: { children: ReactNode; className: string; label: string }) {
  return <>
    <p className="mobile-table-hint">Swipe or scroll sideways to see every column.</p>
    <div className={`${className} table-region`} role="region" aria-label={`${label}. Scroll horizontally for more columns.`} tabIndex={0}>{children}</div>
  </>;
}
