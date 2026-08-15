import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, SessionDetail } from '../../types';
import {
  ClipboardCheck,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Save,
  Check,
  UserCheck,
  Sparkles,
  Edit2,
  X,
  Send,
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { classes, students, sessions, updateAttendanceEntry, recordSessionAttendance, showToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const enrolledStudents = students.filter((s) => (s.enrolledClasses || []).includes(selectedClassId));

  // Current session data for selected class & date
  const currentSession = sessions.find((s) => s.classId === selectedClassId && s.date === selectedDate);

  const [sessionModalData, setSessionModalData] = useState({
    topic: currentSession?.topic || 'IELTS Writing Task 2: Opinion Essays & Structure',
    objective: currentSession?.objective || 'Nắm vững bố cục 4 đoạn và viết mở bài chuẩn 6.5+',
    qualityRating: (currentSession?.qualityRating || 'Xuất sắc') as SessionDetail['qualityRating'],
    homeworkAssigned: currentSession?.homeworkAssigned || 'Hoàn thành bài luận 250 từ về chủ đề Giáo Dục',
  });

  const sampleDates = ['2026-08-03', '2026-08-05', '2026-08-07', '2026-08-10'];

  const getAttendanceStatus = (studentId: string, date: string): AttendanceStatus => {
    const ses = sessions.find((s) => s.classId === selectedClassId && s.date === date);
    return ses?.entries[studentId] || 'present';
  };

  const handleToggleCellStatus = (studentId: string, date: string) => {
    const current = getAttendanceStatus(studentId, date);
    const nextStatus: Record<AttendanceStatus, AttendanceStatus> = {
      present: 'late',
      late: 'excused',
      excused: 'absent',
      absent: 'present',
    };
    updateAttendanceEntry(selectedClassId, date, studentId, nextStatus[current]);
  };

  const handleMarkAllPresent = () => {
    enrolledStudents.forEach((st) => {
      updateAttendanceEntry(selectedClassId, selectedDate, st.id, 'present');
    });
    showToast(`Đã điểm danh CÓ MẶT cho tất cả ${enrolledStudents.length} học sinh!`);
  };

  const handleSaveSessionDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const existingEntries = currentSession?.entries || {};
    enrolledStudents.forEach((st) => {
      if (!existingEntries[st.id]) existingEntries[st.id] = 'present';
    });

    recordSessionAttendance({
      classId: selectedClassId,
      date: selectedDate,
      topic: sessionModalData.topic,
      objective: sessionModalData.objective,
      qualityRating: sessionModalData.qualityRating,
      homeworkAssigned: sessionModalData.homeworkAssigned,
      entries: existingEntries,
    });
    setIsSessionModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">ĐIỂM DANH LỚP:</span>
          </div>

          {/* Class Select */}
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} ({c.scheduleDescription})
                </option>
              ))}
            </select>
          </div>

          {/* Date Select */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Điểm danh nhanh cả lớp (Có mặt)</span>
          </button>

          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Nội dung & Đánh giá buổi học</span>
          </button>
        </div>
      </div>

      {/* Session Banner Info */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            NỘI DUNG BUỔI HỌC NGÀY {selectedDate} ({activeClass.name})
          </div>
          <div className="text-sm font-semibold text-white mt-1">
            Chủ đề: {currentSession?.topic || 'Luyện tập cấu trúc ngữ pháp & giải đề vận dụng'}
          </div>
          <div className="text-xs text-slate-300 mt-0.5">
            Mục tiêu: {currentSession?.objective || 'Rèn luyện kỹ năng và giải đáp thắc mắc bài tập'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-200 text-xs font-bold border border-indigo-500/30">
            Chất lượng: {currentSession?.qualityRating || 'Xuất sắc'}
          </span>
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="text-slate-400">CHÚ THÍCH MÃ MÀU:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-200">Có mặt (Green)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-slate-200">Đi trễ (Yellow)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500"></span>
          <span className="text-slate-200">Có phép (Blue)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-slate-200">Vắng mặt (Red)</span>
        </div>
        <span className="text-slate-500 text-[11px] ml-auto">
          * Nhấp vào từng ô để đổi nhanh trạng thái
        </span>
      </div>

      {/* Attendance Matrix Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">STT</th>
                <th className="px-4 py-3.5">Học sinh</th>
                <th className="px-4 py-3.5">Mã HS & Lớp</th>
                {sampleDates.map((dateStr) => (
                  <th key={dateStr} className={`px-4 py-3.5 text-center ${dateStr === selectedDate ? 'text-indigo-400 font-bold bg-indigo-500/10' : ''}`}>
                    {dateStr}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right">Ghi chú riêng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có học sinh nào đăng ký lớp học này.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-white">{st.name}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{st.code}</td>

                    {/* Attendance Cells */}
                    {sampleDates.map((d) => {
                      const stStatus = getAttendanceStatus(st.id, d);
                      const isSelectedCol = d === selectedDate;

                      return (
                        <td key={d} className={`px-4 py-3 text-center ${isSelectedCol ? 'bg-indigo-500/5' : ''}`}>
                          <button
                            onClick={() => handleToggleCellStatus(st.id, d)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer ${
                              stStatus === 'present'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : stStatus === 'late'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                                : stStatus === 'excused'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                            }`}
                          >
                            {stStatus === 'present' && 'Có mặt'}
                            {stStatus === 'late' && 'Đi trễ'}
                            {stStatus === 'excused' && 'Có phép'}
                            {stStatus === 'absent' && 'Vắng mặt'}
                          </button>
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                      {currentSession?.notesPerStudent?.[st.id] || 'Tương tác tốt'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Nội dung & Đánh giá buổi học ({selectedDate})
              </h3>
              <button onClick={() => setIsSessionModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSessionDetails} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nội dung / Chủ đề bài dạy *</label>
                <input
                  type="text"
                  required
                  value={sessionModalData.topic}
                  onChange={(e) => setSessionModalData({ ...sessionModalData, topic: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  placeholder="IELTS Writing Task 2..."
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mục tiêu học tập buổi này</label>
                <textarea
                  rows={2}
                  value={sessionModalData.objective}
                  onChange={(e) => setSessionModalData({ ...sessionModalData, objective: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Đánh giá chất lượng buổi học</label>
                  <select
                    value={sessionModalData.qualityRating}
                    onChange={(e) => setSessionModalData({ ...sessionModalData, qualityRating: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Đạt">Đạt</option>
                    <option value="Cần cải thiện">Cần cải thiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bài tập về nhà giao</label>
                  <input
                    type="text"
                    value={sessionModalData.homeworkAssigned}
                    onChange={(e) => setSessionModalData({ ...sessionModalData, homeworkAssigned: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Lưu thông tin buổi học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
