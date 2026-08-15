import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassRoom } from '../../types';
import { Calendar, Filter, Clock, MapPin, User, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const { classes, users } = useApp();
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('Tất cả');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState('Tất cả');
  const [selectedClassPopup, setSelectedClassPopup] = useState<ClassRoom | null>(null);

  const daysOfWeek = [
    { dayNumber: 1, name: 'Thứ Hai' },
    { dayNumber: 2, name: 'Thứ Ba' },
    { dayNumber: 3, name: 'Thứ Tư' },
    { dayNumber: 4, name: 'Thứ Năm' },
    { dayNumber: 5, name: 'Thứ Sáu' },
    { dayNumber: 6, name: 'Thứ Bảy' },
    { dayNumber: 7, name: 'Chủ Nhật' },
  ];

  const timeSlots = [
    { label: 'Ca 1 (17:30 - 19:00)', range: '17:30 - 19:00' },
    { label: 'Ca 2 (18:00 - 19:30)', range: '18:00 - 19:30' },
    { label: 'Ca 3 (19:30 - 21:00)', range: '19:30 - 21:00' },
  ];

  const filteredClasses = classes.filter((cls) => {
    const matchesGrade = selectedGradeFilter === 'Tất cả' || (cls.gradeLevel || '').includes(selectedGradeFilter);
    const matchesTeacher = selectedTeacherFilter === 'Tất cả' || cls.teacherName === selectedTeacherFilter;
    return matchesGrade && matchesTeacher;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Lịch giảng dạy & Thời khoá biểu các lớp</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Khối lớp:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Tất cả khối</option>
              <option value="Lớp 9">Khối 9</option>
              <option value="Lớp 10">Khối 10</option>
              <option value="Lớp 11">Khối 11</option>
              <option value="Lớp 12">Khối 12</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Giáo viên:</span>
            <select
              value={selectedTeacherFilter}
              onChange={(e) => setSelectedTeacherFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Tất cả giáo viên</option>
              {users
                .filter((u) => u.role === 'Giáo viên')
                .map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid Matrix */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-700">
                <th className="p-3.5 border-r border-slate-800 w-36 text-center font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  KHUNG GIỜ
                </th>
                {daysOfWeek.map((day) => (
                  <th key={day.dayNumber} className="p-3.5 text-center font-bold uppercase tracking-wider text-[10px] text-indigo-400 border-r border-slate-800/80 min-w-[150px]">
                    {day.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {timeSlots.map((slot) => (
                <tr key={slot.range} className="min-h-[100px]">
                  {/* Slot Label */}
                  <td className="p-3 bg-slate-900/50 border-r border-slate-800 font-semibold text-center text-slate-300">
                    <div className="text-xs font-bold">{slot.label}</div>
                  </td>

                  {/* Day Columns */}
                  {daysOfWeek.map((day) => {
                    // Find matching classes for this day and time slot
                    const matchingClasses = filteredClasses.filter(
                      (c) => (c.daysOfWeek || []).includes(day.dayNumber) && c.timeSlot === slot.range
                    );

                    return (
                      <td key={day.dayNumber} className="p-2 border-r border-slate-800/80 align-top hover:bg-slate-700/20 transition-colors">
                        <div className="space-y-2 min-h-[90px]">
                          {matchingClasses.map((cls) => (
                            <div
                              key={cls.id}
                              onClick={() => setSelectedClassPopup(cls)}
                              className="p-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-600/30 transition-all cursor-pointer space-y-1 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px] truncate">{cls.name}</span>
                              </div>

                              <div className="text-[10px] text-indigo-300 font-semibold flex items-center justify-between">
                                <span className="font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded">{cls.code}</span>
                                <span>{cls.roomName}</span>
                              </div>

                              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                <User className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{cls.teacherName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Popup Detail */}
      {selectedClassPopup && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold">
                {selectedClassPopup.code}
              </span>
              <button onClick={() => setSelectedClassPopup(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{selectedClassPopup.name}</h3>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="font-medium text-slate-200">Giáo viên: {selectedClassPopup.teacherName}</span>
              </div>
              {selectedClassPopup.assistantName && (
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-4 h-4 text-sky-400" />
                  <span>Trợ giảng: {selectedClassPopup.assistantName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Phòng học: {selectedClassPopup.roomName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Lịch học: {selectedClassPopup.scheduleDescription}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Sĩ số: {selectedClassPopup.currentEnrolled} / {selectedClassPopup.maxCapacity} học sinh</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedClassPopup(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
