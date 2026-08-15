import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingLevel, StudentEvaluation } from '../../types';
import { getCurrentMonthString } from '../../config/constants';
import {
  Award,
  Calendar,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle,
  FileSpreadsheet,
  X,
  Share2,
} from 'lucide-react';

export const EvaluationsModule: React.FC = () => {
  const { classes, students, evaluations, saveEvaluation, showToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthString());
  const [selectedReportStudent, setSelectedReportStudent] = useState<any | null>(null);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const enrolledStudents = students.filter((s) => (s.enrolledClasses || []).includes(selectedClassId));

  const ratingOptions: RatingLevel[] = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt'];

  const getEvaluationForStudent = (studentId: string): StudentEvaluation | undefined => {
    return evaluations.find(
      (e) => e.studentId === studentId && e.classId === selectedClassId && e.month === selectedMonth
    );
  };

  const handleUpdateEvaluationField = (
    studentId: string,
    field: keyof Omit<StudentEvaluation, 'id' | 'studentId' | 'classId' | 'month' | 'updatedAt'>,
    value: any
  ) => {
    const existing = getEvaluationForStudent(studentId);
    saveEvaluation({
      studentId,
      classId: selectedClassId,
      month: selectedMonth,
      attitude: field === 'attitude' ? value : existing?.attitude || 'Tốt',
      homeworkQuality: field === 'homeworkQuality' ? value : existing?.homeworkQuality || 'Khá',
      progress: field === 'progress' ? value : existing?.progress || 'Tốt',
      skillLevel: field === 'skillLevel' ? value : existing?.skillLevel || 'Tốt',
      overallRank: field === 'overallRank' ? value : existing?.overallRank || 'Tốt',
      teacherComment: field === 'teacherComment' ? value : existing?.teacherComment || 'Em đi học đúng giờ, tiếp thu bài tốt.',
    });
  };

  const handleSendToParent = (studentName: string, parentPhone: string) => {
    showToast(`Đã gửi thông báo đánh giá học tập của ${studentName} tới SĐT ${parentPhone} qua Zalo!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Ma trận Đánh giá & Phân loại Học sinh định kỳ</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class select */}
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 mr-2">Lớp học:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Month select */}
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 mr-2">Tháng đánh giá:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="2026-08">Tháng 8/2026</option>
              <option value="2026-07">Tháng 7/2026</option>
              <option value="2026-06">Tháng 6/2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5">Học sinh</th>
                <th className="px-3 py-3.5 text-center">Thái độ học</th>
                <th className="px-3 py-3.5 text-center">Bài tập về nhà</th>
                <th className="px-3 py-3.5 text-center">Sự tiến bộ</th>
                <th className="px-3 py-3.5 text-center">Xếp loại chung</th>
                <th className="px-4 py-3.5">Nhận xét của Giáo viên</th>
                <th className="px-4 py-3.5 text-right">Báo phụ huynh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có học sinh nào trong lớp này.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((st) => {
                  const ev = getEvaluationForStudent(st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.code}</div>
                      </td>

                      {/* Attitude */}
                      <td className="px-3 py-3 text-center">
                        <select
                          value={ev?.attitude || 'Tốt'}
                          onChange={(e) => handleUpdateEvaluationField(st.id, 'attitude', e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          {ratingOptions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Homework */}
                      <td className="px-3 py-3 text-center">
                        <select
                          value={ev?.homeworkQuality || 'Khá'}
                          onChange={(e) => handleUpdateEvaluationField(st.id, 'homeworkQuality', e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          {ratingOptions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Progress */}
                      <td className="px-3 py-3 text-center">
                        <select
                          value={ev?.progress || 'Tốt'}
                          onChange={(e) => handleUpdateEvaluationField(st.id, 'progress', e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          {ratingOptions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Overall Rank */}
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            (ev?.overallRank || 'Tốt') === 'Tốt'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : (ev?.overallRank || 'Tốt') === 'Khá'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {ev?.overallRank || 'Tốt'}
                        </span>
                      </td>

                      {/* Teacher Comment */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={ev?.teacherComment || 'Tương tác sôi nổi, tiếp thu bài tốt.'}
                          onChange={(e) => handleUpdateEvaluationField(st.id, 'teacherComment', e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Parent Report Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedReportStudent({ student: st, eval: ev })}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Báo PH</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Report Preview Modal */}
      {selectedReportStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Báo cáo kết quả học tập cho Phụ huynh
              </h3>
              <button onClick={() => setSelectedReportStudent(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-4 rounded-xl space-y-3 text-xs text-slate-200">
              <div className="font-bold text-indigo-300 text-sm border-b border-slate-700 pb-2">
                TRUNG TÂM DẠY THÊM - BÁO CÁO THÁNG {selectedMonth}
              </div>
              <div>Họ tên học sinh: <strong className="text-white">{selectedReportStudent.student.name}</strong> ({selectedReportStudent.student.code})</div>
              <div>Lớp học: <strong className="text-white">{activeClass.name}</strong></div>
              <div>Phụ huynh: <strong className="text-white">{selectedReportStudent.student.parentName}</strong> ({selectedReportStudent.student.parentPhone})</div>

              <div className="pt-2 border-t border-slate-700 space-y-1">
                <div>• Thái độ học tập: <span className="font-semibold text-emerald-400">{selectedReportStudent.eval?.attitude || 'Tốt'}</span></div>
                <div>• Chất lượng BTVN: <span className="font-semibold text-emerald-400">{selectedReportStudent.eval?.homeworkQuality || 'Tốt'}</span></div>
                <div>• Đánh giá chung: <span className="font-semibold text-emerald-400">{selectedReportStudent.eval?.overallRank || 'Tốt'}</span></div>
                <div className="mt-2 text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  "Nhận xét GV: {selectedReportStudent.eval?.teacherComment || 'Học sinh đi học đầy đủ, tương tác tốt.'}"
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReportStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleSendToParent(selectedReportStudent.student.name, selectedReportStudent.student.parentPhone);
                  setSelectedReportStudent(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Gửi qua Zalo Phụ huynh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
