import React from 'react';
import { Expense } from '../../../types';
import { Badge } from '../../common/Badge';

interface ExpenseTableProps {
  expenses: Expense[];
}

export const ExpenseTable: React.FC<ExpenseTableProps> = React.memo(({ expenses }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="px-4 py-3">Mã phiếu</th>
              <th className="px-4 py-3">Nội dung chi</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3 text-right">Số tiền</th>
              <th className="px-4 py-3">Ngày chi</th>
              <th className="px-4 py-3">Đơn vị nhận</th>
              <th className="px-4 py-3">Hình thức</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  Chưa ghi nhận khoản chi phí nào.
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">{exp.code}</td>
                  <td className="px-4 py-3 font-bold text-white">{exp.title}</td>
                  <td className="px-4 py-3 text-slate-300">{exp.category}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-400">
                    {exp.amount.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-slate-400">{exp.date}</td>
                  <td className="px-4 py-3 text-slate-300">{exp.paidTo}</td>
                  <td className="px-4 py-3 text-slate-400">{exp.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <Badge variant={exp.status === 'Đã chi' ? 'success' : 'warning'}>{exp.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
