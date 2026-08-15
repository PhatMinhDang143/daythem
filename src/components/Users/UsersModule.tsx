import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { UserCog, Shield, Check, Lock, Mail, Phone, Sparkles } from 'lucide-react';

export const UsersModule: React.FC = () => {
  const { users, currentUser, setCurrentUserRole } = useApp();

  const permissionsMatrix = [
    { module: '1. Dashboard Tổng quan', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': true },
    { module: '2. Quản lý Học sinh', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': true },
    { module: '3. Quản lý Lớp học', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': true },
    { module: '4. Thời khoá biểu', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': true },
    { module: '5. Sổ Điểm danh & Buổi học', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': false },
    { module: '6. Đánh giá học tập', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': false },
    { module: '7. Sổ điểm & Học lực', Admin: true, 'Giáo viên': true, 'Trợ giảng': true, 'Kế toán': false },
    { module: '8. Hóa đơn & Thu chi tài chính', Admin: true, 'Giáo viên': false, 'Trợ giảng': false, 'Kế toán': true },
    { module: '9. Quản lý Người dùng & Phân quyền', Admin: true, 'Giáo viên': false, 'Trợ giảng': false, 'Kế toán': false },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/60 border border-slate-700/70 p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-indigo-400" />
            Quản trị hệ thống duy nhất (Chủ trung tâm)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Bạn đang đăng nhập với quyền Admin cao nhất — Quản lý toàn bộ 9 module hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-xl text-emerald-300 font-bold text-xs">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Tài khoản Admin - Toàn quyền quản lý</span>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((u) => (
          <div key={u.id} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={u.avatar}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/40"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{u.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                  {u.role}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{u.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RBAC Permission Matrix Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Bảng ma trận phân quyền chi tiết các vai trò
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Module Chức Năng</th>
                <th className="px-4 py-3 text-center">Admin</th>
                <th className="px-4 py-3 text-center">Giáo viên</th>
                <th className="px-4 py-3 text-center">Trợ giảng</th>
                <th className="px-4 py-3 text-center">Kế toán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-semibold text-white">{item.module}</td>
                  <td className="px-4 py-3 text-center">
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item['Giáo viên'] ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item['Trợ giảng'] ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item['Kế toán'] ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
