import React from 'react';
import { X, Printer } from 'lucide-react';
import { Invoice, CenterSettings } from '../../../types';

interface ReceiptModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  centerSettings: CenterSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose, centerSettings }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Printer className="w-4 h-4" />
            Phiếu Thu Học Phí & Mã VietQR
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs bg-white text-slate-900">
          <div className="text-center border-b pb-3">
            <h3 className="font-extrabold text-base uppercase text-indigo-950">{centerSettings.centerName}</h3>
            <p className="text-[11px] text-slate-600">{centerSettings.address}</p>
            <p className="text-[11px] text-slate-600">Hotline: {centerSettings.hotline}</p>
            <h4 className="font-black text-sm uppercase text-slate-800 mt-2">PHIẾU THU HỌC PHÍ</h4>
            <p className="font-mono text-[10px] text-slate-500">Mã: {invoice.code}</p>
          </div>

          <div className="space-y-1.5 font-medium text-slate-800">
            <div className="flex justify-between">
              <span>Họ tên học sinh:</span>
              <span className="font-bold">{invoice.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span>Lớp học:</span>
              <span>{invoice.className}</span>
            </div>
            <div className="flex justify-between">
              <span>Học phí tháng:</span>
              <span className="font-mono font-bold">{invoice.month}</span>
            </div>
            <div className="flex justify-between">
              <span>Hạn thanh toán:</span>
              <span>{invoice.dueDate}</span>
            </div>
          </div>

          <div className="border-t border-b py-2 space-y-1 bg-slate-50 px-3 rounded-lg font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Học phí gốc:</span>
              <span>{invoice.originalAmount.toLocaleString()} đ</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Giảm giá ({invoice.discountReason || 'Khuyến học'}):</span>
                <span>-{invoice.discountAmount.toLocaleString()} đ</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-indigo-950 border-t pt-1">
              <span>TỔNG CỘNG CẦN NỘP:</span>
              <span>{invoice.finalAmount.toLocaleString()} đ</span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-center space-y-1 font-mono">
            <p className="text-[10px] font-bold text-indigo-900 uppercase">Thông tin Chuyển khoản VietQR</p>
            <p className="text-xs font-bold text-slate-800">Ngân hàng: {centerSettings.bankName}</p>
            <p className="text-xs font-bold text-indigo-700">STK: {centerSettings.bankAccountNo}</p>
            <p className="text-[11px] text-slate-700">Chủ TK: {centerSettings.bankAccountName}</p>
            <p className="text-xs font-black text-emerald-700 bg-emerald-100 py-1 rounded">
              Nội dung CK: {invoice.code} {invoice.studentName}
            </p>
          </div>

          <div className="pt-2 flex justify-between text-[10px] text-slate-500 italic">
            <span>Trung tâm cảm ơn quý phụ huynh!</span>
            <span>Ngày in: {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            In Phiếu Thu này
          </button>
        </div>
      </div>
    </div>
  );
};
