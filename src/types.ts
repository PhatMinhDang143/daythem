export type UserRole = 'Admin' | 'Giáo viên' | 'Trợ giảng' | 'Kế toán';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  assignedClasses?: string[]; // IDs of classes assigned
  status: 'Hoạt động' | 'Tạm khóa';
  password?: string;
}

export type StudentStatus = 'Đang học' | 'Nghỉ học' | 'Bảo lưu';

export interface Student {
  id: string;
  code: string; // e.g., HS-2026-001
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  school: string;
  grade: string; // e.g., "Khối 10", "Khối 11", "Khối 12"
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  enrolledClasses: string[]; // Class IDs
  status: StudentStatus;
  joinedDate: string;
  notes?: string;
  avatar?: string;
}

export type ClassStatus = 'Đang mở' | 'Sắp khai giảng' | 'Đã kết thúc';

export interface ClassRoom {
  id: string;
  code: string; // e.g., TA-10A1
  name: string;
  subject: 'Tiếng Anh' | 'Toán' | 'Vật Lý' | 'Hóa Học' | 'Ngữ Văn';
  gradeLevel: string; // "Lớp 10", "Lớp 11", "Lớp 12", "Lớp 9"
  teacherId: string;
  teacherName: string;
  assistantId?: string;
  assistantName?: string;
  roomName: string;
  scheduleDescription: string; // e.g. "Thứ 2, 4 (18:00 - 19:30)"
  daysOfWeek: number[]; // 1=Mon, 2=Tue, ..., 7=Sun
  timeSlot: string; // "18:00 - 19:30"
  tuitionFeePerSession: number; // e.g., 150000 VND
  tuitionFeePerMonth: number; // e.g., 1200000 VND
  maxCapacity: number; // e.g., 20
  currentEnrolled: number;
  status: ClassStatus;
  startDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late'; // Có mặt, Vắng mặt, Có phép, Đi trễ

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface SessionDetail {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  topic: string; // Nội dung bài dạy
  objective: string; // Mục tiêu buổi học
  qualityRating: 'Xuất sắc' | 'Tốt' | 'Đạt' | 'Cần cải thiện';
  homeworkAssigned: string;
  entries: Record<string, AttendanceStatus>; // studentId -> status
  notesPerStudent?: Record<string, string>; // studentId -> note
}

export type RatingLevel = 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';

export interface StudentEvaluation {
  id: string;
  studentId: string;
  classId: string;
  month: string; // YYYY-MM
  attitude: RatingLevel;
  homeworkQuality: RatingLevel;
  progress: RatingLevel;
  skillLevel: RatingLevel;
  overallRank: RatingLevel;
  teacherComment: string;
  updatedAt: string;
}

export type TestType = 'Oral' | '15Min' | '1Period' | 'MidTerm' | 'Final';

export interface TestScore {
  id: string;
  classId: string;
  testName: string; // e.g., "Bài test định kỳ số 1"
  testType: TestType;
  weight: number; // 0.1, 0.15, 0.25, 0.2, 0.3
  date: string;
  scores: Record<string, number>; // studentId -> score (0-10)
}

export type InvoiceStatus = 'Đã thanh toán' | 'Chưa thanh toán' | 'Quá hạn' | 'Bảo lưu';
export type PaymentMethod = 'Chuyển khoản' | 'Tiền mặt' | 'Ví điện tử';

export interface Invoice {
  id: string;
  code: string; // HD-2026-001
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  month: string; // YYYY-MM
  originalAmount: number;
  discountAmount: number;
  discountReason?: string;
  finalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  note?: string;
}

export interface Expense {
  id: string;
  code: string; // PC-2026-001
  title: string;
  category: 'Lương Giáo Viên' | 'Cơ Sở Vật Chất' | 'Marketing' | 'Điện Nước Internet' | 'Chi Khác';
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
  status: 'Đã chi' | 'Chờ duyệt';
  notes?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  totalRevenueThisMonth: number;
  revenueGrowthPercent: number;
  totalUnpaidTuition: number;
  averageAttendanceRate: number;
}

export interface CenterSettings {
  centerName: string;
  hotline: string;
  email: string;
  address: string;
  currentAcademicYear: string;
  currentSemester: string;
  defaultFeePerSession: number;
  defaultFeePerMonth: number;
  defaultDueDateDay: number;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  zaloTemplateReminder: string;
  zaloTemplateEvaluation: string;
  customLogoUrl?: string;
}

