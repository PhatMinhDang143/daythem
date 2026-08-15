import React from 'react';
import { Eye, Edit, Trash2, PhoneCall } from 'lucide-react';
import { Student, ClassRoom } from '../../../types';
import { Badge } from '../../common/Badge';

interface StudentTableProps {
  students: Student[];
  classes: ClassRoom[];
  hasPermission: boolean;
  onViewDetail: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onSendZalo: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = React.memo(({
  students,
  classes,
  hasPermission,
  onViewDetail,
  onEdit,
  onDelete,
  onSendZalo,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="px-4 py-3">Mã HS</th>
              <th className="px-4 py-3">Họ và Tên</th>
              <th className="px-4 py-3">Khối / Trường</th>
              <th className="px-4 py-3">Phụ huynh & SĐT</th>
              <th className="px-4 py-3">Lớp Đang Học</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Không tìm thấy học sinh nào phù hợp.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const studentClasses = classes.filter((c) => (student.enrolledClasses || []).includes(c.id));
                return (
                  <tr key={student.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-sky-400">{student.code}</td>
                    <td className="px-4 py-3 font-bold text-white">
                      <button
                        type="button"
                        onClick={() => onViewDetail(student)}
                        className="hover:underline text-left"
                      >
                        {student.name}
                      </button>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {student.gender} • {student.dob}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="font-semibold">{student.grade}</div>
                      <div className="text-[10px] text-slate-400">{student.school}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{student.parentName}</div>
                      <div className="text-[10px] text-sky-400 font-mono font-semibold">
                        {student.parentPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {studentClasses.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic">Chưa xếp lớp</span>
                        ) : (
                          studentClasses.map((cls) => (
                            <span
                              key={cls.id}
                              className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 rounded text-[10px] font-semibold"
                            >
                              {cls.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(student)}
                          className="p-1.5 bg-slate-700/70 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                          title="Xem thông tin chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSendZalo(student)}
                          className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                          title="Gửi tin nhắn Zalo"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        {hasPermission && (
                          <>
                            <button
                              type="button"
                              onClick={() => onEdit(student)}
                              className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors"
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(student)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
