import React from 'react';
import { DollarSign, AlertCircle, TrendingDown, Layers } from 'lucide-react';
import { Invoice, Expense } from '../../../types';

interface InvoiceStatsHeaderProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export const InvoiceStatsHeader: React.FC<InvoiceStatsHeaderProps> = ({ invoices, expenses }) => {
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.finalAmount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Đã thanh toán').reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalUnpaid = invoices.filter((i) => i.status !== 'Đã thanh toán').reduce((acc, curr) => acc + (curr.finalAmount - curr.paidAmount), 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">Tổng Doanh Thu Đã Thu</p>
          <p className="text-xl font-black text-emerald-400 mt-1">{totalPaid.toLocaleString()} đ</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Tổng số đã thực thu vào quỹ</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">Công Nợ Cần Thu</p>
          <p className="text-xl font-black text-amber-400 mt-1">{totalUnpaid.toLocaleString()} đ</p>
          <p className="text-[11px] text-amber-500/80 mt-0.5">Cần nhắc nhở đóng học phí</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">Tổng Chi Phí Hoạt Động</p>
          <p className="text-xl font-black text-rose-400 mt-1">{totalExpense.toLocaleString()} đ</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lương, mặt bằng, điện nước</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">Lợi Nhuận Ròng Thuần</p>
          <p className="text-xl font-black text-sky-400 mt-1">{(totalPaid - totalExpense).toLocaleString()} đ</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Sau khi trừ chi phí vận hành</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
