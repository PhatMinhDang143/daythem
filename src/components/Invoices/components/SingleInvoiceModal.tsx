import React from 'react';
import { X, FileText } from 'lucide-react';
import { Student, ClassRoom } from '../../../types';
import { getCurrentMonthString } from '../../../config/constants';

interface SingleInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  students: Student[];
  classes: ClassRoom[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
}

export const SingleInvoiceModal: React.FC<SingleInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  classes,
  formData,
  setFormData,
  errors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="single-invoice-modal-title"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div id="single-invoice-modal-title" className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <FileText className="w-4 h-4" />
            Tạo Hóa Đơn Học Phí Đơn Lẻ
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ tạo hóa đơn lẻ"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Chọn Học Sinh *</label>
            <select
              value={formData.studentId}
              onChange={(e) => {
                const sId = e.target.value;
                const studentObj = students.find((s) => s.id === sId);
                const classObj = classes.find((c) => (studentObj?.enrolledClasses || []).includes(c.id));
                setFormData((prev: any) => ({
                  ...prev,
                  studentId: sId,
                  classId: classObj ? classObj.id : prev.classId,
                }));
              }}
              className={`w-full bg-slate-800 border ${
                errors.studentId ? 'border-rose-500' : 'border-slate-700'
              } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - Mã: {s.code} ({s.grade})
                </option>
              ))}
            </select>
            {errors.studentId && <p className="text-rose-400 text-[11px] mt-1">{errors.studentId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Lớp Học Áp Dụng *</label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const cId = e.target.value;
                  const cObj = classes.find((c) => c.id === cId);
                  setFormData((prev: any) => ({
                    ...prev,
                    classId: cId,
                    originalAmount: cObj?.tuitionFeePerMonth || prev.originalAmount,
                  }));
                }}
                className={`w-full bg-slate-800 border ${
                  errors.classId ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.subject})
                  </option>
                ))}
              </select>
              {errors.classId && <p className="text-rose-400 text-[11px] mt-1">{errors.classId}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tháng Thu (YYYY-MM) *</label>
              <input
                type="text"
                placeholder={getCurrentMonthString()}
                value={formData.month}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, month: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.month ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.month && <p className="text-rose-400 text-[11px] mt-1">{errors.month}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Học Phí Gốc (VND) *</label>
              <input
                type="number"
                min={0}
                value={formData.originalAmount}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, originalAmount: Number(e.target.value) }))
                }
                className={`w-full bg-slate-800 border ${
                  errors.originalAmount ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.originalAmount && <p className="text-rose-400 text-[11px] mt-1">{errors.originalAmount}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Mức Giảm Giá (VND)</label>
              <input
                type="number"
                min={0}
                value={formData.discountAmount}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, discountAmount: Number(e.target.value) }))
                }
                className={`w-full bg-slate-800 border ${
                  errors.discountAmount ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-amber-400 font-mono focus:outline-none focus:border-sky-500`}
              />
              {errors.discountAmount && <p className="text-rose-400 text-[11px] mt-1">{errors.discountAmount}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Lý Do Giảm Giá (Nếu có)</label>
            <input
              type="text"
              placeholder="Ví dụ: Học bổng khuyến học 20%, Anh em ruột cùng học..."
              value={formData.discountReason}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, discountReason: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Hạn Nộp Học Phí *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, dueDate: e.target.value }))}
              className={`w-full bg-slate-800 border ${
                errors.dueDate ? 'border-rose-500' : 'border-slate-700'
              } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500`}
            />
            {errors.dueDate && <p className="text-rose-400 text-[11px] mt-1">{errors.dueDate}</p>}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Số Tiền Thực Thu:</span>
            <span className="text-base font-black text-emerald-400">
              {Math.max(0, formData.originalAmount - formData.discountAmount).toLocaleString()} đ
            </span>
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
              Tạo Hóa Đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
