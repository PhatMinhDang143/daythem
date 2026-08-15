import React from 'react';
import { useApp, ModuleType } from '../context/AppContext';
import { UserRole } from '../types';
import { BRAND_NAME, BRAND_SLOGAN, BRAND_AVATAR } from '../assets/brandAssets';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  Award,
  FileSpreadsheet,
  Receipt,
  UserCog,
  ChevronRight,
  ShieldAlert,
  Settings,
  Smartphone,
} from 'lucide-react';

interface NavItem {
  id: ModuleType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles: UserRole[];
}

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, currentUser, students, invoices, centerSettings } = useApp();

  const unpaidInvoicesCount = invoices.filter((i) => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng', 'Kế toán'],
    },
    {
      id: 'students',
      label: 'Học sinh',
      icon: Users,
      badge: students.length.toString(),
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng', 'Kế toán'],
    },
    {
      id: 'classes',
      label: 'Lớp học',
      icon: GraduationCap,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng', 'Kế toán'],
    },
    {
      id: 'timetable',
      label: 'Thời khoá biểu',
      icon: CalendarDays,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng', 'Kế toán'],
    },
    {
      id: 'attendance',
      label: 'Điểm danh',
      icon: ClipboardCheck,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng'],
    },
    {
      id: 'evaluations',
      label: 'Đánh giá',
      icon: Award,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng'],
    },
    {
      id: 'grades',
      label: 'Điểm số',
      icon: FileSpreadsheet,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng'],
    },
    {
      id: 'invoices',
      label: 'Hoá đơn & Thu chi',
      icon: Receipt,
      badge: unpaidInvoicesCount > 0 ? `${unpaidInvoicesCount}` : undefined,
      allowedRoles: ['Admin', 'Kế toán'],
    },
    {
      id: 'users',
      label: 'Người dùng',
      icon: UserCog,
      allowedRoles: ['Admin'],
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings,
      allowedRoles: ['Admin'],
    },
    {
      id: 'parent_portal',
      label: 'Portal Phụ huynh',
      icon: Smartphone,
      allowedRoles: ['Admin', 'Giáo viên', 'Trợ giảng', 'Kế toán'],
    },
  ];

  return (
    <aside className="w-64 bg-[#243C4C] border-r border-[#3b5568] flex flex-col justify-between shrink-0 h-screen sticky top-0 text-[#ACBCBF] select-none">
      {/* Top Header Logo */}
      <div>
        <div className="h-20 flex items-center px-4 border-b border-[#3b5568] gap-3 bg-[#1d313e]">
          <img
            src={centerSettings.customLogoUrl || BRAND_AVATAR}
            alt={BRAND_NAME}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#5289AD] shadow-md shadow-[#5289AD]/20 shrink-0"
          />
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-[#F4FCFB] text-base tracking-wide leading-tight">
              {BRAND_NAME}
            </h1>
            <p className="text-[10px] text-[#5289AD] font-bold truncate leading-tight mt-0.5">
              {BRAND_SLOGAN}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#698696] tracking-wider uppercase">
            DANH MỤC QUẢN LÝ
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const isPermitted = (item.allowedRoles || []).includes(currentUser?.role) || currentUser?.role === 'Admin';

            if (!isPermitted) {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[#698696] text-xs cursor-not-allowed group opacity-50"
                  title="Tài khoản hiện tại không có quyền truy cập module này"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#698696]" />
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5289AD] text-[#F4FCFB] shadow-lg shadow-[#5289AD]/30 font-bold'
                    : 'text-[#ACBCBF] hover:text-[#F4FCFB] hover:bg-[#2f4a5c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4FCFB]' : 'text-[#ACBCBF]'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#1d313e] text-[#F4FCFB]'
                          : 'bg-[#1d313e] text-[#5289AD] border border-[#3b5568]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-[#F4FCFB]/70" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-[#3b5568] bg-[#1d313e]">
        <div className="bg-[#243C4C] rounded-xl p-3 border border-[#3b5568]">
          <div className="text-[11px] font-medium text-[#ACBCBF] mb-1.5 flex items-center justify-between">
            <span>TÀI KHOẢN HỆ THỐNG</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar || BRAND_AVATAR}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#5289AD]"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#F4FCFB] truncate">{currentUser.name}</div>
              <div className="text-[10px] text-[#5289AD] font-semibold">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
