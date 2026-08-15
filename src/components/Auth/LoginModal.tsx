import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, ShieldCheck, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BRAND_NAME, BRAND_AVATAR } from '../../assets/brandAssets';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, loginWithBackend, logoutWithBackend, isSyncing } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Vui lòng nhập Email tài khoản');
      return;
    }

    const success = await loginWithBackend(email, password);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Đăng nhập không thành công. Vui lòng kiểm tra lại Email hoặc mật khẩu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#243C4C] border border-[#3b5568] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-[#3b5568] flex items-center justify-between bg-[#1d313e]">
          <div className="flex items-center gap-2 text-[#5289AD] font-bold text-sm">
            <Lock className="w-4 h-4" />
            Xác Thực & Đăng Nhập Hệ Thống {BRAND_NAME}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#2f4a5c] text-[#ACBCBF] hover:text-[#F4FCFB] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Current Logged In Profile Badge */}
          <div className="p-3.5 bg-[#1d313e] border border-[#3b5568] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || BRAND_AVATAR}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#5289AD]"
              />
              <div>
                <p className="font-bold text-[#F4FCFB] text-sm">{currentUser.name}</p>
                <div className="flex items-center gap-2 text-[#ACBCBF] text-[11px] mt-0.5">
                  <span className="font-medium text-[#5289AD]">{currentUser.email}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#5289AD]/20 text-[#5289AD] text-[10px] font-bold">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logoutWithBackend}
              className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Đăng xuất khỏi phiên hiện tại"
            >
              <LogOut className="w-3.5 h-3.5" />
              Thoát
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[#ACBCBF] font-semibold mb-1">
                Email Tài Khoản:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#ACBCBF]" />
                <input
                  type="email"
                  required
                  placeholder="admin@minhphatedu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] focus:outline-none focus:border-[#5289AD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#ACBCBF] font-semibold mb-1">
                Mật Khẩu Phân Quyền:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#ACBCBF]" />
                <input
                  type="password"
                  placeholder="Mật khẩu (ví dụ: 123456)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] focus:outline-none focus:border-[#5289AD]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="w-full py-2.5 bg-[#5289AD] hover:bg-[#427293] text-[#F4FCFB] font-bold rounded-xl shadow-lg shadow-[#5289AD]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Đăng Nhập Qua Google Sheets Server</span>
            </button>
          </form>

          {/* Quick Select Admin Credentials */}
          <div className="pt-3 border-t border-[#3b5568] space-y-2">
            <p className="text-[#ACBCBF] font-semibold text-[11px]">
              Tài khoản Quản trị viên (Chủ trung tâm):
            </p>
            <div className="p-3 bg-[#1d313e] border border-[#5289AD]/30 rounded-xl space-y-1">
              <p className="font-bold text-[#F4FCFB] text-xs">Thầy Minh Phát (Admin)</p>
              <p className="text-[#5289AD] font-mono text-[11px]">Email: admin@minhphatedu.vn</p>
              <p className="text-[#698696] text-[10px]">Quyền hạn: Admin toàn quyền quản lý hệ thống</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
