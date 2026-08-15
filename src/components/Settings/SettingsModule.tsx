import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleSheetsBackendTab } from './GoogleSheetsBackendTab';
import { Settings, Building2, Calendar, CreditCard, MessageSquare, Save, CheckCircle, Sparkles, Shield, Database, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { BRAND_AVATAR } from '../../assets/brandAssets';

export const SettingsModule: React.FC = () => {
  const { centerSettings, updateCenterSettings, hasPermission } = useApp();

  const [formData, setFormData] = useState({ ...centerSettings });
  const [activeTab, setActiveTab] = useState<'general' | 'fees' | 'bank' | 'notifications' | 'sheets_backend'>('sheets_backend');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCenterSettings(formData);
  };

  if (!hasPermission(['Admin'])) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Quyền truy cập bị hạn chế</h3>
        <p className="text-sm mt-1">Chỉ tài khoản Administrator mới có quyền sửa đổi Cài đặt Hệ thống.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Module Title Banner */}
      <div className="bg-slate-800/60 border border-slate-700/70 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Cài đặt Hệ thống & Kết nối Google Sheets Backend Server</h3>
            <p className="text-xs text-slate-400">Thiết lập kết nối Web App Server, học phí, ngân hàng & mẫu tin Zalo</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('sheets_backend')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sheets_backend'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span>Google Sheets (API Server)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thông tin Trung tâm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fees' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Học phí & Năm học
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bank' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tài khoản Ngân hàng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mẫu tin nhắn Zalo
          </button>
        </div>
      </div>

      {/* Sheets Backend Tab */}
      {activeTab === 'sheets_backend' && <GoogleSheetsBackendTab />}

      {/* Main Settings Form */}
      {activeTab !== 'sheets_backend' && (
        <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          {/* General Info */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Logo Image Upload Section */}
            <div className="p-5 bg-slate-900/90 border border-[#5289AD]/40 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F4FCFB] font-bold text-sm">
                  <ImageIcon className="w-5 h-5 text-[#5289AD]" />
                  <span>Ảnh Logo & Wallpaper Thương Hiệu Gốc (.PNG / .JPG)</span>
                </div>
                {formData.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, customLogoUrl: undefined })}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Xóa ảnh tải lên & dùng mặc định</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <img
                    src={formData.customLogoUrl || BRAND_AVATAR}
                    alt="Logo preview"
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-[#5289AD] shadow-xl bg-slate-800"
                  />
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[#5289AD] text-[10px] font-bold text-white rounded-md shadow">
                    {formData.customLogoUrl ? 'Ảnh gốc' : 'Mặc định'}
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-xs text-slate-300 font-medium">
                    Tải file hình ảnh gốc từ máy tính của bạn (PNG, JPG, WEBP) để làm Logo đại diện và Hình nền Wallpaper toàn bộ trang web:
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5289AD] hover:bg-[#427293] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Chọn file ảnh từ máy tính...</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setFormData({ ...formData, customLogoUrl: result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    * File ảnh sẽ được nhúng trực tiếp làm tag &lt;img src="..." /&gt; chuẩn 100% không qua vẽ lại.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 text-indigo-400 font-bold text-sm">
              <Building2 className="w-4 h-4" />
              <span>THÔNG TIN THƯƠNG HIỆU & LIÊN HỆ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tên Trung Tâm Dạy Thêm *</label>
                <input
                  type="text"
                  required
                  value={formData.centerName}
                  onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Số điện thoại Hotline *</label>
                <input
                  type="text"
                  required
                  value={formData.hotline}
                  onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email chính thức</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Địa chỉ trụ sở / Cơ sở chính</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Fees & Academic Year */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 text-emerald-400 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>NĂM HỌC & CẤU HÌNH HỌC PHÍ MẶC ĐỊNH</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Năm học hiện tại *</label>
                <input
                  type="text"
                  value={formData.currentAcademicYear}
                  onChange={(e) => setFormData({ ...formData, currentAcademicYear: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="2026 - 2027"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Học kỳ *</label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Học kỳ I">Học kỳ I</option>
                  <option value="Học kỳ II">Học kỳ II</option>
                  <option value="Học kỳ Hè">Học kỳ Hè</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Học phí chuẩn theo buổi (VND)</label>
                <input
                  type="number"
                  value={formData.defaultFeePerSession}
                  onChange={(e) => setFormData({ ...formData, defaultFeePerSession: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Học phí chuẩn theo tháng (VND)</label>
                <input
                  type="number"
                  value={formData.defaultFeePerMonth}
                  onChange={(e) => setFormData({ ...formData, defaultFeePerMonth: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hạn đóng tiền học phí hàng tháng (Ngày)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.defaultDueDateDay}
                  onChange={(e) => setFormData({ ...formData, defaultDueDateDay: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Account */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 text-sky-400 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>TÀI KHOẢN NGÂN HÀNG THU HỌC PHÍ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tên Ngân hàng *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Số Tài Khoản *</label>
                <input
                  type="text"
                  value={formData.bankAccountNo}
                  onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Tên Chủ Tài Khoản *</label>
                <input
                  type="text"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-bold uppercase"
                />
              </div>
            </div>

            {/* Bank Card Preview */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-purple-900/60 border border-sky-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-300 tracking-wider">XEM TRƯỚC BẢNG CHUYỂN KHHOẢN BIÊN LAI</span>
                <div className="text-sm font-extrabold text-white mt-1">{formData.bankName}</div>
                <div className="text-lg font-mono font-bold text-amber-300 tracking-wider mt-1">{formData.bankAccountNo}</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">{formData.bankAccountName}</div>
              </div>

              <div className="p-3 bg-white text-slate-900 rounded-xl text-center space-y-1 shadow-lg">
                <div className="text-[10px] font-bold text-indigo-900">QR CHUYỂN KHỎAN VietQR</div>
                <div className="w-24 h-24 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">
                  [VietQR CODE]
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zalo Notification Templates */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3 text-amber-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>CẤU HÌNH MẪU TIN NHẮN ZALO / SMS PHỤ HUYNH</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mẫu tin Nhắc Học Phí</label>
                <textarea
                  rows={3}
                  value={formData.zaloTemplateReminder}
                  onChange={(e) => setFormData({ ...formData, zaloTemplateReminder: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Biến hỗ trợ: {"{STUDENT_NAME}"}, {"{MONTH}"}, {"{CLASS_NAME}"}, {"{AMOUNT}"}, {"{DUE_DATE}"}</p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mẫu tin Báo cáo Đánh giá Học tập Định kỳ</label>
                <textarea
                  rows={3}
                  value={formData.zaloTemplateEvaluation}
                  onChange={(e) => setFormData({ ...formData, zaloTemplateEvaluation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Biến hỗ trợ: {"{STUDENT_NAME}"}, {"{MONTH}"}, {"{RANK}"}, {"{COMMENT}"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="pt-4 border-t border-slate-700/80 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình hệ thống</span>
          </button>
        </div>
      </form>
      )}
    </div>
  );
};
