import React from 'react';
import { Printer, Send, CheckCircle2 } from 'lucide-react';
import { Invoice, InvoiceStatus } from '../../../types';
import { Badge } from '../../common/Badge';

interface InvoiceTableProps {
  invoices: Invoice[];
  onSelectForPrint: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice) => void;
  onUpdateStatus: (id: string, status: InvoiceStatus, paidAmount?: number) => void;
  hasPermission: boolean;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = React.memo(({
  invoices,
  onSelectForPrint,
  onSendReminder,
  onUpdateStatus,
  hasPermission,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="px-4 py-3">Mã HĐ</th>
              <th className="px-4 py-3">Học sinh</th>
              <th className="px-4 py-3">Lớp học</th>
              <th className="px-4 py-3">Tháng</th>
              <th className="px-4 py-3 text-right">Phải thu</th>
              <th className="px-4 py-3 text-right">Đã nộp</th>
              <th className="px-4 py-3">Hạn nộp</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  Không tìm thấy hóa đơn học phí phù hợp.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sky-400">{inv.code}</td>
                  <td className="px-4 py-3 font-bold text-white">{inv.studentName}</td>
                  <td className="px-4 py-3 text-slate-300">{inv.className}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{inv.month}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">
                    {inv.finalAmount.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">
                    {(inv.paidAmount || 0).toLocaleString()} đ
                  </td>
                  <td className="px-4 py-3 text-slate-400">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        inv.status === 'Đã thanh toán'
                          ? 'success'
                          : inv.status === 'Quá hạn'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectForPrint(inv)}
                        title="In phiếu thu Zalo QR"
                        className="p-1.5 bg-slate-700/70 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {inv.status !== 'Đã thanh toán' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onSendReminder(inv)}
                            title="Gửi nhắc đóng học phí qua Zalo"
                            className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {hasPermission && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(inv.id, 'Đã thanh toán', inv.finalAmount)}
                              title="Xác nhận đã thu đủ tiền"
                              className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Thu tiền
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
