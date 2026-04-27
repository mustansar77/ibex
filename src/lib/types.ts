export type ApplicationStatus = "applied" | "enrolled" | "rejected";

export type TestType = "MDCAT" | "ECAT" | "NTS" | "GAT" | "Other";

export type ProgramSlug = "entry-test" | "evening-coaching";

export type SessionSlug = "pre-9th" | "r-session" | "t-session-scholarship";

export interface Application {
  id: string;
  created_at: string;
  name: string;
  father_name: string;
  cnic: string;
  email: string;
  phone: string;
  address: string;
  program: ProgramSlug;
  test_type: TestType | null;
  matric_marks: number | null;
  matric_total: number | null;
  inter_marks: number | null;
  inter_total: number | null;
  school_name: string | null;
  college_name: string | null;
  batch_preference: string | null;
  emergency_contact: string | null;
  status: ApplicationStatus;
  notes: string | null;
}

export interface TopPosition {
  id: string;
  created_at: string;
  name: string;
  marks_obtained: number;
  total_marks: number;
  board: string;
  test_type: string;
  year: string;
  rank: number;
  image_url: string | null;
  is_active: boolean;
}

export interface Program {
  id: string;
  slug: ProgramSlug;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  duration: string;
  timing: string;
  batch_size: string;
  is_active: boolean;
  updated_at: string;
}

export interface Session {
  id: string;
  slug: SessionSlug;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  duration: string;
  timing: string;
  eligibility: string;
  scholarship_info: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  published_at: string;
}

export interface Announcement {
  id: string;
  created_at: string;
  title: string;
  content: string;
  type: "announcement" | "update" | "alert";
  is_active: boolean;
  published_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  badge_text: string;
  order_index: number;
  is_active: boolean;
}
