export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  longDescription: string;
  duration: string;
  subservices: string[];
  documents: string[];
  steps: string[];
  fee: string;
};

export type Lawyer = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  tags: string[];
  experience: string;
  image?: string;
  bio: string;
  education: string[];
  placeholder?: boolean;
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  content: { heading: string; paragraphs: string[] }[];
};

export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export type MembershipPlan = {
  slug: string;
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  period: string;
  roomHours: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  excluded?: string[];
};

export type Room = {
  slug: string;
  name: string;
  capacity: string;
  area: string;
  vibe: string;
  description: string;
  equipment: string[];
  memberPrice: string;
  guestPrice: string;
  icon: string;
};

export type ClubEvent = {
  slug: string;
  title: string;
  type: 'نشست علمی' | 'کارگاه' | 'میزگرد' | 'دورهمی';
  date: string;
  time: string;
  speaker: string;
  speakerRole: string;
  seats: string;
  fee: string;
  summary: string;
};
