-- IBEX Institute — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  cnic TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  program TEXT NOT NULL,
  test_type TEXT,
  matric_marks INTEGER,
  matric_total INTEGER DEFAULT 1100,
  inter_marks INTEGER,
  inter_total INTEGER DEFAULT 1100,
  school_name TEXT,
  college_name TEXT,
  batch_preference TEXT,
  emergency_contact TEXT,
  status TEXT DEFAULT 'applied',
  notes TEXT
);

-- Top Positions
CREATE TABLE IF NOT EXISTS top_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  board TEXT,
  test_type TEXT NOT NULL,
  year TEXT DEFAULT EXTRACT(YEAR FROM NOW())::TEXT,
  rank INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  duration TEXT,
  timing TEXT,
  batch_size TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  duration TEXT,
  timing TEXT,
  eligibility TEXT,
  scholarship_info TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements (What's New)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'announcement',
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT DEFAULT 'Explore Programs',
  cta_link TEXT DEFAULT '#programs',
  badge_text TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed default programs
INSERT INTO programs (slug, title, tagline, description, features, duration, timing, batch_size) VALUES
('entry-test', 'Entry Test Preparation', 'Your Gateway to Top Universities',
 'Comprehensive preparation for MDCAT, ECAT, NTS, and all major entry tests.',
 ARRAY['MDCAT, ECAT, NTS & all entry tests', 'Weekly full-length mock exams', 'One-on-one doubt-clearing sessions', 'Detailed performance tracking', 'Past paper practice with explanations', 'Shortcut techniques & concept building'],
 '6 - 12 Months', 'Morning & Evening batches', 'Max 25 students')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO programs (slug, title, tagline, description, features, duration, timing, batch_size) VALUES
('evening-coaching', 'Evening Coaching', 'Strengthen Your Academic Foundation',
 'Subject-specific coaching for Matric and Intermediate students alongside regular schooling.',
 ARRAY['Matric & Intermediate all subjects', 'Experienced subject specialists', 'Homework help & assignment support', 'Regular chapter-wise tests', 'Parent progress reports', 'Flexible evening schedule'],
 'Full Academic Year', '4 PM – 8 PM Daily', 'Small Groups')
ON CONFLICT (slug) DO NOTHING;

-- Seed default sessions
INSERT INTO sessions (slug, title, subtitle, description, features, duration, timing, eligibility) VALUES
('pre-9th', 'Pre-9th Session', 'Foundation Building for Future Leaders',
 'A special preparatory session designed to build a strong academic foundation before students enter the 9th grade.',
 ARRAY['Complete syllabus coverage for 9th grade prep', 'Mathematics & Sciences focus', 'English language strengthening', 'Study skills and exam techniques', 'Regular assessments and feedback', 'Small batch for individual attention'],
 '3 Months (Summer)', 'Morning: 8 AM – 12 PM', '8th Grade Completed')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sessions (slug, title, subtitle, description, features, duration, timing, eligibility) VALUES
('r-session', 'R Session (Regular)', 'Year-Round Academic Excellence',
 'Our flagship regular session providing consistent academic coaching throughout the year for Matric and Intermediate students.',
 ARRAY['Full-year curriculum coverage', 'All core and elective subjects', 'Monthly performance assessments', 'Parent-teacher meetings', 'Study material included', 'Expert faculty for all subjects'],
 'Full Academic Year', '4 PM – 8 PM', 'Matric / Intermediate Students')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sessions (slug, title, subtitle, description, features, duration, timing, eligibility, scholarship_info) VALUES
('t-session-scholarship', 'T Session Scholarship', 'Recognizing and Rewarding Merit',
 'An exclusive scholarship session for talented students who demonstrate exceptional academic merit. Get quality education at subsidized or zero fees.',
 ARRAY['Merit-based selection process', 'Full or partial scholarship', 'All subjects covered', 'Extra mentorship and guidance', 'Priority enrollment for exams', 'Certificate of merit upon completion'],
 'Full Academic Year', 'Morning & Evening', 'Merit-based selection — Min. 80% marks',
 'Scholarships of 50% to 100% fee waiver based on merit. Apply with your latest marksheet.')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample top positions
INSERT INTO top_positions (name, marks_obtained, total_marks, board, test_type, year, rank, image_url) VALUES
('Ahmad Hassan', 185, 200, 'UHS', 'MDCAT', '2024', 1, 'https://randomuser.me/api/portraits/men/1.jpg'),
('Fatima Zainab', 183, 200, 'UHS', 'MDCAT', '2024', 2, 'https://randomuser.me/api/portraits/women/1.jpg'),
('Muhammad Bilal', 182, 200, 'UHS', 'MDCAT', '2024', 3, 'https://randomuser.me/api/portraits/men/2.jpg'),
('Sana Malik', 180, 200, 'UHS', 'MDCAT', '2024', 4, 'https://randomuser.me/api/portraits/women/2.jpg'),
('Usman Tariq', 179, 200, 'UHS', 'MDCAT', '2024', 5, 'https://randomuser.me/api/portraits/men/3.jpg'),
('Ayesha Noor', 450, 500, 'Bahawalpur Board', 'ECAT', '2024', 1, 'https://randomuser.me/api/portraits/women/3.jpg'),
('Ali Raza', 445, 500, 'Bahawalpur Board', 'ECAT', '2024', 2, 'https://randomuser.me/api/portraits/men/4.jpg'),
('Hina Bashir', 440, 500, 'Bahawalpur Board', 'ECAT', '2024', 3, 'https://randomuser.me/api/portraits/women/4.jpg'),
('Zain Ahmed', 1090, 1100, 'Bahawalpur Board', 'Matric', '2024', 1, 'https://randomuser.me/api/portraits/men/5.jpg'),
('Mahnoor Aslam', 1085, 1100, 'Bahawalpur Board', 'Matric', '2024', 2, 'https://randomuser.me/api/portraits/women/5.jpg'),
('Hamza Khan', 1080, 1100, 'Bahawalpur Board', 'Matric', '2024', 3, 'https://randomuser.me/api/portraits/men/6.jpg'),
('Sara Iqbal', 1075, 1100, 'Bahawalpur Board', 'Inter', '2024', 1, 'https://randomuser.me/api/portraits/women/6.jpg');

-- Seed hero slides
INSERT INTO hero_slides (title, subtitle, description, cta_text, cta_link, badge_text, order_index) VALUES
('Unlock Your Academic Potential', 'IBEX Institute — Bahawalpur', 'Punjab''s most trusted preparatory institute for Entry Tests and Evening Coaching. Expert faculty, proven results.', 'Explore Programs', '#programs', 'Admissions Open 2024', 0),
('MDCAT & ECAT Entry Test Preparation', 'Score in the Top 5%', 'Comprehensive preparation with mock exams, shortcut techniques, and one-on-one mentorship from expert faculty.', 'Apply for Entry Test', '/apply/entry-test', 'New Batch Starting Soon', 1),
('Evening Coaching for Excellence', 'Matric & Intermediate', 'Boost your grades with expert subject coaching every evening. Small batches, personalized attention, guaranteed results.', 'Join Evening Coaching', '/apply/evening-coaching', 'Flexible Timings', 2),
('T Session Scholarship Program', 'Merit-Based Scholarships', 'Talented students get 50% to 100% fee waiver. Apply now with your merit certificate and secure your academic future.', 'Apply for Scholarship', '/apply/entry-test', 'Limited Seats Available', 3),
('98% Success Rate — 10 Years Strong', 'Over 5000 Students Placed', 'A decade of excellence in Bahawalpur. Join thousands of successful IBEX alumni in top universities and careers.', 'Our Top Achievers', '/top-position', 'Bahawalpur''s #1 Institute', 4);

-- Seed sample news
INSERT INTO news (title, content, category, published_at) VALUES
('MDCAT 2024 Results — IBEX Students Shine', 'Congratulations to all IBEX students who appeared in MDCAT 2024. We are proud to announce that 97% of our students have qualified with exceptional scores. A special congratulations to Ahmad Hassan who scored 185/200.', 'results', NOW() - INTERVAL '2 days'),
('New Batch Starting — Evening Coaching January 2025', 'We are excited to announce a new batch for our Evening Coaching program starting January 15, 2025. Limited seats available. Contact us today to secure your spot.', 'admissions', NOW() - INTERVAL '5 days'),
('T Session Scholarship Applications Open', 'Applications for the T Session Scholarship 2025 are now open. Students with 80% or above marks in their last exam are eligible. Merit-based scholarships of up to 100% available.', 'scholarship', NOW() - INTERVAL '1 week'),
('IBEX Ranks #1 in Bahawalpur for ECAT Results', 'For the third consecutive year, IBEX Institute has produced the highest number of ECAT qualifiers in Bahawalpur. Our rigorous preparation methodology continues to deliver outstanding results.', 'achievement', NOW() - INTERVAL '2 weeks');

-- Seed announcements
INSERT INTO announcements (title, content, type, published_at) VALUES
('Fee Submission Deadline — January 31, 2025', 'All enrolled students must submit their fees for the new session by January 31, 2025. Late submissions will incur a penalty.', 'alert', NOW() - INTERVAL '1 day'),
('Updated Study Schedule for Pre-Board Exams', 'The study schedule for pre-board exams has been updated. Students are requested to check the notice board or contact their class teachers.', 'update', NOW() - INTERVAL '3 days'),
('Parent-Teacher Meeting — February 5, 2025', 'A parent-teacher meeting is scheduled for February 5, 2025 from 10 AM to 1 PM. Parents are requested to attend without fail.', 'announcement', NOW() - INTERVAL '1 week');
