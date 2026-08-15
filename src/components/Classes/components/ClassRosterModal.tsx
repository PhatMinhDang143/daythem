import React from 'react';
import { X, Users, Phone } from 'lucide-react';
import { ClassRoom, Student } from '../../../types';

interface ClassRosterModalProps {
  cls: ClassRoom | null;
  students: Student[];
  onClose: () => void;
}

export const ClassRosterModal: React.FC<ClassRosterModalProps> = ({ cls, students, onClose }) => {
  if (!cls) return null;

  const enrolledStudents = students.filter((s) => (s.enrolledClasses || []).includes(cls.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Users className="w-4 h-4" />
            Danh Sách Học Sinh Lớp {cls.name} ({enrolledStudents.length} học sinh)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
          {enrolledStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Chưa có học sinh ghi danh trong lớp học này.</div>
          ) : (
            enrolledStudents.map((student, idx) => (
              <div
                key={student.id}
                className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-sm">{student.name}</h5>
                    <p className="text-[11px] text-slate-400">
                      Mã: <span className="font-mono text-sky-400 font-semibold">{student.code}</span> • {student.school} ({student.grade})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-slate-300 font-medium">PH: {student.parentName}</p>
                  <p className="text-sky-400 font-mono font-bold flex items-center justify-end gap-1 text-[11px]">
                    <Phone className="w-3 h-3" />
                    {student.parentPhone}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
