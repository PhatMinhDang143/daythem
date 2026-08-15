import React from 'react';
import { X, TrendingDown } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <TrendingDown className="w-4 h-4" />
            Lập Phiếu Chi Chi Phí Hoạt Động
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Nội Dung Chi Phí *</label>
            <input
              type="text"
              placeholder="Ví dụ: Chi trả tiền điện nước tháng 8..."
              value={formData.title}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
              className={`w-full bg-slate-800 border ${
                errors.title ? 'border-rose-500' : 'border-slate-700'
              } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500`}
            />
            {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Danh Mục Chi *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value as any }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Lương Giáo Viên">Lương Giáo Viên</option>
                <option value="Cơ Sở Vật Chất">Cơ Sở Vật Chất</option>
                <option value="Marketing">Marketing</option>
                <option value="Điện Nước Internet">Điện Nước Internet</option>
                <option value="Chi Khác">Chi Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Số Tiền Chi (VND) *</label>
              <input
                type="number"
                min={0}
                value={formData.amount}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, amount: Number(e.target.value) }))}
                className={`w-full bg-slate-800 border ${
                  errors.amount ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-rose-400 font-mono font-bold focus:outline-none focus:border-rose-500`}
              />
              {errors.amount && <p className="text-rose-400 text-[11px] mt-1">{errors.amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Ngày Thực Hiện Chi *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, date: e.target.value }))}
                className={`w-full bg-slate-800 border ${
                  errors.date ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500`}
              />
              {errors.date && <p className="text-rose-400 text-[11px] mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Hình Thức Chi</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Ví điện tử">Ví điện tử</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Đơn Vị/Người Nhận Tiền *</label>
            <input
              type="text"
              placeholder="Ví dụ: Công ty Điện Lực / Thầy Nguyễn Văn A..."
              value={formData.paidTo}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, paidTo: e.target.value }))}
              className={`w-full bg-slate-800 border ${
                errors.paidTo ? 'border-rose-500' : 'border-slate-700'
              } rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500`}
            />
            {errors.paidTo && <p className="text-rose-400 text-[11px] mt-1">{errors.paidTo}</p>}
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20"
            >
              Lưu Phiếu Chi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
