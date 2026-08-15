import React from 'react';
import { Eye, Edit, Trash2, PhoneCall, GraduationCap } from 'lucide-react';
import { Student, ClassRoom } from '../../../types';
import { Badge } from '../../common/Badge';

interface StudentGridProps {
  students: Student[];
  classes: ClassRoom[];
  hasPermission: boolean;
  onViewDetail: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onSendZalo: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = React.memo(({
  students,
  classes,
  hasPermission,
  onViewDetail,
  onEdit,
  onDelete,
  onSendZalo,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => {
        const studentClasses = classes.filter((c) => (student.enrolledClasses || []).includes(c.id));
        return (
          <div
            key={student.id}
            className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-4 space-y-3 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{student.name}</h4>
                  <p className="font-mono text-[11px] text-sky-400 font-semibold">{student.code}</p>
                </div>
              </div>
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

            <div className="space-y-1 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Khối / Trường:</span>
                <span className="font-medium text-slate-200">{student.grade} - {student.school}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phụ huynh:</span>
                <span className="font-medium text-slate-200">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SĐT Phụ huynh:</span>
                <span className="font-mono font-bold text-sky-400">{student.parentPhone}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-sky-400" />
                Lớp Đang Theo Học
              </p>
              <div className="flex flex-wrap gap-1">
                {studentClasses.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic">Chưa đăng ký lớp</span>
                ) : (
                  studentClasses.map((cls) => (
                    <span
                      key={cls.id}
                      className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-300 font-medium rounded-md text-[10px]"
                    >
                      {cls.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onViewDetail(student)}
                className="text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem hồ sơ
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSendZalo(student)}
                  className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg"
                  title="Nhắn Zalo PH"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
                {hasPermission && (
                  <>
                    <button
                      type="button"
                      onClick={() => onEdit(student)}
                      className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg"
                      title="Sửa thông tin"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(student)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
