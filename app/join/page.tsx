import JoinFlow from "./join-flow";
import {isConfigured} from "../../lib/admin/service";
export const metadata={title:"Join ECC | Create your account",description:"Create your Eindhoven Cricket Club account with Google, add your contact details and choose a membership later."};
export const dynamic="force-dynamic";
export default function JoinPage(){return <JoinFlow enabled={isConfigured()&&process.env.AUTH_GOOGLE_ENABLED==="true"}/>;}
