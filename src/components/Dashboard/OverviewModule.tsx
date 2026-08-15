import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_NAME, BRAND_SLOGAN, BRAND_AVATAR } from '../../assets/brandAssets';
import { getCurrentFormattedMonthYear, getCurrentYear } from '../../config/constants';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const OverviewModule: React.FC = () => {
  const { stats, classes, students, invoices, sessions, centerSettings } = useApp();
  const currentFormattedMonth = getCurrentFormattedMonthYear();
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('Tất cả');
  const [selectedTimeRange, setSelectedTimeRange] = useState(`${currentFormattedMonth} (Hiện tại)`);

  // Format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Chart 1 Data: Donut Chart - Tỷ lệ lấp đầy sĩ số các lớp
  const classCapacityData = classes.map((c) => ({
    name: c.code,
    fullName: c.name,
    enrolled: c.currentEnrolled,
    available: Math.max(0, c.maxCapacity - c.currentEnrolled),
  }));

  // Chart 2 Data: Line Chart - Dynamic Revenue vs Expenses (6 Months)
  const financialTrendsData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthLabel = `T${d.getMonth() + 1}/${d.getFullYear()}`;
      const isCurrent = i === 5;
      return {
        month: monthLabel,
        revenue: isCurrent ? stats.totalRevenueThisMonth || 31650000 : 18000000 + i * 2500000,
        expense: isCurrent ? 18000000 : 12000000 + i * 1500000,
      };
    });
  }, [stats.totalRevenueThisMonth]);

  // Chart 3 Data: Bar Chart - Average score by subject
  const subjectScoresData = [
    { subject: 'Tiếng Anh', avgScore: 8.2 },
    { subject: 'Toán', avgScore: 8.5 },
    { subject: 'Vật Lý', avgScore: 7.8 },
    { subject: 'Hóa Học', avgScore: 7.6 },
    { subject: 'Ngữ Văn', avgScore: 8.0 },
  ];

  // Chart 4 Data: Area Chart - Weekly Attendance Rate
  const attendanceTrendsData = [
    { week: 'Tuần 1', presentRate: 96, lateRate: 3, absentRate: 1 },
    { week: 'Tuần 2', presentRate: 94, lateRate: 4, absentRate: 2 },
    { week: 'Tuần 3', presentRate: 98, lateRate: 1, absentRate: 1 },
    { week: 'Tuần 4', presentRate: 95, lateRate: 3, absentRate: 2 },
  ];

  // Chart 5 Data: Pie Chart - Student Status Distribution
  const activeCount = students.filter((s) => s.status === 'Đang học').length;
  const reservedCount = students.filter((s) => s.status === 'Bảo lưu').length;
  const droppedCount = students.filter((s) => s.status === 'Nghỉ học').length;

  const studentStatusData = [
    { name: 'Đang học', value: activeCount, color: '#10b981' },
    { name: 'Bảo lưu', value: reservedCount, color: '#f59e0b' },
    { name: 'Nghỉ học', value: droppedCount, color: '#f43f5e' },
  ];

  // Chart 6 Data: Bar Chart - Grade Level Distribution
  const gradeDistribution = [
    { grade: 'Khối 9', count: students.filter((s) => s.grade === 'Khối 9').length },
    { grade: 'Khối 10', count: students.filter((s) => s.grade === 'Khối 10').length },
    { grade: 'Khối 11', count: students.filter((s) => s.grade === 'Khối 11').length },
    { grade: 'Khối 12', count: students.filter((s) => s.grade === 'Khối 12').length },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="p-6 space-y-6">
      {/* Brand Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#243C4C] via-[#1d313e] to-[#243C4C] border border-[#3b5568] p-6 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Background Watermark Image */}
        <div className="absolute right-[-20px] top-[-30px] pointer-events-none opacity-15">
          <img src={centerSettings.customLogoUrl || BRAND_AVATAR} alt="Watermark" className="w-80 h-80 object-contain" />
        </div>

        <div className="relative z-10 max-w-xl space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5289AD]/20 border border-[#5289AD]/30 text-[#F4FCFB] text-xs font-extrabold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HE THONG QUAN LY TRUNG TAM {BRAND_NAME}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#F4FCFB] tracking-tight leading-snug">
            {BRAND_SLOGAN}
          </h1>
          <p className="text-xs text-[#ACBCBF] leading-relaxed">
            Hệ thống quản lý giảng dạy, theo dõi chuyên cần, đánh giá kết quả học tập & thu học phí tự động hoá toàn diện dành cho giáo viên và phụ huynh.
          </p>
        </div>

        {/* Featured Avatar Logo */}
        <div className="relative z-10 flex items-center gap-4 shrink-0">
          <img
            src={centerSettings.customLogoUrl || BRAND_AVATAR}
            alt={BRAND_NAME}
            className="w-28 h-28 rounded-full object-cover border-4 border-[#5289AD] shadow-2xl shadow-[#5289AD]/30 ring-4 ring-[#1d313e]"
          />
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">BỘ LỌC THỐNG KÊ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Grade filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Khối:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="Tất cả">Tất cả khối lớp</option>
              <option value="Khối 9">Khối 9</option>
              <option value="Khối 10">Khối 10</option>
              <option value="Khối 11">Khối 11</option>
              <option value="Khối 12">Khối 12</option>
            </select>
          </div>

          {/* Time range filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Thời gian:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              aria-label="Chọn khoảng thời gian báo cáo"
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value={`${currentFormattedMonth} (Hiện tại)`}>{currentFormattedMonth} (Hiện tại)</option>
              <option value={`Tháng ${new Date().getMonth() === 0 ? 12 : new Date().getMonth()}/${new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()}`}>
                Tháng {new Date().getMonth() === 0 ? 12 : new Date().getMonth()}/{new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()}
              </option>
              <option value={`Quý ${Math.floor(new Date().getMonth() / 3) + 1}/${new Date().getFullYear()}`}>
                Quý {Math.floor(new Date().getMonth() / 3) + 1}/{new Date().getFullYear()}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Students */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TỔNG HỌC SINH</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.totalStudents}</h3>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Đang theo học tại 9 lớp chuyên đề</p>
        </div>

        {/* Card 2: Active Classes */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LỚP ĐANG MỞ</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.totalClasses}</h3>
            <span className="text-xs font-semibold text-slate-300">Sĩ số TB: 16/20</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">5 môn học: Anh, Toán, Lý, Hóa, Văn</p>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DOANH THU THÁNG</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {formatVND(stats.totalRevenueThisMonth)}
            </h3>
            <span className="text-xs font-semibold text-emerald-400">+{stats.revenueGrowthPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Đã thu từ 15/18 học phí</p>
        </div>

        {/* Card 4: Unpaid Tuition */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CÔNG NỢ HỌC PHÍ</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-rose-400 tracking-tight">
              {formatVND(stats.totalUnpaidTuition)}
            </h3>
            <span className="text-xs font-semibold text-amber-400">3 học sinh</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Cần gửi nhắc phí trước ngày 10/08</p>
        </div>
      </div>

      {/* 6 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Donut Chart - Tỷ lệ lấp đầy sĩ số các lớp */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Sĩ số & Tỷ lệ lấp đầy lớp học</h4>
              <p className="text-xs text-slate-400">Số lượng học sinh hiện tại so với giới hạn lớp</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 1/6
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="enrolled" name="Học sinh hiện có" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" name="Chỗ trống còn lại" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Line Chart - Revenue vs Expense Trends */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Xu hướng Thu - Chi trung tâm (6 tháng)</h4>
              <p className="text-xs text-slate-400">So sánh tổng thu học phí & chi phí vận hành</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 2/6
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialTrendsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip
                  formatter={(val: number) => formatVND(val)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu (VND)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Chi phí (VND)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Bar Chart - Average Score by Subject */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Điểm trung bình các bộ môn</h4>
              <p className="text-xs text-slate-400">Đánh giá chất lượng giảng dạy theo môn</p>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 3/6
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectScoresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="avgScore" name="Điểm trung bình" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                  {subjectScoresData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Area Chart - Attendance Rate */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Tỷ lệ chuyên cần & điểm danh tuần</h4>
              <p className="text-xs text-slate-400">Tỷ lệ có mặt, đi trễ và vắng mặt trong tháng</p>
            </div>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 4/6
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="presentRate"
                  name="Có mặt (%)"
                  stroke="#38bdf8"
                  fill="#0284c7"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Pie Chart - Student Status */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Phân bố trạng thái học sinh</h4>
              <p className="text-xs text-slate-400">Tỷ lệ học sinh đang học, bảo lưu & nghỉ học</p>
            </div>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 5/6
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {studentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Bar Chart - Grade Level Distribution */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Số học sinh theo khối lớp</h4>
              <p className="text-xs text-slate-400">Khối 9, 10, 11, 12</p>
            </div>
            <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg">
              Biểu đồ 6/6
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="count" name="Số học sinh" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Summary Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Lịch học các lớp hôm nay (Thứ 2)
          </h4>
          <div className="space-y-2.5">
            {classes.slice(0, 3).map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-100">{cls.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {cls.teacherName} • {cls.roomName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                    {cls.timeSlot}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Sĩ số: {cls.currentEnrolled}/{cls.maxCapacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Financial Receipts */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Lịch sử thu học phí mới nhất
          </h4>
          <div className="space-y-2.5">
            {invoices.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-100">{inv.studentName}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{inv.className}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{formatVND(inv.finalAmount)}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
