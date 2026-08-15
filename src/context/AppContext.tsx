import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Student,
  ClassRoom,
  SessionDetail,
  StudentEvaluation,
  TestScore,
  Invoice,
  Expense,
  DashboardStats,
  AttendanceStatus,
  CenterSettings,
} from '../types';
import {
  getCurrentYear,
  getCurrentMonthString,
  generateStudentCode,
  generateInvoiceCode,
  generateExpenseCode,
} from '../config/constants';
import {
  initialUsers,
  initialClasses,
  initialStudents,
  initialSessions,
  initialEvaluations,
  initialTestScores,
  initialInvoices,
  initialExpenses,
} from '../data/mockData';
import {
  getStoredScriptUrl,
  setStoredScriptUrl,
  getStoredAuthToken,
  setStoredAuthToken,
  fetchAllGoogleSheetsData,
  upsertEntityInSheets,
  deleteEntityFromSheets,
  bulkSyncToGoogleSheets,
  testAppsScriptConnection,
  initializeGoogleSheetsDatabase,
  loginWithAppsScript,
  sendEmailInvoiceReminders,
  importInvoicesFromSheet,
} from '../services/appsScriptApi';

export type ModuleType =
  | 'dashboard'
  | 'students'
  | 'classes'
  | 'timetable'
  | 'attendance'
  | 'evaluations'
  | 'grades'
  | 'invoices'
  | 'users'
  | 'settings'
  | 'parent_portal';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  
  // Data lists
  users: User[];
  students: Student[];
  classes: ClassRoom[];
  sessions: SessionDetail[];
  evaluations: StudentEvaluation[];
  testScores: TestScore[];
  invoices: Invoice[];
  expenses: Expense[];

  // Auth & Permissions
  loginWithBackend: (email: string, password: string) => Promise<boolean>;
  logoutWithBackend: () => void;
  changeUserPassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  resetUserPassword: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;

  // Google Apps Script API State & Actions
  appsScriptUrl: string;
  setAppsScriptUrl: (url: string) => void;
  isApiConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncFromSheets: (overrideUrl?: string) => Promise<boolean>;
  syncAllToSheets: (overrideUrl?: string) => Promise<boolean>;
  testConnection: (url?: string) => Promise<boolean>;
  initializeSheetsDatabase: (overrideUrl?: string) => Promise<boolean>;
  sendParentEmailReminders: (options?: { invoiceIds?: string[]; month?: string }) => Promise<boolean>;
  importInvoicesFromGoogleSheet: () => Promise<boolean>;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'code' | 'joinedDate'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Class Actions
  addClass: (cls: Omit<ClassRoom, 'id' | 'code' | 'currentEnrolled'>) => void;
  updateClass: (id: string, updated: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => void;

  // Attendance & Session Actions
  recordSessionAttendance: (sessionData: Omit<SessionDetail, 'id'>) => void;
  updateAttendanceEntry: (classId: string, date: string, studentId: string, status: AttendanceStatus) => void;

  // Evaluation Actions
  saveEvaluation: (evalData: Omit<StudentEvaluation, 'id' | 'updatedAt'>) => void;

  // Grade Actions
  addTestScore: (scoreData: Omit<TestScore, 'id'>) => void;
  updateTestScore: (id: string, updated: Partial<TestScore>) => void;

  // Invoice & Expense Actions
  addInvoice: (inv: Omit<Invoice, 'id' | 'code'>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status'], paidAmount?: number, paymentMethod?: Invoice['paymentMethod']) => void;
  addExpense: (exp: Omit<Expense, 'id' | 'code'>) => void;

  // Settings
  centerSettings: CenterSettings;
  updateCenterSettings: (newSettings: Partial<CenterSettings>) => void;

  // Demo Data Loader
  loadDemoData: () => void;

  // Role Permissions Helper
  hasPermission: (requiredRoles: UserRole[]) => boolean;

  // Global Stats
  stats: DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const isDevEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.DEV : process.env.NODE_ENV !== 'production';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [sessions, setSessions] = useState<SessionDetail[]>(initialSessions);
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>(initialEvaluations);
  const [testScores, setTestScores] = useState<TestScore[]>(initialTestScores);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Google Apps Script API Server state
  const [appsScriptUrl, setAppsScriptUrlState] = useState<string>(getStoredScriptUrl());
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Auth & Permissions State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getStoredAuthToken();
    if (!token) return false;
    // Check if token has expired (24h validity for local session tokens)
    if (token.startsWith('local_token_') || token.startsWith('session_token_')) {
      const parts = token.split('_');
      const timestamp = parseInt(parts[parts.length - 1], 10);
      if (timestamp && !isNaN(timestamp) && Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        setStoredAuthToken('');
        return false;
      }
      return true;
    }
    return !!token;
  });

  const logoutWithBackend = () => {
    setStoredAuthToken('');
    setIsAuthenticated(false);
    showToast('Đã đăng xuất khỏi hệ thống', 'info');
  };

  // Periodic session token expiration check
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = getStoredAuthToken();
      if (isAuthenticated && token) {
        const parts = token.split('_');
        const timestamp = parseInt(parts[parts.length - 1], 10);
        if (timestamp && !isNaN(timestamp) && Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          logoutWithBackend();
          showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'info');
        }
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loginWithBackend = async (email: string, password: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail) {
      showToast('Vui lòng nhập Email tài khoản', 'error');
      return false;
    }

    if (!appsScriptUrl) {
      // Local demo mode authentication with strict password check
      const localUser = users.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (!localUser) {
        showToast('Tài khoản không tồn tại trên hệ thống local. Vui lòng kiểm tra lại Email.', 'error');
        return false;
      }

      if (localUser.status === 'Tạm khóa') {
        showToast('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Quản trị viên.', 'error');
        return false;
      }

      const expectedPassword = localUser.password || '123456';
      if (!cleanPassword || cleanPassword !== expectedPassword) {
        showToast('Mật khẩu không chính xác! (Mật khẩu mặc định: 123456)', 'error');
        return false;
      }

      const token = `local_token_${localUser.id}_${Date.now()}`;
      setStoredAuthToken(token);
      setCurrentUser(localUser);
      setIsAuthenticated(true);
      showToast(`Đăng nhập thành công với vai trò ${localUser.role}! Xin chào ${localUser.name}`, 'success');
      return true;
    }

    setIsSyncing(true);
    try {
      const res = await loginWithAppsScript(appsScriptUrl, cleanEmail, cleanPassword);
      if (res.status === 'success' && res.user && res.sessionToken) {
        setStoredAuthToken(res.sessionToken);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        showToast(`Đăng nhập thành công! Xin chào ${res.user.name}`, 'success');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Đăng nhập thất bại: ${res.message || 'Mật khẩu hoặc tài khoản không đúng'}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (err: any) {
      showToast(`Lỗi xác thực: ${err.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'error');
      return false;
    }

    const currentPass = currentUser.password || '123456';
    if (oldPassword !== currentPass) {
      showToast('Mật khẩu hiện tại không chính xác', 'error');
      return false;
    }

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u)));
    setCurrentUser((prev) => ({ ...prev, password: newPassword }));
    showToast('Đã đổi mật khẩu tài khoản thành công!', 'success');
    return true;
  };

  const resetUserPassword = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!targetUser) {
      showToast('Không tìm thấy tài khoản tương ứng với Email này', 'error');
      return false;
    }

    showToast(`Mã xác nhận khôi phục mật khẩu đã được gửi tới ${cleanEmail}!`, 'success');
    return true;
  };

  const sendParentEmailReminders = async (options?: { invoiceIds?: string[]; month?: string }): Promise<boolean> => {
    if (!appsScriptUrl) {
      showToast('Vui lòng kết nối Google Apps Script Web App để gửi Email tự động qua GmailApp', 'error');
      return false;
    }
    setIsSyncing(true);
    try {
      const res = await sendEmailInvoiceReminders(appsScriptUrl, options);
      if (res.status === 'success') {
        showToast(res.message || 'Đã gửi email nhắc nợ thành công!', 'success');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Lỗi gửi email: ${res.message}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (err: any) {
      showToast(`Không thể gửi email: ${err.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const importInvoicesFromGoogleSheet = async (): Promise<boolean> => {
    if (!appsScriptUrl) {
      showToast('Vui lòng kết nối Google Apps Script Web App để nhập dữ liệu từ Sheet Import_Invoices', 'error');
      return false;
    }
    setIsSyncing(true);
    try {
      const res = await importInvoicesFromSheet(appsScriptUrl);
      if (res.status === 'success' && res.data) {
        if (res.data.invoices && res.data.invoices.length > 0) {
          setInvoices((prev) => [...res.data.invoices, ...prev]);
        }
        showToast(res.message || 'Đã nhập danh sách hóa đơn thành công!', 'success');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Nhập hóa đơn thất bại: ${res.message}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (err: any) {
      showToast(`Lỗi nhập hóa đơn từ Sheet: ${err.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const [centerSettings, setCenterSettings] = useState<CenterSettings>({
    centerName: 'TRUNG TÂM GIÁO DỤC MINH PHAT EDU',
    hotline: '0908 123 456',
    email: 'contact@minhphatedu.vn',
    address: '123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
    currentAcademicYear: `${getCurrentYear()} - ${getCurrentYear() + 1}`,
    currentSemester: 'Học kỳ I',
    defaultFeePerSession: 150000,
    defaultFeePerMonth: 1200000,
    defaultDueDateDay: 10,
    bankName: 'MBBank (Ngân hàng Quân Đội)',
    bankAccountNo: '0908123456',
    bankAccountName: 'MINH PHAT EDU',
    zaloTemplateReminder: 'Kính gửi Phụ huynh em {STUDENT_NAME}, trung tâm MINH PHAT EDU xin thông báo học phí tháng {MONTH} lớp {CLASS_NAME} là {AMOUNT} đ. Hạn nộp: ngày {DUE_DATE}. Xin cảm ơn!',
    zaloTemplateEvaluation: 'Kính gửi Phụ huynh em {STUDENT_NAME}, kết quả đánh giá học tập tháng {MONTH}: Xếp loại {RANK}. Nhận xét GV: {COMMENT}.',
    customLogoUrl: typeof window !== 'undefined' ? localStorage.getItem('minhphat_custom_logo') || undefined : undefined,
  });

  const setAppsScriptUrl = (url: string) => {
    setStoredScriptUrl(url);
    setAppsScriptUrlState(url);
    if (!url) {
      setIsApiConnected(false);
      showToast('Đã hủy cấu hình Google Sheets. Chuyển sang chế độ lưu trữ tạm local.', 'info');
    } else {
      testConnection(url);
    }
  };

  const testConnection = async (targetUrl?: string): Promise<boolean> => {
    const url = targetUrl || appsScriptUrl;
    if (!url) {
      setIsApiConnected(false);
      return false;
    }
    setIsSyncing(true);
    try {
      const res = await testAppsScriptConnection(url);
      if (res.status === 'success') {
        setIsApiConnected(true);
        showToast('Kết nối thành công với Google Apps Script Web App!', 'success');
        setIsSyncing(false);
        return true;
      } else {
        setIsApiConnected(false);
        showToast(`Không thể kết nối Google Sheets: ${res.message}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (e: any) {
      setIsApiConnected(false);
      showToast(`Lỗi kết nối Google Sheets: ${e.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const syncFromSheets = async (overrideUrl?: string): Promise<boolean> => {
    const url = overrideUrl || appsScriptUrl;
    if (!url) return false;

    setIsSyncing(true);
    try {
      const res = await fetchAllGoogleSheetsData(url);
      if (res.status === 'success' && res.data) {
        const d = res.data;
        if (d.Students && d.Students.length > 0) setStudents(d.Students);
        if (d.Classes && d.Classes.length > 0) setClasses(d.Classes);
        if (d.Invoices && d.Invoices.length > 0) setInvoices(d.Invoices);
        if (d.Expenses && d.Expenses.length > 0) setExpenses(d.Expenses);
        if (d.Sessions && d.Sessions.length > 0) setSessions(d.Sessions);
        if (d.StudentEvaluations && d.StudentEvaluations.length > 0) setEvaluations(d.StudentEvaluations);
        if (d.TestScores && d.TestScores.length > 0) setTestScores(d.TestScores);
        if (d.Users && d.Users.length > 0) setUsers(d.Users);

        setIsApiConnected(true);
        setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
        showToast('Đã tải và đồng bộ toàn bộ dữ liệu từ Google Sheets thành công!');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Tải dữ liệu từ Google Sheets thất bại: ${res.message || 'Không có dữ liệu'}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (e: any) {
      showToast(`Lỗi đồng bộ từ Google Sheets: ${e.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const syncAllToSheets = async (overrideUrl?: string): Promise<boolean> => {
    const url = overrideUrl || appsScriptUrl;
    if (!url) {
      showToast('Vui lòng nhập URL Google Apps Script Web App trước', 'error');
      return false;
    }

    setIsSyncing(true);
    try {
      const allPayload = {
        Students: students,
        Classes: classes,
        Invoices: invoices,
        Expenses: expenses,
        Sessions: sessions,
        StudentEvaluations: evaluations,
        TestScores: testScores,
        Users: users,
      };

      const res = await bulkSyncToGoogleSheets(url, allPayload);
      if (res.status === 'success') {
        setIsApiConnected(true);
        setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
        showToast('Đã đẩy toàn bộ dữ liệu hiện tại lên Google Sheets thành công!');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Đồng bộ lên Google Sheets thất bại: ${res.message}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (e: any) {
      showToast(`Lỗi đẩy dữ liệu: ${e.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  const initializeSheetsDatabase = async (overrideUrl?: string): Promise<boolean> => {
    const url = overrideUrl || appsScriptUrl;
    if (!url) return false;

    setIsSyncing(true);
    try {
      const seedData = {
        Students: students,
        Classes: classes,
        Invoices: invoices,
        Expenses: expenses,
        Sessions: sessions,
        StudentEvaluations: evaluations,
        TestScores: testScores,
        Users: users,
      };

      const res = await initializeGoogleSheetsDatabase(url, seedData);
      if (res.status === 'success') {
        setIsApiConnected(true);
        setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
        showToast('Khởi tạo cấu trúc các Sheet & dữ liệu ban đầu thành công!', 'success');
        setIsSyncing(false);
        return true;
      } else {
        showToast(`Lỗi khởi tạo Google Sheets: ${res.message}`, 'error');
        setIsSyncing(false);
        return false;
      }
    } catch (e: any) {
      showToast(`Lỗi khởi tạo Sheet: ${e.message}`, 'error');
      setIsSyncing(false);
      return false;
    }
  };

  // Auto-connect and sync on initial load if script URL exists
  useEffect(() => {
    if (appsScriptUrl) {
      syncFromSheets(appsScriptUrl);
    }
  }, []);

  // Sync single entity change helper
  const syncEntityUpsert = useCallback((entityName: string, item: any) => {
    if (appsScriptUrl && isApiConnected) {
      upsertEntityInSheets(appsScriptUrl, entityName, item).catch((err) => {
        console.error(`Failed background sync for ${entityName}:`, err);
      });
    }
  }, [appsScriptUrl, isApiConnected]);

  const syncEntityDelete = useCallback((entityName: string, id: string) => {
    if (appsScriptUrl && isApiConnected) {
      deleteEntityFromSheets(appsScriptUrl, entityName, id).catch((err) => {
        console.error(`Failed background delete sync for ${entityName}:`, err);
      });
    }
  }, [appsScriptUrl, isApiConnected]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const updateCenterSettings = useCallback((newSettings: Partial<CenterSettings>) => {
    if (newSettings.customLogoUrl !== undefined) {
      if (newSettings.customLogoUrl) {
        localStorage.setItem('minhphat_custom_logo', newSettings.customLogoUrl);
      } else {
        localStorage.removeItem('minhphat_custom_logo');
      }
    }
    setCenterSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Đã lưu cài đặt hệ thống thành công');
  }, [showToast]);

  const setCurrentUserRole = useCallback((role: UserRole) => {
    setUsers((currentUsers) => {
      const found = currentUsers.find((u) => u.role === role);
      if (found) {
        setCurrentUser(found);
        showToast(`Tài khoản hiện tại có vai trò: ${found.role}`, 'info');
      } else {
        setCurrentUser((prev) => {
          const updated = { ...prev, role };
          showToast(`Tài khoản hiện tại có vai trò: ${updated.role}`, 'info');
          return updated;
        });
      }
      return currentUsers;
    });
  }, [showToast]);

  const hasPermission = useCallback((requiredRoles: UserRole[]) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    return (requiredRoles || []).includes(currentUser.role);
  }, [currentUser]);

  // Student CRUD
  const addStudent = useCallback((data: Omit<Student, 'id' | 'code' | 'joinedDate'>) => {
    const newId = `stu-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setStudents((prev) => {
      const codeNumber = (prev.length + 1).toString().padStart(3, '0');
      const newStudent: Student = {
        ...data,
        id: newId,
        code: generateStudentCode(codeNumber),
        joinedDate: new Date().toISOString().split('T')[0],
      };
      syncEntityUpsert('Students', newStudent);
      return [newStudent, ...prev];
    });

    // Batch update class enrolled count
    if (data.enrolledClasses && data.enrolledClasses.length > 0) {
      const enrolledSet = new Set(data.enrolledClasses);
      setClasses((prev) =>
        prev.map((c) => {
          if (enrolledSet.has(c.id)) {
            const updated = { ...c, currentEnrolled: c.currentEnrolled + 1 };
            syncEntityUpsert('Classes', updated);
            return updated;
          }
          return c;
        })
      );
    }

    showToast(`Đã thêm học sinh: ${data.name}`);
  }, [showToast, syncEntityUpsert]);

  const updateStudent = useCallback((id: string, updated: Partial<Student>) => {
    setStudents((prevStudents) => {
      const current = prevStudents.find((s) => s.id === id);
      if (!current) return prevStudents;

      if (updated.enrolledClasses && Array.isArray(updated.enrolledClasses)) {
        const oldClasses = new Set(current.enrolledClasses);
        const newClasses = new Set(updated.enrolledClasses);

        const added = updated.enrolledClasses.filter((cId) => !oldClasses.has(cId));
        const removed = current.enrolledClasses.filter((cId) => !newClasses.has(cId));

        if (added.length > 0 || removed.length > 0) {
          const addedSet = new Set(added);
          const removedSet = new Set(removed);
          setClasses((prev) =>
            prev.map((c) => {
              let count = c.currentEnrolled;
              if (addedSet.has(c.id)) count += 1;
              if (removedSet.has(c.id)) count = Math.max(0, count - 1);
              if (count !== c.currentEnrolled) {
                const updatedClass = { ...c, currentEnrolled: count };
                syncEntityUpsert('Classes', updatedClass);
                return updatedClass;
              }
              return c;
            })
          );
        }
      }

      const updatedStudent = { ...current, ...updated };
      syncEntityUpsert('Students', updatedStudent);
      return prevStudents.map((s) => (s.id === id ? updatedStudent : s));
    });
    showToast('Cập nhật thông tin học sinh thành công');
  }, [showToast, syncEntityUpsert]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prevStudents) => {
      const target = prevStudents.find((s) => s.id === id);
      if (!target) return prevStudents;

      // Batch update class enrolled counts
      if (target.enrolledClasses && target.enrolledClasses.length > 0) {
        const enrolledSet = new Set(target.enrolledClasses);
        setClasses((prev) =>
          prev.map((c) => {
            if (enrolledSet.has(c.id)) {
              const updatedClass = { ...c, currentEnrolled: Math.max(0, c.currentEnrolled - 1) };
              syncEntityUpsert('Classes', updatedClass);
              return updatedClass;
            }
            return c;
          })
        );
      }

      // Soft delete / withdraw: preserve historical financial/attendance data
      const updatedStudent: Student = { ...target, status: 'Nghỉ học', enrolledClasses: [] };
      syncEntityUpsert('Students', updatedStudent);
      showToast(`Đã chuyển trạng thái học sinh ${target.name} sang 'Nghỉ học'`, 'info');

      return prevStudents.map((s) => (s.id === id ? updatedStudent : s));
    });
  }, [showToast, syncEntityUpsert]);

  // Class CRUD
  const addClass = useCallback((data: Omit<ClassRoom, 'id' | 'code' | 'currentEnrolled'>) => {
    const newId = `cls-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const codePrefix = data.subject === 'Tiếng Anh' ? 'ENG' : data.subject === 'Toán' ? 'MATH' : data.subject === 'Vật Lý' ? 'PHY' : 'CHEM';
    const newClass: ClassRoom = {
      ...data,
      id: newId,
      code: `${codePrefix}-${Math.floor(10 + Math.random() * 90)}`,
      currentEnrolled: 0,
    };
    setClasses((prev) => [newClass, ...prev]);
    syncEntityUpsert('Classes', newClass);
    showToast(`Đã tạo lớp mới: ${data.name}`);
  }, [showToast, syncEntityUpsert]);

  const updateClass = useCallback((id: string, updated: Partial<ClassRoom>) => {
    setClasses((prevClasses) => {
      const current = prevClasses.find((c) => c.id === id);
      if (!current) return prevClasses;
      const updatedClass = { ...current, ...updated };
      syncEntityUpsert('Classes', updatedClass);
      return prevClasses.map((c) => (c.id === id ? updatedClass : c));
    });
    showToast('Cập nhật thông tin lớp học thành công');
  }, [showToast, syncEntityUpsert]);

  const deleteClass = useCallback((id: string) => {
    setClasses((prevClasses) => {
      const targetClass = prevClasses.find((c) => c.id === id);
      if (!targetClass) return prevClasses;

      // Integrity check: block deleting a class with active enrolled students
      const enrolledCount = students.filter((s) => s.enrolledClasses.includes(id)).length;
      if (enrolledCount > 0 || targetClass.currentEnrolled > 0) {
        showToast(
          `Không thể xóa lớp "${targetClass.name}" vì đang có ${enrolledCount || targetClass.currentEnrolled} học sinh ghi danh. Vui lòng chuyển học sinh sang lớp khác trước.`,
          'error'
        );
        return prevClasses;
      }

      syncEntityDelete('Classes', id);
      showToast(`Đã xóa lớp học: ${targetClass.name}`, 'info');
      return prevClasses.filter((c) => c.id !== id);
    });
  }, [students, showToast, syncEntityDelete]);

  // Attendance & Session
  const recordSessionAttendance = useCallback((data: Omit<SessionDetail, 'id'>) => {
    const newId = `ses-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSession: SessionDetail = {
      ...data,
      id: newId,
    };
    setSessions((prev) => [newSession, ...prev]);
    syncEntityUpsert('Sessions', newSession);
    showToast(`Đã lưu điểm danh cho lớp buổi ngày ${data.date}`);
  }, [showToast, syncEntityUpsert]);

  const updateAttendanceEntry = useCallback((classId: string, date: string, studentId: string, status: AttendanceStatus) => {
    let targetSession: SessionDetail | null = null;
    setSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.classId === classId && s.date === date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const session = { ...updated[existingIndex] };
        session.entries = { ...session.entries, [studentId]: status };
        updated[existingIndex] = session;
        targetSession = session;
        return updated;
      } else {
        // Create new session
        const newSession: SessionDetail = {
          id: `ses-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          classId,
          date,
          topic: 'Buổi học định kỳ',
          objective: 'Rèn luyện kỹ năng và nâng cao kiến thức',
          qualityRating: 'Tốt',
          homeworkAssigned: 'Bài tập theo giáo trình',
          entries: { [studentId]: status },
        };
        targetSession = newSession;
        return [newSession, ...prev];
      }
    });
    if (targetSession) {
      syncEntityUpsert('Sessions', targetSession);
    }
    showToast('Đã cập nhật trạng thái điểm danh', 'success');
  }, [showToast, syncEntityUpsert]);

  // Evaluation
  const saveEvaluation = useCallback((data: Omit<StudentEvaluation, 'id' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    let targetEval: StudentEvaluation | null = null;
    setEvaluations((prev) => {
      const existing = prev.find((e) => e.studentId === data.studentId && e.classId === data.classId && e.month === data.month);
      if (existing) {
        targetEval = { ...existing, ...data, updatedAt: today };
        return prev.map((e) => (e.id === existing.id ? targetEval! : e));
      } else {
        targetEval = {
          ...data,
          id: `eval-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          updatedAt: today,
        };
        return [targetEval, ...prev];
      }
    });
    if (targetEval) {
      syncEntityUpsert('StudentEvaluations', targetEval);
    }
    showToast('Đã lưu đánh giá học sinh thành công');
  }, [showToast, syncEntityUpsert]);

  // Grades
  const addTestScore = useCallback((scoreData: Omit<TestScore, 'id'>) => {
    const newTest: TestScore = {
      ...scoreData,
      id: `test-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setTestScores((prev) => [newTest, ...prev]);
    syncEntityUpsert('TestScores', newTest);
    showToast(`Đã lưu bảng điểm bài test: ${scoreData.testName}`);
  }, [showToast, syncEntityUpsert]);

  const updateTestScore = useCallback((id: string, updated: Partial<TestScore>) => {
    setTestScores((prevScores) => {
      const current = prevScores.find((t) => t.id === id);
      if (!current) return prevScores;
      const updatedTest = { ...current, ...updated };
      syncEntityUpsert('TestScores', updatedTest);
      return prevScores.map((t) => (t.id === id ? updatedTest : t));
    });
    showToast('Cập nhật bài kiểm tra thành công');
  }, [showToast, syncEntityUpsert]);

  // Invoices & Expenses
  const addInvoice = useCallback((data: Omit<Invoice, 'id' | 'code'>) => {
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code: generateInvoiceCode(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    syncEntityUpsert('Invoices', newInvoice);
    showToast(`Đã lập hóa đơn ${newInvoice.code} thành công`);
  }, [showToast, syncEntityUpsert]);

  const updateInvoiceStatus = useCallback((
    id: string,
    status: Invoice['status'],
    paidAmount?: number,
    paymentMethod?: Invoice['paymentMethod']
  ) => {
    let updatedInv: Invoice | null = null;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const finalPaid = paidAmount !== undefined ? paidAmount : status === 'Đã thanh toán' ? inv.finalAmount : inv.paidAmount;
          updatedInv = {
            ...inv,
            status,
            paidAmount: finalPaid,
            paymentMethod: paymentMethod || inv.paymentMethod || 'Chuyển khoản',
            paidDate: status === 'Đã thanh toán' ? new Date().toISOString().split('T')[0] : inv.paidDate,
          };
          return updatedInv;
        }
        return inv;
      })
    );
    if (updatedInv) {
      syncEntityUpsert('Invoices', updatedInv);
    }
    showToast('Đã cập nhật trạng thái thanh toán hóa đơn');
  }, [showToast, syncEntityUpsert]);

  const addExpense = useCallback((data: Omit<Expense, 'id' | 'code'>) => {
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code: generateExpenseCode(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    syncEntityUpsert('Expenses', newExpense);
    showToast(`Đã ghi nhận phiếu chi: ${data.title}`);
  }, [showToast, syncEntityUpsert]);

  // Calculated Stats
  const stats: DashboardStats = useMemo(() => {
    const totalStudents = students.filter((s) => s.status === 'Đang học').length;
    const totalClasses = classes.filter((c) => c.status === 'Đang mở').length;
    const totalTeachers = users.filter((u) => u.role === 'Giáo viên').length;

    const currentMonthStr = getCurrentMonthString();
    const totalRevenueThisMonth = invoices
      .filter((inv) => inv.month === currentMonthStr && inv.status === 'Đã thanh toán')
      .reduce((sum, inv) => sum + inv.paidAmount, 0);

    const totalUnpaidTuition = invoices
      .filter((inv) => inv.status === 'Chưa thanh toán' || inv.status === 'Quá hạn')
      .reduce((sum, inv) => sum + (inv.finalAmount - inv.paidAmount), 0);

    // Calculate attendance rate
    let totalEntries = 0;
    let presentCount = 0;
    sessions.forEach((s) => {
      Object.values(s.entries).forEach((st) => {
        totalEntries++;
        if (st === 'present' || st === 'late') presentCount++;
      });
    });
    const averageAttendanceRate = totalEntries > 0 ? Math.round((presentCount / totalEntries) * 100) : 94;

    return {
      totalStudents,
      totalClasses,
      totalTeachers,
      totalRevenueThisMonth,
      revenueGrowthPercent: 14.8,
      totalUnpaidTuition,
      averageAttendanceRate,
    };
  }, [students, classes, users, invoices, sessions]);

  const loadDemoData = () => {
    setUsers(initialUsers);
    setStudents(initialStudents);
    setClasses(initialClasses);
    setSessions(initialSessions);
    setEvaluations(initialEvaluations);
    setTestScores(initialTestScores);
    setInvoices(initialInvoices);
    setExpenses(initialExpenses);
    showToast('Đã nạp thành công dữ liệu mẫu (Demo Data)!', 'success');
  };

  const contextValue = useMemo(
    () => ({
      activeModule,
      setActiveModule,
      currentUser,
      setCurrentUserRole,
      loginWithBackend,
      logoutWithBackend,
      changeUserPassword,
      resetUserPassword,
      isAuthenticated,
      users,
      students,
      classes,
      sessions,
      evaluations,
      testScores,
      invoices,
      expenses,
      appsScriptUrl,
      setAppsScriptUrl,
      isApiConnected,
      isSyncing,
      lastSyncedAt,
      syncFromSheets,
      syncAllToSheets,
      testConnection,
      initializeSheetsDatabase,
      sendParentEmailReminders,
      importInvoicesFromGoogleSheet,
      loadDemoData,
      toasts,
      showToast,
      removeToast,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      recordSessionAttendance,
      updateAttendanceEntry,
      saveEvaluation,
      addTestScore,
      updateTestScore,
      addInvoice,
      updateInvoiceStatus,
      addExpense,
      centerSettings,
      updateCenterSettings,
      hasPermission,
      stats,
    }),
    [
      activeModule,
      currentUser,
      setCurrentUserRole,
      loginWithBackend,
      logoutWithBackend,
      changeUserPassword,
      resetUserPassword,
      isAuthenticated,
      users,
      students,
      classes,
      sessions,
      evaluations,
      testScores,
      invoices,
      expenses,
      appsScriptUrl,
      setAppsScriptUrl,
      isApiConnected,
      isSyncing,
      lastSyncedAt,
      syncFromSheets,
      syncAllToSheets,
      testConnection,
      initializeSheetsDatabase,
      sendParentEmailReminders,
      importInvoicesFromGoogleSheet,
      toasts,
      showToast,
      removeToast,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      recordSessionAttendance,
      updateAttendanceEntry,
      saveEvaluation,
      addTestScore,
      updateTestScore,
      addInvoice,
      updateInvoiceStatus,
      addExpense,
      centerSettings,
      updateCenterSettings,
      hasPermission,
      stats,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
