import React from 'react';
import { X, User, Phone, MapPin, GraduationCap, Calendar } from 'lucide-react';
import { Student, ClassRoom } from '../../../types';
import { Badge } from '../../common/Badge';

interface StudentDetailDrawerProps {
  student: Student | null;
  classes: ClassRoom[];
  onClose: () => void;
  onEdit: (student: Student) => void;
  hasPermission: boolean;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  classes,
  onClose,
  onEdit,
  hasPermission,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-700/80 w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{student.name}</h3>
              <p className="font-mono text-xs text-sky-400 font-semibold">{student.code}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic info */}
        <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-2">
            <span className="text-slate-400">Trạng thái theo học:</span>
            <Badge
              variant={
                student.status === 'Đang học'
                  ? 'success'
                  : student.status === 'Bảo lưu'
                  ? 'warning'
                  : 'neutral'
              }
            >
              {student.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-sky-400" /> Giới tính / Ngày sinh:</span>
            <span className="font-medium text-slate-200">{student.gender} • {student.dob}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-sky-400" /> Khối / Trường:</span>
            <span className="font-medium text-slate-200">{student.grade} - {student.school}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-400" /> Phụ huynh & SĐT:</span>
            <span className="font-bold text-sky-400">{student.parentName} ({student.parentPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> Địa chỉ thường trú:</span>
            <span className="font-medium text-slate-200">{student.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-400" /> Ngày nhập học:</span>
            <span className="font-mono text-slate-300">{student.joinedDate}</span>
          </div>
        </div>

        {/* Enrolled classes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CÁC LỚP ĐANG THEO HỌC</h4>
          <div className="space-y-2">
            {classes
              .filter((c) => (student.enrolledClasses || []).includes(c.id))
              .map((cls) => (
                <div key={cls.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{cls.name}</div>
                    <div className="text-[10px] text-slate-400">GV: {cls.teacherName} • Phòng: {cls.roomName}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-emerald-400">{cls.tuitionFeePerMonth.toLocaleString()} đ/tháng</div>
                    <div className="text-[10px] text-slate-400">{cls.scheduleDescription}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {hasPermission && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => onEdit(student)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Chỉnh Sửa Thông Tin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
