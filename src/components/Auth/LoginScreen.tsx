import React, { useState } from 'react';
import {
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BRAND_NAME, BRAND_SLOGAN, BRAND_AVATAR } from '../../assets/brandAssets';

export const LoginScreen: React.FC = () => {
  const { loginWithBackend, resetUserPassword, isSyncing, centerSettings } = useApp();
  const [email, setEmail] = useState('admin@minhphatedu.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email đăng nhập');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu');
      return;
    }

    const success = await loginWithBackend(email, password);
    if (!success) {
      setErrorMsg('Mật khẩu hoặc email không chính xác. Mật khẩu mặc định là 123456.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@minhphatedu.vn');
    setPassword('123456');
    setErrorMsg('');
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const success = await resetUserPassword(resetEmail);
    if (success) {
      setResetSuccess(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#172733] text-[#F4FCFB] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Brand Image Wallpaper */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-35 overflow-hidden">
        <img
          src={centerSettings.customLogoUrl || BRAND_AVATAR}
          alt={BRAND_NAME}
          className="w-[900px] h-[900px] object-contain scale-110 drop-shadow-2xl"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#172733]/40 via-[#172733]/65 to-[#172733]/90 z-0 pointer-events-none"></div>

      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#009fe3]/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#5289AD]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#243C4C]/92 backdrop-blur-md border border-[#3b5568] rounded-3xl p-8 shadow-2xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <img
              src={centerSettings.customLogoUrl || BRAND_AVATAR}
              alt={BRAND_NAME}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#5289AD] shadow-xl shadow-[#5289AD]/20"
            />
          </div>
          <h1 className="text-2xl font-black text-[#F4FCFB] tracking-tight">{BRAND_NAME}</h1>
          <p className="text-xs text-[#5289AD] font-bold">{BRAND_SLOGAN}</p>
        </div>

        {/* Security Badge */}
        <div className="p-3 bg-[#1d313e] border border-[#5289AD]/30 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#5289AD] flex-shrink-0" />
          <div className="text-[11px] text-[#ACBCBF]">
            <p className="font-bold text-[#F4FCFB]">Xác thực hệ thống an toàn</p>
            <p className="text-[#698696]">Kiểm tra mật khẩu & Cấp Session Token 24h</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#ACBCBF] mb-1.5">
              Email Tài Khoản Admin:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ACBCBF]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@minhphatedu.vn"
                className="w-full pl-10 pr-3 py-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-xs text-[#F4FCFB] focus:outline-none focus:border-[#5289AD] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#ACBCBF]">
                Mật Khẩu Quản Trị:
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotModalOpen(true);
                  setResetSuccess(false);
                }}
                className="text-[11px] text-[#5289AD] hover:underline cursor-pointer font-bold"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ACBCBF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-xs text-[#F4FCFB] focus:outline-none focus:border-[#5289AD] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ACBCBF] hover:text-[#F4FCFB] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3 bg-[#5289AD] hover:bg-[#427293] text-[#F4FCFB] font-bold text-xs rounded-xl shadow-lg shadow-[#5289AD]/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra xác thực...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng Nhập Vào Hệ Thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Demo Credential */}
        <div className="pt-4 border-t border-[#3b5568] space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#ACBCBF] font-medium">Tài khoản Admin mặc định:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tự điền nhanh
            </button>
          </div>
          <div className="p-3 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[11px] font-mono text-[#ACBCBF] space-y-1">
            <p><span className="text-[#698696]">Email:</span> admin@minhphatedu.vn</p>
            <p><span className="text-[#698696]">Mật khẩu:</span> 123456</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#243C4C] border border-[#3b5568] rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F4FCFB] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#5289AD]" />
                Khôi Phục Mật Khẩu Tài Khoản
              </h3>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#ACBCBF] hover:text-[#F4FCFB] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Yêu cầu khôi phục thành công!
                </div>
                <p className="text-[11px] text-[#ACBCBF] leading-relaxed">
                  Mã OTP xác thực và hướng dẫn đã gửi tới <strong className="text-[#F4FCFB]">{resetEmail}</strong>. Vui lòng kiểm tra hộp thư!
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
                <p className="text-[#ACBCBF] leading-relaxed">
                  Nhập email đăng ký của bạn. Hệ thống sẽ gửi hướng dẫn khôi phục mật khẩu.
                </p>
                <div>
                  <label className="block text-[#ACBCBF] mb-1">Email khôi phục:</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@minhphatedu.vn"
                    className="w-full p-2.5 bg-[#1d313e] border border-[#3b5568] rounded-xl text-[#F4FCFB] focus:outline-none focus:border-[#5289AD]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-2 bg-[#1d313e] hover:bg-[#2f4a5c] text-[#ACBCBF] rounded-xl font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5289AD] hover:bg-[#427293] text-[#F4FCFB] font-bold rounded-xl cursor-pointer shadow-md shadow-[#5289AD]/20"
                  >
                    Gửi Mã Khôi Phục
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
