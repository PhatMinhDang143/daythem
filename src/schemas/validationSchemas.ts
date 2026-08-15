import { z } from 'zod';

// Phone number regex for Vietnamese phone numbers (10 digits starting with 0)
const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

// Student Schema
export const studentSchema = z.object({
  name: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  gender: z.enum(['Nam', 'Nữ']),
  dob: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  school: z.string().trim().min(2, 'Vui lòng nhập tên trường học'),
  grade: z.string().min(1, 'Vui lòng chọn khối lớp'),
  parentName: z.string().trim().min(2, 'Tên phụ huynh phải có ít nhất 2 ký tự'),
  parentPhone: z.string().trim().regex(phoneRegex, 'Số điện thoại phụ huynh không hợp lệ (ví dụ: 0912345678)'),
  parentEmail: z.string().trim().email('Email không đúng định dạng').optional().or(z.literal('')),
  address: z.string().trim().min(3, 'Vui lòng nhập địa chỉ đầy đủ'),
  enrolledClasses: z.array(z.string()).min(1, 'Học sinh phải đăng ký ít nhất 1 lớp học'),
  status: z.enum(['Đang học', 'Nghỉ học', 'Bảo lưu']),
  notes: z.string().optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;

// Class Schema
export const classSchema = z.object({
  name: z.string().trim().min(3, 'Tên lớp phải từ 3 ký tự trở lên'),
  subject: z.enum(['Tiếng Anh', 'Toán', 'Vật Lý', 'Hóa Học', 'Ngữ Văn']),
  gradeLevel: z.string().min(1, 'Vui lòng chọn khối lớp'),
  teacherId: z.string().min(1, 'Vui lòng chọn giáo viên phụ trách'),
  teacherName: z.string().min(1, 'Tên giáo viên không được để trống'),
  assistantId: z.string().optional(),
  assistantName: z.string().optional(),
  roomName: z.string().trim().min(1, 'Vui lòng nhập tên phòng học'),
  scheduleDescription: z.string().trim().min(3, 'Vui lòng nhập lịch học đầy đủ'),
  daysOfWeek: z.array(z.number()).min(1, 'Vui lòng chọn ít nhất 1 ngày học trong tuần'),
  timeSlot: z.string().trim().min(1, 'Vui lòng nhập ca học'),
  tuitionFeePerSession: z.number().min(0, 'Học phí theo buổi không được âm'),
  tuitionFeePerMonth: z.number().min(0, 'Học phí theo tháng không được âm'),
  maxCapacity: z.number().min(1, 'Sĩ số tối đa ít nhất là 1').max(200, 'Sĩ số quá lớn'),
  status: z.enum(['Đang mở', 'Sắp khai giảng', 'Đã kết thúc']),
  startDate: z.string().min(1, 'Vui lòng chọn ngày khai giảng'),
});

export type ClassInput = z.infer<typeof classSchema>;

// Invoice Schema
export const invoiceSchema = z.object({
  studentId: z.string().min(1, 'Vui lòng chọn học sinh'),
  classId: z.string().min(1, 'Vui lòng chọn lớp học'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Định dạng tháng phải là YYYY-MM (Ví dụ: 2026-08)'),
  originalAmount: z.number().min(0, 'Học phí gốc không được âm'),
  discountAmount: z.number().min(0, 'Mức giảm giá không được âm'),
  discountReason: z.string().optional(),
  dueDate: z.string().min(1, 'Vui lòng chọn hạn nộp học phí'),
  note: z.string().optional(),
}).refine((data) => data.discountAmount <= data.originalAmount, {
  message: 'Số tiền giảm giá không được lớn hơn học phí gốc',
  path: ['discountAmount'],
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// Expense Schema
export const expenseSchema = z.object({
  title: z.string().trim().min(3, 'Tên khoản chi phải từ 3 ký tự trở lên'),
  category: z.enum(['Lương Giáo Viên', 'Cơ Sở Vật Chất', 'Marketing', 'Điện Nước Internet', 'Chi Khác']),
  amount: z.number().gt(0, 'Số tiền chi phải lớn hơn 0'),
  date: z.string().min(1, 'Vui lòng chọn ngày chi'),
  paidTo: z.string().trim().min(2, 'Vui lòng nhập người/đơn vị nhận tiền'),
  paymentMethod: z.enum(['Chuyển khoản', 'Tiền mặt', 'Ví điện tử']),
  notes: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
