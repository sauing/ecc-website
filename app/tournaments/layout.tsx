import { TournamentProvider } from "./store";
export default function Layout({children}:{children:React.ReactNode}){return <TournamentProvider>{children}</TournamentProvider>;}
