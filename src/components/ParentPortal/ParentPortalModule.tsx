import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateStudentCode } from '../../config/constants';
import { Search, GraduationCap, CheckCircle2, Clock, AlertTriangle, XCircle, FileText, Calendar, Wallet, MessageSquare, ShieldCheck, PhoneCall } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ParentPortalModule: React.FC = () => {
  const { students, classes, attendances, grades, tests, invoices, evaluations, centerSettings, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState(students[0]?.code || generateStudentCode('001')); // default prefilled for quick view
  const [activeStudentId, setActiveStudentId] = useState<string | null>(students[0]?.id || 'stu-1');

  // Find matched student by code or parent phone
  const searchedStudent = students.find(
    (s) =>
      (s.code && s.code.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
      (s.parentPhone && s.parentPhone.includes(searchQuery.trim())) ||
      (s.name && s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const currentStudent = searchedStudent || (activeStudentId ? students.find((s) => s.id === activeStudentId) : students[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchedStudent) {
      setActiveStudentId(searchedStudent.id);
      showToast(`Đã tìm thấy thông tin học sinh ${searchedStudent.name}`);
    } else {
      showToast('Không tìm thấy học sinh với mã hoặc SĐT này. Vui lòng kiểm tra lại!', 'error');
    }
  };

  // Compute student specific metrics
  const studentAttendances = attendances.filter((a) => a.studentId === currentStudent?.id);
  const studentGrades = grades.filter((g) => g.studentId === currentStudent?.id);
  const studentInvoices = invoices.filter((i) => i.studentId === currentStudent?.id);
  const studentEvaluations = evaluations.filter((e) => e.studentId === currentStudent?.id);
  const studentClasses = classes.filter((c) =>
    (currentStudent?.enrolledClasses || (currentStudent as any)?.classIds || []).includes(c.id)
  );

  // Attendance breakdown
  const presentCount = studentAttendances.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendances.filter((a) => a.status === 'late').length;
  const excusedCount = studentAttendances.filter((a) => a.status === 'excused').length;
  const absentCount = studentAttendances.filter((a) => a.status === 'absent').length;

  return (
    <div className="p-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>PORTAL PHỤ HUYNH & HỌC SINH (PHASE 2 RELEASE)</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Cổng thông tin tra cứu Sổ Lương & Học tập Trực tuyến</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Phụ huynh tra cứu thời gian thực tình hình điểm danh, điểm kiểm tra, đánh giá rèn luyện và hóa đơn học phí của con em mình.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-700">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập Mã HS (VD: HS001) hoặc SĐT Phụ huynh..."
            className="bg-transparent text-xs text-white placeholder-slate-500 border-none focus:outline-none w-56 px-2 py-1"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            Tra cứu
          </button>
        </form>
      </div>

      {/* Quick Select Student Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 shrink-0">Học sinh mẫu:</span>
        {students.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setActiveStudentId(st.id);
              setSearchQuery(st.code);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              currentStudent?.id === st.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{st.name} ({st.code})</span>
          </button>
        ))}
      </div>

      {/* Student Profile Overview Card */}
      {currentStudent ? (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-extrabold text-lg flex items-center justify-center">
                  {currentStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{currentStudent.name}</h3>
                    <Badge variant={currentStudent.status === 'Đang học' ? 'success' : 'neutral'}>
                      {currentStudent.status === 'Đang học' ? 'Đang theo học' : 'Đã nghỉ học'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Mã HS: {currentStudent.code} • {currentStudent.grade}</p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 space-y-1">
                <div><strong className="text-slate-400">Phụ huynh:</strong> {currentStudent.parentName} ({currentStudent.parentPhone})</div>
                <div><strong className="text-slate-400">Lớp đang theo học:</strong> {studentClasses.map((c) => c.name).join(', ') || 'Chưa xếp lớp'}</div>
                <div><strong className="text-slate-400">Trường chính khóa:</strong> {currentStudent.school}</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-bold uppercase">Tỷ lệ Chuyên cần</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {studentAttendances.length > 0
                  ? `${Math.round((presentCount / studentAttendances.length) * 100)}%`
                  : '100%'}
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>Có mặt: {presentCount} buổi</span>
                <span>Vắng: {absentCount} buổi</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-bold uppercase">Công nợ Học phí</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {studentInvoices.filter((i) => i.status !== 'Đã thanh toán').reduce((acc, curr) => acc + Math.max(0, (curr.finalAmount || 0) - (curr.paidAmount || 0)), 0).toLocaleString()} đ
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {studentInvoices.some((i) => i.status === 'Quá hạn') ? (
                  <span className="text-rose-400 font-bold">Có hóa đơn quá hạn</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Tình trạng ổn định</span>
                )}
              </div>
            </div>
          </div>

          {/* Grid View for Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Attendance Timeline */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Sổ Điểm danh theo Buổi học</h4>
                </div>
                <div className="text-[11px] text-slate-400">Tổng: {studentAttendances.length} buổi</div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {studentAttendances.length > 0 ? (
                  studentAttendances.map((att) => {
                    const cls = classes.find((c) => c.id === att.classId);
                    return (
                      <div key={att.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{cls?.name || 'Lớp học'}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Ngày: {att.date}</div>
                          {att.note && <div className="text-[11px] text-slate-300 italic mt-0.5">"{att.note}"</div>}
                        </div>

                        <div>
                          {att.status === 'present' && <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" />Có mặt</Badge>}
                          {att.status === 'late' && <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Đi trễ</Badge>}
                          {att.status === 'excused' && <Badge variant="info"><AlertTriangle className="w-3 h-3 mr-1" />Có phép</Badge>}
                          {att.status === 'absent' && <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" />Vắng mặt</Badge>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">Chưa có lịch sử điểm danh nào</div>
                )}
              </div>
            </div>

            {/* Test Scores & Grades */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Bảng Điểm kiểm tra định kỳ</h4>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {studentGrades.length > 0 ? (
                  studentGrades.map((g) => {
                    const test = tests.find((t) => t.id === g.testId);
                    const cls = classes.find((c) => c.id === test?.classId);
                    return (
                      <div key={g.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{test?.title || 'Bài kiểm tra'} ({cls?.name})</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Loại: {test?.type} • Ngày: {test?.date}</div>
                        </div>

                        <div className="text-right">
                          <span className={`text-base font-extrabold ${g.score >= 8 ? 'text-emerald-400' : g.score >= 6.5 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {g.score} / 10
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">Chưa có điểm kiểm tra</div>
                )}
              </div>
            </div>

            {/* Invoices & Tuition status */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Học phí & Thông tin Chuyển khoản VietQR</h4>
                </div>
              </div>

              <div className="space-y-3">
                {studentInvoices.map((inv) => (
                  <div key={inv.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Tháng {inv.month} - {inv.className}</span>
                      <Badge variant={inv.status === 'Đã thanh toán' ? 'success' : inv.status === 'Quá hạn' ? 'danger' : 'warning'}>
                        {inv.status === 'Đã thanh toán' ? 'Đã thanh toán' : inv.status === 'Quá hạn' ? 'Quá hạn đóng' : 'Còn nợ'}
                      </Badge>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Số tiền: {inv.finalAmount.toLocaleString()} đ</span>
                      <span>Hạn nộp: {inv.dueDate}</span>
                    </div>

                    {inv.status !== 'Đã thanh toán' && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg space-y-1 font-mono">
                        <div className="font-sans font-bold text-sky-400 uppercase text-[10px]">Cú pháp Chuyển khoản VietQR:</div>
                        <div>• NH: <strong>{centerSettings.bankName}</strong></div>
                        <div>• STK: <strong className="text-amber-300">{centerSettings.bankAccountNo}</strong></div>
                        <div>• Nội dung CK: <strong className="text-emerald-400">{inv.code} {currentStudent?.name || ''}</strong></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Evaluations */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Nhận xét & Đánh giá rèn luyện</h4>
                </div>
              </div>

              <div className="space-y-3">
                {studentEvaluations.length > 0 ? (
                  studentEvaluations.map((ev) => (
                    <div key={ev.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Đánh giá Tháng {ev.month}</span>
                        <Badge variant={(ev.overallRank || (ev as any).rating) === 'Xuất sắc' || (ev.overallRank || (ev as any).rating) === 'Tốt' ? 'success' : 'info'}>
                          Xếp loại: {ev.overallRank || (ev as any).rating || 'Khá'}
                        </Badge>
                      </div>

                      <p className="text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg text-[11px] border border-slate-800/80">
                        "{ev.teacherComment || (ev as any).comment || 'Cần phát huy hơn nữa'}"
                      </p>

                      <div className="text-[10px] text-slate-500 text-right">Giáo viên phụ trách đánh giá</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">Chưa có đánh giá định kỳ nào từ Giáo viên</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          Vui lòng nhập Mã Học Sinh hoặc Số điện thoại để tra cứu
        </div>
      )}
    </div>
  );
};
