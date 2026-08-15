import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_NAME, BRAND_SLOGAN, BRAND_AVATAR } from '../assets/brandAssets';
import { getCurrentFormattedMonthYear } from '../config/constants';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  UserPlus,
  BookPlus,
  ReceiptText,
  X,
  Calendar,
  LogOut,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Modal } from './common/Modal';

export const Header: React.FC<{
  onOpenQuickAddStudent?: () => void;
  onOpenQuickAddClass?: () => void;
  onOpenQuickAddInvoice?: () => void;
}> = ({ onOpenQuickAddStudent, onOpenQuickAddClass, onOpenQuickAddInvoice }) => {
  const {
    activeModule,
    setActiveModule,
    currentUser,
    invoices,
    isApiConnected,
    logoutWithBackend,
    changeUserPassword,
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActionMenu, setShowQuickActionMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFormattedMonth = getCurrentFormattedMonthYear();

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu mới và nhập lại mật khẩu không trùng khớp');
      return;
    }
    const success = await changeUserPassword(oldPassword, newPassword);
    if (success) {
      setShowChangePassModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const moduleTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: `Tổng quan ${BRAND_NAME}`,
      subtitle: `${BRAND_SLOGAN} - Báo cáo chỉ số vận hành & học tập theo thời gian thực`,
    },
    students: {
      title: 'Quản lý Học sinh',
      subtitle: 'Danh sách, hồ sơ cá nhân, liên hệ phụ huynh & lớp đăng học',
    },
    classes: {
      title: 'Quản lý Lớp học',
      subtitle: 'Lớp học, gán giáo viên & trợ giảng, lịch học, sĩ số & học phí',
    },
    timetable: {
      title: `Thời khoá biểu ${BRAND_NAME}`,
      subtitle: 'Ma trận lịch học các lớp theo thứ, khung giờ & phòng học',
    },
    attendance: {
      title: 'Quản lý Điểm danh',
      subtitle: 'Sổ điểm danh theo buổi, theo dõi vắng/trễ & chi tiết nội dung bài học',
    },
    evaluations: {
      title: 'Đánh giá học tập',
      subtitle: 'Xếp loại thái độ, BTVN, tiến bộ & nhận xét định kỳ theo tháng',
    },
    grades: {
      title: 'Sổ điểm & Học lực',
      subtitle: 'Bảng điểm các bài kiểm tra, tính điểm trung bình có trọng số & xếp loại',
    },
    invoices: {
      title: 'Quản lý Hóa đơn & Thu chi',
      subtitle: 'Thu học phí, theo dõi công nợ, học bổng & chi phí vận hành trung tâm',
    },
    users: {
      title: 'Quản lý Người dùng & Phân quyền',
      subtitle: 'Danh sách tài khoản Admin, Giáo viên, Trợ giảng & Kế toán',
    },
    settings: {
      title: 'Cài đặt & Cấu hình Hệ thống',
      subtitle: 'Cấu hình thông tin trung tâm, năm học, học phí mặc định & tài khoản ngân hàng',
    },
    parent_portal: {
      title: 'Portal Phụ huynh & Học sinh',
      subtitle: 'Tra cứu chuyên cần, điểm số, học phí & thông báo Zalo OA dành cho phụ huynh',
    },
  };

  const currentInfo = moduleTitles[activeModule] || {
    title: BRAND_NAME,
    subtitle: BRAND_SLOGAN,
  };

  const unpaidCount = invoices.filter((i) => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn').length;

  return (
    <header className="h-20 bg-[#243C4C]/95 backdrop-blur-md border-b border-[#3b5568] sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F4FCFB] tracking-tight flex items-center gap-2">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-[#ACBCBF] mt-0.5">{currentInfo.subtitle}</p>
      </div>

      {/* Actions & Search Right */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#ACBCBF]" />
          <input
            type="text"
            placeholder="Tìm học sinh, lớp học, mã HD..."
            aria-label="Tìm kiếm toàn hệ thống"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1d313e] border border-[#3b5568] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4FCFB] placeholder-[#ACBCBF] focus:outline-none focus:border-[#5289AD] transition-all"
          />
        </div>

        {/* Quick Add Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickActionMenu(!showQuickActionMenu)}
            aria-label="Menu tạo mới nhanh"
            aria-expanded={showQuickActionMenu}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5289AD] hover:bg-[#427293] text-[#F4FCFB] text-xs font-bold shadow-md shadow-[#5289AD]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo nhanh</span>
          </button>

          {showQuickActionMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#243C4C] border border-[#3b5568] rounded-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-bold text-[#ACBCBF] px-3 py-1 uppercase tracking-wider">
                THAO TÁC NHANH
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionMenu(false);
                  onOpenQuickAddStudent?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#F4FCFB] hover:bg-[#2f4a5c] transition-colors text-left cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Thêm học sinh mới</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionMenu(false);
                  onOpenQuickAddClass?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#F4FCFB] hover:bg-[#2f4a5c] transition-colors text-left cursor-pointer"
              >
                <BookPlus className="w-4 h-4 text-[#5289AD]" />
                <span>Tạo lớp học mới</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionMenu(false);
                  onOpenQuickAddInvoice?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#F4FCFB] hover:bg-[#2f4a5c] transition-colors text-left cursor-pointer"
              >
                <ReceiptText className="w-4 h-4 text-amber-400" />
                <span>Lập hóa đơn học phí</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Danh sách thông báo hệ thống"
            aria-expanded={showNotifications}
            className="relative p-2.5 rounded-xl bg-[#1d313e] border border-[#3b5568] text-[#ACBCBF] hover:text-[#F4FCFB] hover:bg-[#2f4a5c] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unpaidCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unpaidCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#243C4C] border border-[#3b5568] rounded-2xl shadow-2xl p-4 z-40">
              <div className="flex items-center justify-between pb-3 border-b border-[#3b5568] mb-3">
                <span className="font-bold text-sm text-[#F4FCFB] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Thông báo {BRAND_NAME}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Đóng bảng thông báo"
                  className="text-[#ACBCBF] hover:text-[#F4FCFB] p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {unpaidCount > 0 && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs">
                    <p className="font-semibold text-rose-400">Hóa đơn học phí quá hạn / chưa thu</p>
                    <p className="text-[#ACBCBF] text-[11px] mt-0.5">
                      Có {unpaidCount} học sinh chưa hoàn tất học phí {currentFormattedMonth.toLowerCase()}.
                    </p>
                  </div>
                )}
                <div className="p-2.5 bg-[#5289AD]/15 border border-[#5289AD]/30 rounded-xl text-xs">
                  <p className="font-semibold text-[#5289AD]">Lớp Toán Luyện Thi (18:00 hôm nay)</p>
                  <p className="text-[#F4FCFB] text-[11px] mt-0.5">
                    Thầy Minh Phát phụ trách tại Phòng A101.
                  </p>
                </div>
                <div className="p-2.5 bg-[#1d313e] rounded-xl text-xs text-[#ACBCBF]">
                  <p className="font-medium text-[#F4FCFB]">Hệ thống đồng bộ dữ liệu</p>
                  <p className="text-[11px] text-[#ACBCBF] mt-0.5">Đã lưu trữ hệ thống {BRAND_NAME}.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            aria-label="Tài khoản cá nhân"
            aria-expanded={showUserDropdown}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d313e] border border-[#3b5568] hover:bg-[#2f4a5c] text-xs transition-all cursor-pointer"
            title="Tài khoản quản trị"
          >
            <img
              src={currentUser.avatar || BRAND_AVATAR}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-[#5289AD]"
            />
            <span className="font-bold text-[#F4FCFB] hidden md:inline">{currentUser.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-[#5289AD]/20 text-[#5289AD] text-[10px] font-bold">
              {currentUser.role}
            </span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#243C4C] border border-[#3b5568] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3">
              <div className="p-2.5 bg-[#1d313e] rounded-xl space-y-1 border border-[#3b5568]">
                <p className="font-bold text-[#F4FCFB] text-xs">{currentUser.name}</p>
                <p className="text-[11px] text-[#ACBCBF] truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400 font-semibold">
                  <Shield className="w-3 h-3" />
                  <span>Quyền hạn: Admin Quản trị toàn hệ thống</span>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-[#3b5568]">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowChangePassModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2f4a5c] text-[#ACBCBF] hover:text-[#F4FCFB] text-xs transition-colors cursor-pointer text-left"
                >
                  <KeyRound className="w-4 h-4 text-[#5289AD]" />
                  <span>Đổi mật khẩu tài khoản</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    logoutWithBackend();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs transition-colors cursor-pointer text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất hệ thống</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showChangePassModal}
          onClose={() => setShowChangePassModal(false)}
          title={`Đổi Mật Khẩu ${currentUser.name}`}
          maxWidth="sm"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {passError}
              </div>
            )}

            <div>
              <label className="block text-[#ACBCBF] text-xs font-semibold mb-1">Mật khẩu hiện tại:</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại (mặc định: 123456)"
                className="w-full p-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] text-xs focus:outline-none focus:border-[#5289AD]"
              />
            </div>

            <div>
              <label className="block text-[#ACBCBF] text-xs font-semibold mb-1">Mật khẩu mới:</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full p-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] text-xs focus:outline-none focus:border-[#5289AD]"
              />
            </div>

            <div>
              <label className="block text-[#ACBCBF] text-xs font-semibold mb-1">Xác nhận mật khẩu mới:</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full p-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] text-xs focus:outline-none focus:border-[#5289AD]"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                className="text-[#ACBCBF] hover:text-[#F4FCFB] flex items-center gap-1.5 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#3b5568]">
              <button
                type="button"
                onClick={() => setShowChangePassModal(false)}
                className="px-4 py-2 bg-[#1d313e] hover:bg-[#2f4a5c] text-[#ACBCBF] rounded-xl font-medium cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5289AD] hover:bg-[#427293] text-[#F4FCFB] font-bold rounded-xl cursor-pointer shadow-md shadow-[#5289AD]/20"
              >
                Cập Nhật Mật Khẩu
              </button>
            </div>
          </form>
        </Modal>

        {/* Google Sheets API Connection Pill */}
        <button
          type="button"
          onClick={() => setActiveModule('settings')}
          aria-label="Mở cài đặt máy chủ kết nối Google Sheets"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isApiConnected
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
          }`}
          title="Bấm để mở cài đặt Google Sheets Web App Server"
        >
          <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isApiConnected ? 'Google Sheets Active' : 'Local Demo Mode'}</span>
        </button>

        {/* Current Date Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d313e] border border-[#3b5568] text-xs text-[#ACBCBF] font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#5289AD]" />
          <span>Hôm nay: {currentFormattedMonth}</span>
        </div>
      </div>
    </header>
  );
};

