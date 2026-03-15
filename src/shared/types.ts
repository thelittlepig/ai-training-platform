// 共享类型定义

export type UserRole = 'admin' | 'instructor' | 'learner';
export type UserStatus = 'pending' | 'active' | 'disabled';
export type CourseStatus = 'draft' | 'published';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalType = 'registration' | 'enrollment';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  instructor_id: string;
  status: CourseStatus;
  created_at: Date;
  category?: 'ai-basics' | 'teacher-training' | 'llm' | 'ai-product';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  student_count?: number;
  tags?: string[];
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order: number;
  created_at: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'video' | 'ppt' | 'notebook' | 'zip' | 'image';
  file_size: number;
  uploaded_by: string;
  is_public: boolean;
  created_at: Date;
  resource_type?: 'video' | 'slides' | 'handout' | 'lab' | 'toolkit';
  download_count?: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  progress: number;
  enrolled_at: Date;
  completed_at?: Date | null;
  study_time?: number;
  enrollment_info?: {
    phone: string;
    organization: string;
    position: string;
    tech_level: 'beginner' | 'intermediate' | 'advanced';
    identity: 'student' | 'teacher' | 'enterprise' | 'iflytek' | 'individual';
    learning_goal?: string;
    wechat?: string;
    backup_email?: string;
  } | null;
}

export interface Download {
  id: string;
  user_id: string;
  resource_id: string;
  downloaded_at: Date;
}

export interface ApprovalRequest {
  id: string;
  user_id: string;
  type: ApprovalType;
  ref_id: string | null;
  status: ApprovalStatus;
  reviewed_by: string | null;
  reviewed_at: Date | null;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
