export type Tournament = { id:string; name:string; date:string; format:string; fee:number; capacity:number; deadline:string; description:string; image:string; state:"Open"|"Waitlist"|"Coming soon"|"Draft"; };
export type Entry = { id:string; tournament:string; team:string; status:"Submitted"|"Approved"|"Confirmed"|"Waitlisted"|"Cancelled"; payment:"Pending"|"Paid"|"Not requested"|"Refund pending"|"Refunded"; amount:number; squad:string[]; };
export const tournaments: Tournament[] = [
  {id:"summer-cup",name:"ECC Summer Cup",date:"2027-07-12",format:"T10",fee:150,capacity:8,deadline:"2027-06-28",description:"A fast-paced T10 tournament bringing clubs and communities together for a day of competitive cricket, good food and great company at Eindhoven Cricket Club.",image:"/images/stats/ecc-batting.jpg",state:"Open"},
  {id:"six-a-side",name:"ECC Six-a-Side",date:"2027-08-29",format:"T6",fee:100,capacity:12,deadline:"2027-08-15",description:"Shorter format. Bigger moments. A one-day six-a-side tournament for clubs, social teams and friends.",image:"/images/gallery/champions.jpg",state:"Waitlist"},
  {id:"community-day",name:"Community Cricket Day",date:"2027-09-19",format:"Festival",fee:0,capacity:16,deadline:"2027-09-05",description:"A celebration of cricket in Eindhoven. Fun matches, coaching sessions and activities for everyone.",image:"/images/gallery/youth-1.jpg",state:"Coming soon"},
];
export const initialEntries: Entry[] = [
 ...["Eindhoven Challengers","Amsterdam Aces","The Hague Hawks","Delft Dynamites","Tilburg Tigers","Breda Blazers"].map((team,i):Entry=>({id:`ECC-T0${27+i}`,tournament:"summer-cup",team,status:"Confirmed",payment:"Paid",amount:150,squad:i===0?["Alex Demo — Captain","Sam Example","Robin Sample"]:[]})),
 {id:"ECC-T033",tournament:"summer-cup",team:"Rotterdam XI",status:"Approved",payment:"Pending",amount:150,squad:[]},
 {id:"ECC-T034",tournament:"summer-cup",team:"Utrecht Strikers",status:"Waitlisted",payment:"Not requested",amount:150,squad:[]},
];
export const money = (value:number) => `€${value.toLocaleString("en-GB")}`;
export const dateLabel = (value:string) => new Date(`${value}T12:00:00Z`).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
export const confirmedCount = (entries:Entry[], id:string) => entries.filter(e=>e.tournament===id&&e.status==="Confirmed").length;
export const reservedCount = (entries:Entry[], id:string) => entries.filter(e=>e.tournament===id&&["Approved","Confirmed"].includes(e.status)).length;
