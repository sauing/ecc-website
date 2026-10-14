export type ClubNotice = {
  message: string;
  action?: { label: string; href: string };
};

// Public display content only. Admin editing and server-enforced publishing
// permissions will be connected when the admin dashboard is implemented.
// Set to null when there is no current announcement.
export const clubNotice: ClubNotice | null = null;
