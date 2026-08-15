import React from 'react';
import { Users, Calendar, MapPin, Eye, Edit, Trash2, UserCheck } from 'lucide-react';
import { ClassRoom, Student } from '../../../types';
import { Badge } from '../../common/Badge';

interface ClassGridProps {
  classes: ClassRoom[];
  students: Student[];
  hasPermission: boolean;
  onViewDetail: (cls: ClassRoom) => void;
  onOpenRoster: (cls: ClassRoom) => void;
  onEdit: (cls: ClassRoom) => void;
  onDelete: (cls: ClassRoom) => void;
}

export const ClassGrid: React.FC<ClassGridProps> = React.memo(({
  classes,
  students,
  hasPermission,
  onViewDetail,
  onOpenRoster,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {classes.map((cls) => {
        const enrolledCount = students.filter((s) => (s.enrolledClasses || []).includes(cls.id)).length;
        const capacityPercent = Math.round((enrolledCount / cls.maxCapacity) * 100);

        return (
          <div
            key={cls.id}
            className="bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold rounded text-[10px] uppercase font-mono">
                    {cls.code}
                  </span>
                  <h3 className="font-extrabold text-white text-base mt-1">{cls.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">Môn: {cls.subject} • {cls.gradeLevel}</p>
                </div>
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

              {/* Progress Capacity bar */}
              <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    Sĩ số học sinh:
                  </span>
                  <span className="font-bold font-mono">
                    {enrolledCount} / {cls.maxCapacity} học sinh ({capacityPercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      capacityPercent >= 100
                        ? 'bg-rose-500'
                        : capacityPercent >= 80
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, capacityPercent)}%` }}
                  />
                </div>
              </div>

              {/* Schedule and Details */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{cls.scheduleDescription}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Phòng học: <strong className="text-white">{cls.roomName}</strong></span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">Giáo viên:</span>
                  <span className="font-bold text-sky-300">{cls.teacherName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Học phí:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {cls.tuitionFeePerMonth.toLocaleString()} đ/tháng
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewDetail(cls)}
                  className="text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Chi tiết
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRoster(cls)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Danh sách lớp ({enrolledCount})
                </button>
              </div>

              {hasPermission && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(cls)}
                    className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors"
                    title="Sửa lớp học"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cls)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                    title="Xóa lớp học"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
