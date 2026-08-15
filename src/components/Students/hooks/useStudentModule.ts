import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Student } from '../../../types';
import { studentSchema } from '../../../schemas/validationSchemas';

export function useStudentModule(isAddModalOpenFromHeader?: boolean, onCloseHeaderModal?: () => void) {
  const { students, classes, addStudent, updateStudent, deleteStudent, hasPermission, showToast, centerSettings } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Modals & Drawers
  const [isFormModalOpen, setIsFormModalOpen] = useState(isAddModalOpenFromHeader || false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [zaloModalStudent, setZaloModalStudent] = useState<Student | null>(null);

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initial Form Data
  const initialFormData = {
    name: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    dob: '2010-01-01',
    school: 'THPT Chuyên Hà Nội',
    grade: 'Khối 10',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Hà Nội',
    enrolledClasses: [] as string[],
    status: 'Đang học' as 'Đang học' | 'Nghỉ học' | 'Bảo lưu',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.code && student.code.toLowerCase().includes(query)) ||
        (student.parentPhone && student.parentPhone.includes(query)) ||
        (student.school && student.school.toLowerCase().includes(query));

      const matchesGrade = gradeFilter === 'Tất cả' || student.grade === gradeFilter;
      const matchesStatus = statusFilter === 'Tất cả' || student.status === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, searchQuery, gradeFilter, statusFilter]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      gender: student.gender,
      dob: student.dob,
      school: student.school,
      grade: student.grade,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      address: student.address,
      enrolledClasses: student.enrolledClasses || [],
      status: student.status,
      notes: student.notes || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Submit Form Handler with Zod Validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parseResult = studentSchema.safeParse(formData);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      showToast('Vui lòng kiểm tra lại thông tin học sinh', 'error');
      return;
    }

    // Duplicate Phone Check for new student
    if (!editingStudent) {
      const duplicatePhone = students.find((s) => s.parentPhone === formData.parentPhone.trim());
      if (duplicatePhone) {
        showToast(`Số điện thoại ${formData.parentPhone} đã được dùng cho học sinh ${duplicatePhone.name}`, 'error');
        setFormErrors({ parentPhone: 'Số điện thoại này đã tồn tại trong hệ thống' });
        return;
      }
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      showToast(`Đã cập nhật thông tin học sinh: ${formData.name}`);
    } else {
      addStudent(formData);
      showToast(`Đã thêm mới học sinh: ${formData.name}`);
    }

    setIsFormModalOpen(false);
    onCloseHeaderModal?.();
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      showToast(`Đã xóa học sinh ${studentToDelete.name}`);
      setStudentToDelete(null);
      if (selectedStudentForDetail?.id === studentToDelete.id) {
        setSelectedStudentForDetail(null);
      }
    }
  };

  // Send Zalo Notification
  const handleSendZalo = (student: Student) => {
    setZaloModalStudent(student);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Mã HS,Họ Và Tên,Giới Tính,Ngày Sinh,Khối,Trường,Phụ Huynh,SĐT PH,Email,Địa Chỉ,Trạng Thái\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.code}","${s.name}","${s.gender}","${s.dob}","${s.grade}","${s.school}","${s.parentName}","${s.parentPhone}","${s.parentEmail || ''}","${s.address}","${s.status}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_Sach_Hoc_Sinh_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Đã xuất danh sách học sinh ra file CSV thành công!');
  };

  return {
    students,
    classes,
    hasPermission,
    centerSettings,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    gradeFilter,
    setGradeFilter,
    statusFilter,
    setStatusFilter,
    filteredStudents,
    // Modals
    isFormModalOpen,
    setIsFormModalOpen,
    editingStudent,
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    studentToDelete,
    setStudentToDelete,
    zaloModalStudent,
    setZaloModalStudent,
    // Form & Validation
    formData,
    setFormData,
    formErrors,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleFormSubmit,
    handleConfirmDelete,
    handleSendZalo,
    handleExportCSV,
  };
}
