/* Domain types mirroring the database schema.
   Used by both static data files and future Supabase queries. */

export type NoticeType = 'circular' | 'notice' | 'event' | 'holiday' | 'result'
export type Department = 'primary' | 'maths_science' | 'languages' | 'social_science' | 'administration' | 'support'
export type GalleryCategory = string // Allow any custom category
export type DownloadCategory = 'forms' | 'syllabus' | 'timetable' | 'circular' | 'other'
export type EnquiryStatus = 'new' | 'contacted' | 'closed'
export type UserRole = 'admin' | 'editor' | 'viewer'

export interface Notice {
  id: string
  slug: string
  title_en: string
  title_hi: string
  body_en: string | null
  body_hi: string | null
  type: NoticeType
  attachment_url: string | null
  attachment_download_url?: string | null
  attachment_filename?: string | null
  driveFileId?: string | null
  published_at: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  slug: string
  name_en: string
  name_hi: string
  designation_en: string
  designation_hi: string
  department: Department
  subject_en: string | null
  subject_hi: string | null
  qualification: string | null
  bio_en: string | null
  bio_hi: string | null
  photo_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  caption_en: string | null
  caption_hi: string | null
  category: GalleryCategory
  // Event metadata for grouping
  event_name_en?: string | null
  event_name_hi?: string | null
  event_date?: string | null
  event_description_en?: string | null
  event_description_hi?: string | null

  taken_on: string | null
  display_order: number
  is_published: boolean
  created_at: string
}

export interface Result {
  id: string
  exam_year: number
  board: string
  class_level: '10' | '12'
  stream: string | null
  total_appeared: number | null
  total_passed: number | null
  pass_percentage: number | null
  first_division: number | null
  second_division: number | null
  third_division: number | null
  is_published: boolean
  published_at: string | null
}

export interface Topper {
  id: string
  result_id: string
  student_name: string
  percentage: number | null
  stream: string | null
  photo_url: string | null
  rank: number | null
  consent_on_file: boolean
}

export interface AdmissionEnquiry {
  id: string
  student_name: string
  guardian_name: string | null
  phone: string
  email: string | null
  class_applying: string | null
  message: string | null
  status: EnquiryStatus
  created_at: string
}

export interface Download {
  id: string
  title_en: string
  title_hi: string
  file_url: string
  category: DownloadCategory
  file_size_kb: number | null
  is_published: boolean
  uploaded_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
}
