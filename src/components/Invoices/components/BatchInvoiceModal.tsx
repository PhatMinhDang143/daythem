import React from 'react';
import { X, Layers, Download } from 'lucide-react';
import { ClassRoom, Student } from '../../../types';
import { getCurrentMonthString } from '../../../config/constants';

interface BatchInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  classes: ClassRoom[];
  selectedBatchClass: ClassRoom | undefined;
  batchClassId: string;
  setBatchClassId: (id: string) => void;
  batchMonth: string;
  setBatchMonth: (month: string) => void;
  batchDueDate: string;
  setBatchDueDate: (date: string) => void;
  batchDefaultDiscount: number;
  setBatchDefaultDiscount: (amt: number) => void;
  batchDefaultDiscountReason: string;
  setBatchDefaultDiscountReason: (reason: string) => void;
  enrolledStudentsInBatchClass: Student[];
  batchStudentExclusions: Record<string, boolean>;
  setBatchStudentExclusions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  batchStudentDiscounts: Record<string, { amount: number; reason: string }>;
  setBatchStudentDiscounts: React.Dispatch<React.SetStateAction<Record<string, { amount: number; reason: string }>>>;
  onDownloadTemplate: () => void;
  defaultFeePerMonth: number;
}

export const BatchInvoiceModal: React.FC<BatchInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classes,
  selectedBatchClass,
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
  enrolledStudentsInBatchClass,
  batchStudentExclusions,
  setBatchStudentExclusions,
  batchStudentDiscounts,
  setBatchStudentDiscounts,
  onDownloadTemplate,
  defaultFeePerMonth,
}) => {
  if (!isOpen) return null;

  const baseFee = selectedBatchClass?.tuitionFeePerMonth || defaultFeePerMonth;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="batch-invoice-modal-title"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div id="batch-invoice-modal-title" className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            Sinh Hóa Đơn Hàng Loạt Theo Lớp Học
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ sinh hóa đơn hàng loạt"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Chọn Lớp Học *</label>
              <select
                value={batchClassId}
                onChange={(e) => setBatchClassId(e.target.value)}
                aria-label="Chọn lớp học để tạo hóa đơn hàng loạt"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tháng Thu *</label>
              <input
                type="text"
                placeholder={getCurrentMonthString()}
                value={batchMonth}
                onChange={(e) => setBatchMonth(e.target.value)}
                aria-label="Tháng thu học phí"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Hạn Đóng Học Phí *</label>
              <input
                type="date"
                value={batchDueDate}
                onChange={(e) => setBatchDueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Giảm Giá Chung Cho Lớp (VND)</label>
              <input
                type="number"
                min={0}
                value={batchDefaultDiscount}
                onChange={(e) => setBatchDefaultDiscount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Lý Do Giảm Giá Chung</label>
              <input
                type="text"
                placeholder="Ví dụ: Giảm giá khai giảng mùa hè 10%"
                value={batchDefaultDiscountReason}
                onChange={(e) => setBatchDefaultDiscountReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200">
                Danh Sách Học Sinh Lớp ({enrolledStudentsInBatchClass.length} học sinh)
              </span>
              <button
                type="button"
                onClick={onDownloadTemplate}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất File Mẫu Excel CSV
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
              {enrolledStudentsInBatchClass.length === 0 ? (
                <div className="p-4 text-center text-slate-500">Chưa có học sinh ghi danh trong lớp này.</div>
              ) : (
                enrolledStudentsInBatchClass.map((st) => {
                  const isExcluded = batchStudentExclusions[st.id] || false;
                  const customDisc = batchStudentDiscounts[st.id] || { amount: 0, reason: '' };
                  const effectiveDisc = customDisc.amount || batchDefaultDiscount;
                  const finalFee = Math.max(0, baseFee - effectiveDisc);

                  return (
                    <div key={st.id} className="p-2.5 flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={(e) =>
                            setBatchStudentExclusions((prev) => ({ ...prev, [st.id]: !e.target.checked }))
                          }
                          className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                        />
                        <div>
                          <p className={`font-bold ${isExcluded ? 'text-slate-500 line-through' : 'text-white'}`}>
                            {st.name} ({st.code})
                          </p>
                          <p className="text-[10px] text-slate-400">SĐT PH: {st.parentPhone}</p>
                        </div>
                      </label>

                      {!isExcluded && (
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-400">Học phí:</span>
                          <span className="font-bold text-emerald-400">{finalFee.toLocaleString()} đ</span>
                          <input
                            type="number"
                            placeholder="Giảm riêng"
                            value={customDisc.amount || ''}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBatchStudentDiscounts((prev) => ({
                                ...prev,
                                [st.id]: { amount: val, reason: 'Giảm giá riêng' },
                              }));
                            }}
                            className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Xác Nhận Tạo Hóa Đơn Hàng Loạt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
