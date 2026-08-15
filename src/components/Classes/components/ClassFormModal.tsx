import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { ClassRoom, User } from '../../../types';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingClass: ClassRoom | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  teachers: User[];
  assistants: User[];
}

export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingClass,
  formData,
  setFormData,
  errors,
  teachers,
  assistants,
}) => {
  if (!isOpen) return null;

  const daysOptions = [
    { label: 'Thứ 2', val: 1 },
    { label: 'Thứ 3', val: 2 },
    { label: 'Thứ 4', val: 3 },
    { label: 'Thứ 5', val: 4 },
    { label: 'Thứ 6', val: 5 },
    { label: 'Thứ 7', val: 6 },
    { label: 'Chủ Nhật', val: 7 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            {editingClass ? 'Chỉnh Sửa Thông Tin Lớp Học' : 'Tạo Lớp Học Mới'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Tên Lớp Học *</label>
              <input
                type="text"
                placeholder="Ví dụ: Anh Văn Khối 10 Nâng Cao"
                value={formData.name}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Môn Học *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, subject: e.target.value as any }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Toán">Toán</option>
                <option value="Vật Lý">Vật Lý</option>
                <option value="Hóa Học">Hóa Học</option>
                <option value="Ngữ Văn">Ngữ Văn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Khối Lớp *</label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, gradeLevel: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12</option>
                <option value="Lớp 9">Lớp 9</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Phòng Học *</label>
              <input
                type="text"
                placeholder="Phòng 201"
                value={formData.roomName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, roomName: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.roomName ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.roomName && <p className="text-rose-400 text-[11px] mt-1">{errors.roomName}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Sĩ Số Tối Đa *</label>
              <input
                type="number"
                min={1}
                value={formData.maxCapacity}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                className={`w-full bg-slate-800 border ${
                  errors.maxCapacity ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.maxCapacity && <p className="text-rose-400 text-[11px] mt-1">{errors.maxCapacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Giáo Viên Phụ Trách *</label>
              <select
                value={formData.teacherId}
                onChange={(e) => {
                  const tId = e.target.value;
                  const teacher = teachers.find((t) => t.id === tId);
                  setFormData((prev: any) => ({
                    ...prev,
                    teacherId: tId,
                    teacherName: teacher?.name || prev.teacherName,
                  }));
                }}
                className={`w-full bg-slate-800 border ${
                  errors.teacherId ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.phone})
                  </option>
                ))}
              </select>
              {errors.teacherId && <p className="text-rose-400 text-[11px] mt-1">{errors.teacherId}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Trợ Giảng (Nếu có)</label>
              <select
                value={formData.assistantId}
                onChange={(e) => {
                  const aId = e.target.value;
                  const assistant = assistants.find((a) => a.id === aId);
                  setFormData((prev: any) => ({
                    ...prev,
                    assistantId: aId,
                    assistantName: assistant ? assistant.name : '',
                  }));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">Không có trợ giảng</option>
                {assistants.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Mô Tả Lịch Học *</label>
              <input
                type="text"
                placeholder="Thứ 2, 4 (18:00 - 19:30)"
                value={formData.scheduleDescription}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, scheduleDescription: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.scheduleDescription ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.scheduleDescription && <p className="text-rose-400 text-[11px] mt-1">{errors.scheduleDescription}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Ca Học / Giờ Học *</label>
              <input
                type="text"
                placeholder="18:00 - 19:30"
                value={formData.timeSlot}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, timeSlot: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.timeSlot ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.timeSlot && <p className="text-rose-400 text-[11px] mt-1">{errors.timeSlot}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Các Ngày Học Trong Tuần *</label>
            <div className="flex flex-wrap gap-2">
              {daysOptions.map((d) => {
                const isSelected = (formData.daysOfWeek || []).includes(d.val);
                return (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => {
                      const current = formData.daysOfWeek || [];
                      const next = isSelected ? current.filter((x: number) => x !== d.val) : [...current, d.val];
                      setFormData((prev: any) => ({ ...prev, daysOfWeek: next }));
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            {errors.daysOfWeek && <p className="text-rose-400 text-[11px] mt-1">{errors.daysOfWeek}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Học Phí Theo Buổi (VND) *</label>
              <input
                type="number"
                min={0}
                value={formData.tuitionFeePerSession}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, tuitionFeePerSession: Number(e.target.value) }))}
                className={`w-full bg-slate-800 border ${
                  errors.tuitionFeePerSession ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.tuitionFeePerSession && <p className="text-rose-400 text-[11px] mt-1">{errors.tuitionFeePerSession}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Học Phí Trọn Tháng (VND) *</label>
              <input
                type="number"
                min={0}
                value={formData.tuitionFeePerMonth}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, tuitionFeePerMonth: Number(e.target.value) }))}
                className={`w-full bg-slate-800 border ${
                  errors.tuitionFeePerMonth ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-sky-500`}
              />
              {errors.tuitionFeePerMonth && <p className="text-rose-400 text-[11px] mt-1">{errors.tuitionFeePerMonth}</p>}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20"
            >
              {editingClass ? 'Cập Nhật Lớp Học' : 'Tạo Lớp Học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
