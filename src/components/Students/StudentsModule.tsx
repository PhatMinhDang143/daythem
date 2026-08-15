import React from 'react';
import { Search, Plus, LayoutGrid, List, Download } from 'lucide-react';
import { useStudentModule } from './hooks/useStudentModule';
import { StudentTable } from './components/StudentTable';
import { StudentGrid } from './components/StudentGrid';
import { StudentDetailDrawer } from './components/StudentDetailDrawer';
import { StudentFormModal } from './components/StudentFormModal';
import { ZaloNotificationModal } from './components/ZaloNotificationModal';
import { DeleteStudentModal } from './components/DeleteStudentModal';

interface StudentsModuleProps {
  isAddStudentModalOpenFromHeader?: boolean;
  onCloseHeaderModal?: () => void;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  isAddStudentModalOpenFromHeader,
  onCloseHeaderModal,
}) => {
  const {
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
  } = useStudentModule(isAddStudentModalOpenFromHeader, onCloseHeaderModal);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Control Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, mã HS, SĐT phụ huynh, trường..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả khối lớp</option>
            <option value="Khối 10">Khối 10</option>
            <option value="Khối 11">Khối 11</option>
            <option value="Khối 12">Khối 12</option>
            <option value="Khối 9">Khối 9</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Bảo lưu">Bảo lưu</option>
            <option value="Nghỉ học">Nghỉ học</option>
          </select>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ bảng"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ thẻ Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất CSV
          </button>

          {hasPermission && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm Học Sinh
            </button>
          )}
        </div>
      </div>

      {/* Main List */}
      {viewMode === 'table' ? (
        <StudentTable
          students={filteredStudents}
          classes={classes}
          hasPermission={hasPermission}
          onViewDetail={setSelectedStudentForDetail}
          onEdit={handleOpenEditModal}
          onDelete={setStudentToDelete}
          onSendZalo={handleSendZalo}
        />
      ) : (
        <StudentGrid
          students={filteredStudents}
          classes={classes}
          hasPermission={hasPermission}
          onViewDetail={setSelectedStudentForDetail}
          onEdit={handleOpenEditModal}
          onDelete={setStudentToDelete}
          onSendZalo={handleSendZalo}
        />
      )}

      {/* Modals & Drawers */}
      <StudentDetailDrawer
        student={selectedStudentForDetail}
        classes={classes}
        onClose={() => setSelectedStudentForDetail(null)}
        onEdit={handleOpenEditModal}
        hasPermission={hasPermission}
      />

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          onCloseHeaderModal?.();
        }}
        onSubmit={handleFormSubmit}
        editingStudent={editingStudent}
        formData={formData}
        setFormData={setFormData}
        errors={formErrors}
        classes={classes}
      />

      <ZaloNotificationModal
        student={zaloModalStudent}
        onClose={() => setZaloModalStudent(null)}
        centerSettings={centerSettings}
      />

      <DeleteStudentModal
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
