import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useClassModule } from './hooks/useClassModule';
import { ClassGrid } from './components/ClassGrid';
import { ClassDetailDrawer } from './components/ClassDetailDrawer';
import { ClassRosterModal } from './components/ClassRosterModal';
import { ClassFormModal } from './components/ClassFormModal';
import { DeleteClassModal } from './components/DeleteClassModal';

interface ClassesModuleProps {
  isAddClassModalOpenFromHeader?: boolean;
  onCloseHeaderModal?: () => void;
}

export const ClassesModule: React.FC<ClassesModuleProps> = ({
  isAddClassModalOpenFromHeader,
  onCloseHeaderModal,
}) => {
  const {
    students,
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
  } = useClassModule(isAddClassModalOpenFromHeader, onCloseHeaderModal);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Control Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên lớp, mã lớp, tên giáo viên, phòng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả môn học</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Toán">Toán</option>
            <option value="Vật Lý">Vật Lý</option>
            <option value="Hóa Học">Hóa Học</option>
            <option value="Ngữ Văn">Ngữ Văn</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang mở">Đang mở</option>
            <option value="Sắp khai giảng">Sắp khai giảng</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        </div>

        {/* Actions */}
        {hasPermission && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo Lớp Học Mới
          </button>
        )}
      </div>

      {/* Grid of Classes */}
      <ClassGrid
        classes={filteredClasses}
        students={students}
        hasPermission={hasPermission}
        onViewDetail={setSelectedClassForDetail}
        onOpenRoster={setSelectedClassForRoster}
        onEdit={handleOpenEditModal}
        onDelete={setClassToDelete}
      />

      {/* Modals & Drawers */}
      <ClassDetailDrawer
        cls={selectedClassForDetail}
        students={students}
        onClose={() => setSelectedClassForDetail(null)}
        onEdit={handleOpenEditModal}
        hasPermission={hasPermission}
      />

      <ClassRosterModal
        cls={selectedClassForRoster}
        students={students}
        onClose={() => setSelectedClassForRoster(null)}
      />

      <ClassFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          onCloseHeaderModal?.();
        }}
        onSubmit={handleFormSubmit}
        editingClass={editingClass}
        formData={formData}
        setFormData={setFormData}
        errors={formErrors}
        teachers={teacherList}
        assistants={assistantList}
      />

      <DeleteClassModal
        cls={classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
