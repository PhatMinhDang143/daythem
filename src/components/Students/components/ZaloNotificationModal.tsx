import React from 'react';
import { X, Send, PhoneCall } from 'lucide-react';
import { Student, CenterSettings } from '../../../types';
import { getCurrentMonthString, getCurrentYear } from '../../../config/constants';

interface ZaloNotificationModalProps {
  student: Student | null;
  onClose: () => void;
  centerSettings: CenterSettings;
}

export const ZaloNotificationModal: React.FC<ZaloNotificationModalProps> = ({ student, onClose, centerSettings }) => {
  if (!student) return null;

  const currentMonth = getCurrentMonthString();
  const currentYear = getCurrentYear();
  const monthNum = currentMonth.split('-')[1];

  const sampleMessage = centerSettings.zaloTemplateReminder
    .replace('{studentName}', student.name)
    .replace('{month}', currentMonth)
    .replace('{amount}', '1.200.000 VND')
    .replace('{dueDate}', `10/${monthNum}/${currentYear}`);

  const handleSend = () => {
    const zaloUrl = `https://zalo.me/${student.parentPhone}`;
    window.open(zaloUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="zalo-modal-title"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div id="zalo-modal-title" className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4" />
            Gửi Tin Nhắn Zalo Phụ Huynh
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ nhắn Zalo"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <p className="text-slate-400">Học sinh: <strong className="text-white">{student.name}</strong></p>
            <p className="text-slate-400">Phụ huynh: <strong className="text-white">{student.parentName}</strong></p>
            <p className="text-slate-400">SĐT Zalo: <strong className="text-sky-400 font-mono">{student.parentPhone}</strong></p>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Nội dung mẫu tin nhắn Zalo gửi đi:</label>
            <textarea
              rows={5}
              readOnly
              value={sampleMessage}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-[11px] focus:outline-none"
            />
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
              type="button"
              onClick={handleSend}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Mở Khung Chat Zalo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
