import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ClassRoom } from '../../../types';
import { classSchema } from '../../../schemas/validationSchemas';

export function useClassModule(isAddModalOpenFromHeader?: boolean, onCloseHeaderModal?: () => void) {
  const { classes, students, users, addClass, updateClass, deleteClass, hasPermission, showToast, centerSettings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(isAddModalOpenFromHeader || false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [selectedClassForDetail, setSelectedClassForDetail] = useState<ClassRoom | null>(null);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<ClassRoom | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);

  // Form Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Teachers and assistants
  const teacherList = useMemo(() => users.filter((u) => u.role === 'Giáo viên' || u.role === 'Admin'), [users]);
  const assistantList = useMemo(() => users.filter((u) => u.role === 'Trợ giảng'), [users]);

  // Form Data Initial
  const initialFormData = {
    name: '',
    subject: 'Tiếng Anh' as 'Tiếng Anh' | 'Toán' | 'Vật Lý' | 'Hóa Học' | 'Ngữ Văn',
    gradeLevel: 'Lớp 10',
    teacherId: teacherList[0]?.id || 'usr-1',
    teacherName: teacherList[0]?.name || 'Thầy Nguyễn Văn Anh',
    assistantId: assistantList[0]?.id || '',
    assistantName: assistantList[0]?.name || '',
    roomName: 'Phòng 201',
    scheduleDescription: 'Thứ 2, 4 (18:00 - 19:30)',
    daysOfWeek: [1, 3],
    timeSlot: '18:00 - 19:30',
    tuitionFeePerSession: centerSettings.defaultFeePerSession || 150000,
    tuitionFeePerMonth: centerSettings.defaultFeePerMonth || 1200000,
    maxCapacity: 20,
    status: 'Đang mở' as 'Đang mở' | 'Sắp khai giảng' | 'Đã kết thúc',
    startDate: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cls.name.toLowerCase().includes(q) ||
        cls.code.toLowerCase().includes(q) ||
        cls.teacherName.toLowerCase().includes(q) ||
        cls.roomName.toLowerCase().includes(q);

      const matchesSubject = subjectFilter === 'Tất cả' || cls.subject === subjectFilter;
      const matchesStatus = statusFilter === 'Tất cả' || cls.status === statusFilter;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [classes, searchQuery, subjectFilter, statusFilter]);

  // Open Add Class
  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Class
  const handleOpenEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      subject: cls.subject,
      gradeLevel: cls.gradeLevel,
      teacherId: cls.teacherId,
      teacherName: cls.teacherName,
      assistantId: cls.assistantId || '',
      assistantName: cls.assistantName || '',
      roomName: cls.roomName,
      scheduleDescription: cls.scheduleDescription,
      daysOfWeek: cls.daysOfWeek || [1, 3],
      timeSlot: cls.timeSlot,
      tuitionFeePerSession: cls.tuitionFeePerSession,
      tuitionFeePerMonth: cls.tuitionFeePerMonth,
      maxCapacity: cls.maxCapacity,
      status: cls.status,
      startDate: cls.startDate,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parseResult = classSchema.safeParse(formData);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      showToast('Vui lòng kiểm tra lại các trường thông tin lớp học', 'error');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, formData);
      showToast(`Đã cập nhật lớp học: ${formData.name}`);
    } else {
      addClass(formData);
      showToast(`Đã tạo mới lớp học: ${formData.name}`);
    }

    setIsFormModalOpen(false);
    onCloseHeaderModal?.();
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      showToast(`Đã xóa lớp học ${classToDelete.name}`);
      setClassToDelete(null);
      if (selectedClassForDetail?.id === classToDelete.id) {
        setSelectedClassForDetail(null);
      }
    }
  };

  return {
    classes,
    students,
    users,
    teacherList,
    assistantList,
    hasPermission,
    searchQuery,
    setSearchQuery,
    subjectFilter,
    setSubjectFilter,
    statusFilter,
    setStatusFilter,
    filteredClasses,
    // Modals
    isFormModalOpen,
    setIsFormModalOpen,
    editingClass,
    selectedClassForDetail,
    setSelectedClassForDetail,
    selectedClassForRoster,
    setSelectedClassForRoster,
    classToDelete,
    setClassToDelete,
    // Form & Validation
    formData,
    setFormData,
    formErrors,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleFormSubmit,
    handleConfirmDelete,
  };
}
