import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { Student, ClassRoom } from '../../../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingStudent: Student | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  classes: ClassRoom[];
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStudent,
  formData,
  setFormData,
  errors,
  classes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <UserPlus className="w-4 h-4" />
            {editingStudent ? 'Chỉnh Sửa Hồ Sơ Học Sinh' : 'Thêm Mới Học Sinh Mới'}
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
              <label className="block text-slate-400 font-medium mb-1">Họ Và Tên Học Sinh *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Giới Tính *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, gender: e.target.value as any }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Ngày Sinh *</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, dob: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.dob ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.dob && <p className="text-rose-400 text-[11px] mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Khối Lớp *</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, grade: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Khối 10">Khối 10</option>
                <option value="Khối 11">Khối 11</option>
                <option value="Khối 12">Khối 12</option>
                <option value="Khối 9">Khối 9</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Trường Đang Học *</label>
              <input
                type="text"
                placeholder="THPT Chuyên..."
                value={formData.school}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, school: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.school ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.school && <p className="text-rose-400 text-[11px] mt-1">{errors.school}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Họ Tên Phụ Huynh *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn B"
                value={formData.parentName}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, parentName: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.parentName ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.parentName && <p className="text-rose-400 text-[11px] mt-1">{errors.parentName}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Số Điện Thoại Phụ Huynh *</label>
              <input
                type="text"
                placeholder="0912345678"
                value={formData.parentPhone}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, parentPhone: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.parentPhone ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.parentPhone && <p className="text-rose-400 text-[11px] mt-1">{errors.parentPhone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Phụ Huynh</label>
              <input
                type="email"
                placeholder="phuhuynh@gmail.com"
                value={formData.parentEmail}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, parentEmail: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.parentEmail ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.parentEmail && <p className="text-rose-400 text-[11px] mt-1">{errors.parentEmail}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Địa Chỉ Thường Trú *</label>
              <input
                type="text"
                placeholder="Số 10, Cầu Giấy, Hà Nội"
                value={formData.address}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, address: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.address ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              />
              {errors.address && <p className="text-rose-400 text-[11px] mt-1">{errors.address}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Đăng Ký Các Lớp Học *</label>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
              {classes.map((c) => {
                const isChecked = (formData.enrolledClasses || []).includes(c.id);
                return (
                  <label key={c.id} className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentEnrolled = formData.enrolledClasses || [];
                        if (e.target.checked) {
                          setFormData((prev: any) => ({ ...prev, enrolledClasses: [...currentEnrolled, c.id] }));
                        } else {
                          setFormData((prev: any) => ({
                            ...prev,
                            enrolledClasses: currentEnrolled.filter((id: string) => id !== c.id),
                          }));
                        }
                      }}
                      className="rounded border-slate-700 text-sky-500 focus:ring-0"
                    />
                    <span>{c.name} ({c.code})</span>
                  </label>
                );
              })}
            </div>
            {errors.enrolledClasses && <p className="text-rose-400 text-[11px] mt-1">{errors.enrolledClasses}</p>}
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
              {editingStudent ? 'Cập Nhật Hồ Sơ' : 'Thêm Học Sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
