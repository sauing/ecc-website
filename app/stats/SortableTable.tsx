"use client";

import { useMemo, useState } from "react";

type Row = Record<string, string> & { player: string };

export default function SortableTable({ rows, columns, initialSort }: { rows: Row[]; columns: { key: string; label: string }[]; initialSort?: string }) {
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(initialSort ? { key: initialSort, direction: "desc" } : null);
  const sorted = useMemo(() => [...rows].sort((a, b) => {
    if (!sort) return 0;
    if (sort.key === "player") return sort.direction === "asc" ? a.player.localeCompare(b.player) : b.player.localeCompare(a.player);
    const parse = (value: string) => sort.key === "overs" ? (Number(value.split(".")[0]) || 0) * 6 + (Number(value.split(".")[1]) || 0) : Number.parseFloat(value) || 0;
    const av = parse(a[sort.key]);
    const bv = parse(b[sort.key]);
    if (av !== bv) return sort.direction === "asc" ? av - bv : bv - av;
    return a.player.localeCompare(b.player);
  }), [rows, sort]);
  function choose(key: string) { setSort((current) => current?.key === key ? { key, direction: current.direction === "asc" ? "desc" : "asc" } : { key, direction: "desc" }); }
  return <div className="stat-table"><table><thead><tr><th>#</th>{columns.map((column) => <th key={column.key}><button className="sort-button" onClick={() => choose(column.key)}>{column.label} <span>{sort?.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</span></button></th>)}</tr></thead><tbody>{sorted.map((row, index) => <tr key={row.player}><td>{index + 1}</td>{columns.map((column) => <td key={column.key} className={column.key === "player" ? "player-cell" : ""}>{column.key === "player" ? <>{row.player}<small className="stat-player-club">Eindhoven CC</small></> : row[column.key]}</td>)}</tr>)}</tbody></table></div>;
}
