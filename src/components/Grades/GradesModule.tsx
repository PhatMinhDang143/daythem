import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestScore, TestType } from '../../types';
import { FileSpreadsheet, Plus, Filter, Award, Calculator, X } from 'lucide-react';

export const GradesModule: React.FC = () => {
  const { classes, students, testScores, addTestScore, showToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const enrolledStudents = students.filter((s) => (s.enrolledClasses || []).includes(selectedClassId));
  const classTests = testScores.filter((t) => t.classId === selectedClassId);

  const [testFormData, setTestFormData] = useState({
    testName: 'Bài test định kỳ số 1',
    testType: '1Period' as TestType,
    weight: 0.25,
    date: '2026-08-05',
    scores: {} as Record<string, number>,
  });

  const getScoreForTestAndStudent = (testId: string, studentId: string): number | undefined => {
    const t = testScores.find((x) => x.id === testId);
    return t?.scores[studentId];
  };

  // Calculate weighted average score for a student in this class
  const calculateStudentAverage = (studentId: string): { avg: number; rank: string } => {
    let totalScoreWeighted = 0;
    let totalWeight = 0;

    classTests.forEach((t) => {
      const score = t.scores[studentId];
      if (score !== undefined) {
        totalScoreWeighted += score * t.weight;
        totalWeight += t.weight;
      }
    });

    if (totalWeight === 0) return { avg: 8.5, rank: 'Giỏi' }; // default demo fallback

    const avg = Math.round((totalScoreWeighted / totalWeight) * 10) / 10;
    let rank = 'Trung bình';
    if (avg >= 9.0) rank = 'Xuất sắc';
    else if (avg >= 8.0) rank = 'Giỏi';
    else if (avg >= 6.5) rank = 'Khá';
    else if (avg >= 5.0) rank = 'Trung bình';
    else rank = 'Yếu';

    return { avg, rank };
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    addTestScore({
      classId: selectedClassId,
      testName: testFormData.testName,
      testType: testFormData.testType,
      weight: Number(testFormData.weight),
      date: testFormData.date,
      scores: testFormData.scores,
    });
    setIsAddTestModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Sổ điểm & Bảng tổng hợp điểm trung bình môn</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 mr-2">Chọn lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              // initialize scores map
              const initialScoresMap: Record<string, number> = {};
              enrolledStudents.forEach((st) => (initialScoresMap[st.id] = 8.0));
              setTestFormData({
                testName: 'Kiểm tra 15 phút Unit 2',
                testType: '15Min',
                weight: 0.15,
                date: new Date().toISOString().split('T')[0],
                scores: initialScoresMap,
              });
              setIsAddTestModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài kiểm tra mới</span>
          </button>
        </div>
      </div>

      {/* Grade Formulas Info Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Công thức tính điểm TB môn: (Miệng × 10% + 15 phút × 15% + 1 tiết × 25% + Giữa kỳ × 20% + Cuối kỳ × 30%)</span>
        </div>
        <div className="text-indigo-400 font-semibold">Tự động quy đổi Học lực</div>
      </div>

      {/* Gradebook Matrix Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">STT</th>
                <th className="px-4 py-3.5">Học sinh</th>
                {classTests.map((t) => (
                  <th key={t.id} className="px-3 py-3.5 text-center">
                    <div>{t.testName}</div>
                    <div className="text-[9px] text-indigo-400 font-normal">Trọng số {(t.weight * 100).toFixed(0)}%</div>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-center font-bold text-amber-400 bg-amber-500/10">ĐIỂM TB MÔN</th>
                <th className="px-4 py-3.5 text-center font-bold text-emerald-400">XẾP LOẠI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={5 + classTests.length} className="p-8 text-center text-slate-400">
                    Chưa có học sinh nào trong lớp này.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((st, idx) => {
                  const { avg, rank } = calculateStudentAverage(st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.code}</div>
                      </td>

                      {/* Score per test */}
                      {classTests.map((t) => {
                        const score = getScoreForTestAndStudent(t.id, st.id);
                        return (
                          <td key={t.id} className="px-3 py-3 text-center font-semibold text-slate-100">
                            {score !== undefined ? (
                              <span className={`px-2 py-0.5 rounded ${score >= 8.0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700'}`}>
                                {score.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Average Score */}
                      <td className="px-4 py-3 text-center font-extrabold text-amber-400 text-sm bg-amber-500/5">
                        {avg.toFixed(1)}
                      </td>

                      {/* Rank */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            rank === 'Xuất sắc' || rank === 'Giỏi'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : rank === 'Khá'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Test Score Modal */}
      {isAddTestModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Tạo bài kiểm tra & Nhập điểm</h3>
              <button onClick={() => setIsAddTestModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tên bài kiểm tra *</label>
                  <input
                    type="text"
                    required
                    value={testFormData.testName}
                    onChange={(e) => setTestFormData({ ...testFormData, testName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Loại kiểm tra & Trọng số</label>
                  <select
                    value={testFormData.testType}
                    onChange={(e) => {
                      const type = e.target.value as TestType;
                      const weightMap: Record<TestType, number> = {
                        Oral: 0.1,
                        '15Min': 0.15,
                        '1Period': 0.25,
                        MidTerm: 0.2,
                        Final: 0.3,
                      };
                      setTestFormData({ ...testFormData, testType: type, weight: weightMap[type] });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Oral">Miệng / Thường xuyên (10%)</option>
                    <option value="15Min">15 Phút (15%)</option>
                    <option value="1Period">1 Tiết / Định kỳ (25%)</option>
                    <option value="MidTerm">Giữa kỳ (20%)</option>
                    <option value="Final">Cuối kỳ (30%)</option>
                  </select>
                </div>
              </div>

              {/* Student scores entry list */}
              <div>
                <label className="block text-slate-400 mb-2 font-semibold">Nhập điểm cho học sinh (thang điểm 10):</label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {enrolledStudents.map((st) => (
                    <div key={st.id} className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <span className="font-semibold text-white">{st.name}</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={testFormData.scores[st.id] ?? 8.0}
                        onChange={(e) =>
                          setTestFormData({
                            ...testFormData,
                            scores: { ...testFormData.scores, [st.id]: Number(e.target.value) },
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 text-amber-400 font-bold text-center rounded-lg py-1 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Lưu bảng điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
