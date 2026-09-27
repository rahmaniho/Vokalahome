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
