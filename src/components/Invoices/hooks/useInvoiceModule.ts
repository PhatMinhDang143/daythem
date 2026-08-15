import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Invoice, Expense } from '../../../types';
import { invoiceSchema, expenseSchema } from '../../../schemas/validationSchemas';
import { getCurrentMonthString, getCurrentYear } from '../../../config/constants';

export function useInvoiceModule(isAddModalOpenFromHeader?: boolean, onCloseHeaderModal?: () => void) {
  const {
    invoices,
    expenses,
    students,
    classes,
    addInvoice,
    addExpense,
    updateInvoiceStatus,
    centerSettings,
    hasPermission,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Modals
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(isAddModalOpenFromHeader || false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isClassBatchModalOpen, setIsClassBatchModalOpen] = useState(false);
  const [isExcelImportModalOpen, setIsExcelImportModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // Form Validation Errors
  const [invoiceErrors, setInvoiceErrors] = useState<Record<string, string>>({});
  const [expenseErrors, setExpenseErrors] = useState<Record<string, string>>({});

  // Single Invoice Form
  const [invoiceFormData, setInvoiceFormData] = useState({
    studentId: students[0]?.id || '',
    classId: classes[0]?.id || '',
    month: getCurrentMonthString(),
    originalAmount: classes[0]?.tuitionFeePerMonth || centerSettings.defaultFeePerMonth || 1200000,
    discountAmount: 0,
    discountReason: '',
    dueDate: `${getCurrentYear()}-${getCurrentMonthString().split('-')[1]}-10`,
    note: '',
  });

  // Class Batch Invoice Form State
  const [batchClassId, setBatchClassId] = useState(classes[0]?.id || '');
  const [batchMonth, setBatchMonth] = useState(getCurrentMonthString());
  const [batchDueDate, setBatchDueDate] = useState(`${getCurrentYear()}-${getCurrentMonthString().split('-')[1]}-10`);
  const [batchDefaultDiscount, setBatchDefaultDiscount] = useState(0);
  const [batchDefaultDiscountReason, setBatchDefaultDiscountReason] = useState('');
  const [batchStudentExclusions, setBatchStudentExclusions] = useState<Record<string, boolean>>({});
  const [batchStudentDiscounts, setBatchStudentDiscounts] = useState<Record<string, { amount: number; reason: string }>>({});

  // Excel CSV raw import input
  const [csvRawText, setCsvRawText] = useState('');

  // Expense Form State
  const [expenseFormData, setExpenseFormData] = useState<{
    title: string;
    category: 'Lương Giáo Viên' | 'Cơ Sở Vật Chất' | 'Marketing' | 'Điện Nước Internet' | 'Chi Khác';
    amount: number;
    date: string;
    paidTo: string;
    paymentMethod: 'Chuyển khoản' | 'Tiền mặt' | 'Ví điện tử';
    notes: string;
  }>({
    title: 'Thanh toán tiền điện internet',
    category: 'Điện Nước Internet',
    amount: 1500000,
    date: new Date().toISOString().split('T')[0],
    paidTo: 'Công ty Điện Lực / VNPT',
    paymentMethod: 'Chuyển khoản',
    notes: 'Hóa đơn định kỳ trung tâm',
  });

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.studentName.toLowerCase().includes(q) ||
        inv.code.toLowerCase().includes(q) ||
        inv.className.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'Tất cả' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        exp.title.toLowerCase().includes(q) ||
        exp.code.toLowerCase().includes(q) ||
        exp.paidTo.toLowerCase().includes(q)
      );
    });
  }, [expenses, searchQuery]);

  // Selected batch class & enrolled students
  const selectedBatchClass = classes.find((c) => c.id === batchClassId);
  const enrolledStudentsInBatchClass = useMemo(() => {
    return students.filter((s) => (s.enrolledClasses || []).includes(batchClassId));
  }, [students, batchClassId]);

  // Handle Single Invoice Create
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceErrors({});

    const parseResult = invoiceSchema.safeParse(invoiceFormData);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setInvoiceErrors(fieldErrors);
      showToast('Vui lòng kiểm tra lại các trường thông tin hóa đơn', 'error');
      return;
    }

    const studentObj = students.find((s) => s.id === invoiceFormData.studentId);
    const classObj = classes.find((c) => c.id === invoiceFormData.classId);

    if (!studentObj) {
      showToast('Vui lòng chọn học sinh hợp lệ', 'error');
      return;
    }

    const finalAmount = Math.max(0, invoiceFormData.originalAmount - invoiceFormData.discountAmount);

    addInvoice({
      studentId: invoiceFormData.studentId,
      studentName: studentObj.name,
      classId: invoiceFormData.classId,
      className: classObj?.name || 'Chưa xếp lớp',
      month: invoiceFormData.month,
      originalAmount: invoiceFormData.originalAmount,
      discountAmount: invoiceFormData.discountAmount,
      discountReason: invoiceFormData.discountReason,
      finalAmount,
      paidAmount: 0,
      status: 'Chưa thanh toán',
      dueDate: invoiceFormData.dueDate,
      note: invoiceFormData.note,
    });

    showToast(`Đã tạo thành công hóa đơn cho học sinh ${studentObj.name}`);
    setIsAddInvoiceModalOpen(false);
    onCloseHeaderModal?.();
  };

  // Handle Class Batch Invoices Create
  const handleCreateClassBatchInvoices = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchClass) return;

    const baseFee = selectedBatchClass.tuitionFeePerMonth || centerSettings.defaultFeePerMonth;
    let count = 0;

    enrolledStudentsInBatchClass.forEach((student) => {
      if (batchStudentExclusions[student.id]) return;

      const customDisc = batchStudentDiscounts[student.id];
      const discountAmount = customDisc ? customDisc.amount : batchDefaultDiscount;
      const discountReason = customDisc ? customDisc.reason : batchDefaultDiscountReason;
      const finalAmount = Math.max(0, baseFee - discountAmount);

      addInvoice({
        studentId: student.id,
        studentName: student.name,
        classId: selectedBatchClass.id,
        className: selectedBatchClass.name,
        month: batchMonth,
        originalAmount: baseFee,
        discountAmount,
        discountReason,
        finalAmount,
        paidAmount: 0,
        status: 'Chưa thanh toán',
        dueDate: batchDueDate,
        note: `Hóa đơn tự động theo lớp ${selectedBatchClass.name}`,
      });

      count++;
    });

    showToast(`Đã sinh thành công ${count} hóa đơn học phí tháng ${batchMonth} cho lớp ${selectedBatchClass.name}`);
    setIsClassBatchModalOpen(false);
  };

  // Download CSV template
  const handleDownloadExcelTemplate = () => {
    if (!selectedBatchClass) return;
    const baseFee = selectedBatchClass.tuitionFeePerMonth || centerSettings.defaultFeePerMonth;

    const headers = 'Mã Học Sinh,Họ Và Tên,Mã Lớp,Tháng,Học Phí Gốc,Mức Giảm Giá (VND),Lý Do Giảm Giá,Hạn Nộp (YYYY-MM-DD)';
    const rows = enrolledStudentsInBatchClass.map(
      (s) => `"${s.code}","${s.name}","${selectedBatchClass.code}","${batchMonth}","${baseFee}","0","","${batchDueDate}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mau_Hoa_Don_${selectedBatchClass.code}_Thang_${batchMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã tải xuống file mẫu Excel cho lớp ${selectedBatchClass.name}`);
  };

  // Process Excel Import
  const handleProcessExcelImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvRawText.trim()) {
      showToast('Vui lòng dán hoặc nhập dữ liệu Excel CSV', 'error');
      return;
    }

    const lines = csvRawText.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line, index) => {
      if (index === 0 && (line.toLowerCase().includes('mã học sinh') || line.toLowerCase().includes('mã hs'))) return;

      const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
      if (cols.length >= 5) {
        const studentCode = cols[0];
        const studentName = cols[1];
        const classCode = cols[2];
        const month = cols[3] || getCurrentMonthString();
        const originalAmount = Math.max(0, Number(cols[4]) || 1200000);
        const discountAmount = Math.max(0, Number(cols[5]) || 0);
        const discountReason = cols[6] || '';
        const dueDate = cols[7] || `${getCurrentYear()}-${getCurrentMonthString().split('-')[1]}-10`;

        const matchedStudent = students.find((s) => s.code.toLowerCase() === studentCode.toLowerCase()) || {
          id: `s_imp_${Date.now()}_${index}`,
          name: studentName || 'Học sinh nhập Excel',
        };

        const matchedClass = classes.find((c) => c.code.toLowerCase() === classCode.toLowerCase()) || {
          id: classes[0]?.id || 'c1',
          name: classCode || 'Lớp học',
        };

        const finalAmount = Math.max(0, originalAmount - discountAmount);

        addInvoice({
          studentId: matchedStudent.id,
          studentName: matchedStudent.name,
          classId: matchedClass.id,
          className: matchedClass.name,
          month,
          originalAmount,
          discountAmount,
          discountReason,
          finalAmount,
          paidAmount: 0,
          status: 'Chưa thanh toán',
          dueDate,
          note: 'Nhập hàng loạt từ File Excel/CSV',
        });

        importedCount++;
      }
    });

    if (importedCount > 0) {
      showToast(`Đã nhập thành công ${importedCount} hóa đơn học phí từ Excel!`);
      setIsExcelImportModalOpen(false);
      setCsvRawText('');
    } else {
      showToast('Không đọc được dữ liệu phù hợp trong file CSV', 'error');
    }
  };

  // Create Expense Submit
  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseErrors({});

    const parseResult = expenseSchema.safeParse(expenseFormData);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setExpenseErrors(fieldErrors);
      showToast('Vui lòng kiểm tra lại thông tin phiếu chi', 'error');
      return;
    }

    addExpense(expenseFormData);
    showToast(`Đã ghi nhận phiếu chi: ${expenseFormData.title}`);
    setIsAddExpenseModalOpen(false);
  };

  // Send Zalo Reminder
  const handleSendReminder = (inv: Invoice) => {
    const msg = centerSettings.zaloTemplateReminder
      .replace('{studentName}', inv.studentName)
      .replace('{month}', inv.month)
      .replace('{amount}', inv.finalAmount.toLocaleString() + ' VND')
      .replace('{dueDate}', inv.dueDate);

    const studentObj = students.find((s) => s.id === inv.studentId);
    const phone = studentObj?.parentPhone || '0900000000';
    const zaloUrl = `https://zalo.me/${phone}`;

    showToast(`Đã mở Zalo chuẩn bị gửi thông báo đóng học phí đến ${phone}`);
    window.open(zaloUrl, '_blank');
  };

  return {
    invoices,
    expenses,
    students,
    classes,
    centerSettings,
    hasPermission,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredInvoices,
    filteredExpenses,
    // Modals state
    isAddInvoiceModalOpen,
    setIsAddInvoiceModalOpen,
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
    isClassBatchModalOpen,
    setIsClassBatchModalOpen,
    isExcelImportModalOpen,
    setIsExcelImportModalOpen,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    // Forms
    invoiceFormData,
    setInvoiceFormData,
    invoiceErrors,
    expenseFormData,
    setExpenseFormData,
    expenseErrors,
    // Batch
    batchClassId,
    setBatchClassId,
    batchMonth,
    setBatchMonth,
    batchDueDate,
    setBatchDueDate,
    batchDefaultDiscount,
    setBatchDefaultDiscount,
    batchDefaultDiscountReason,
    setBatchDefaultDiscountReason,
    batchStudentExclusions,
    setBatchStudentExclusions,
    batchStudentDiscounts,
    setBatchStudentDiscounts,
    selectedBatchClass,
    enrolledStudentsInBatchClass,
    // CSV
    csvRawText,
    setCsvRawText,
    // Actions
    handleCreateInvoiceSubmit,
    handleCreateClassBatchInvoices,
    handleDownloadExcelTemplate,
    handleProcessExcelImport,
    handleCreateExpenseSubmit,
    handleSendReminder,
    updateInvoiceStatus,
  };
}
