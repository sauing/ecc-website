"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { tournaments, initialEntries, type Tournament, type Entry } from "./data";
type Store = { events:Tournament[]; setEvents:React.Dispatch<React.SetStateAction<Tournament[]>>; entries:Entry[]; setEntries:React.Dispatch<React.SetStateAction<Entry[]>>; active:string; setActive:(id:string)=>void; };
const Context = createContext<Store|null>(null);
// Deliberately in-memory: no authentication, real payment records or personal data storage.
export function TournamentProvider({children}:{children:ReactNode}) {
 const [events,setEvents]=useState(tournaments);
 const [entries,setEntries]=useState(initialEntries);
 const [active,setActive]=useState("ECC-T027");
 return <Context.Provider value={{events,setEvents,entries,setEntries,active,setActive}}>{children}</Context.Provider>;
}
export function useTournaments(){const value=useContext(Context);if(!value)throw new Error("Tournament provider missing");return value;}
