import React from 'react';
import { X, BookOpen, Calendar, MapPin, DollarSign, User } from 'lucide-react';
import { ClassRoom, Student } from '../../../types';
import { Badge } from '../../common/Badge';

interface ClassDetailDrawerProps {
  cls: ClassRoom | null;
  students: Student[];
  onClose: () => void;
  onEdit: (cls: ClassRoom) => void;
  hasPermission: boolean;
}

export const ClassDetailDrawer: React.FC<ClassDetailDrawerProps> = ({
  cls,
  students,
  onClose,
  onEdit,
  hasPermission,
}) => {
  if (!cls) return null;

  const enrolledStudents = students.filter((s) => (s.enrolledClasses || []).includes(cls.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-700/80 w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold rounded text-[10px] uppercase font-mono">
              {cls.code}
            </span>
            <h3 className="text-base font-extrabold text-white mt-1">{cls.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
            <span className="text-slate-400">Trạng thái mở lớp:</span>
            <Badge
              variant={
                cls.status === 'Đang mở'
                  ? 'success'
                  : cls.status === 'Sắp khai giảng'
                  ? 'warning'
                  : 'neutral'
              }
            >
              {cls.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-sky-400" /> Môn học & Khối:</span>
            <span className="font-medium text-slate-200">{cls.subject} ({cls.gradeLevel})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-sky-400" /> Giáo viên phụ trách:</span>
            <span className="font-bold text-sky-300">{cls.teacherName}</span>
          </div>
          {cls.assistantName && (
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-sky-400" /> Trợ giảng:</span>
              <span className="font-medium text-slate-200">{cls.assistantName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Phòng học:</span>
            <span className="font-medium text-slate-200">{cls.roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-400" /> Lịch học:</span>
            <span className="font-medium text-slate-200">{cls.scheduleDescription}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-sky-400" /> Học phí theo tháng:</span>
            <span className="font-mono font-bold text-emerald-400">{cls.tuitionFeePerMonth.toLocaleString()} đ</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            DANH SÁCH HỌC SINH ({enrolledStudents.length} / {cls.maxCapacity})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {enrolledStudents.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center bg-slate-800/40 rounded-xl">Chưa có học sinh đăng ký lớp này.</p>
            ) : (
              enrolledStudents.map((st, idx) => (
                <div key={st.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{st.name}</div>
                      <div className="text-[10px] text-slate-400">PH: {st.parentName} ({st.parentPhone})</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-sky-400 font-semibold">{st.code}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {hasPermission && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => onEdit(cls)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Chỉnh Sửa Lớp Học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
