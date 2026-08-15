import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APPS_SCRIPT_CODE_TEMPLATE } from '../../services/appsScriptApi';
import {
  Database,
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  FileSpreadsheet,
  Table,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

export const GoogleSheetsBackendTab: React.FC = () => {
  const {
    appsScriptUrl,
    setAppsScriptUrl,
    isApiConnected,
    isSyncing,
    lastSyncedAt,
    syncFromSheets,
    syncAllToSheets,
    testConnection,
    initializeSheetsDatabase,
    students,
    classes,
    invoices,
    expenses,
    sessions,
    evaluations,
    testScores,
    users,
  } = useApp();

  const [inputUrl, setInputUrl] = useState(appsScriptUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppsScriptUrl(inputUrl.trim());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isApiConnected
            ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
            : 'bg-amber-950/30 border-amber-500/30 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-xl ${
                isApiConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Tầng Backend API Google Sheets Web App
                </h3>
                {isApiConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    🟢 Đã kết nối Web App Server
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    🟡 Chế độ Offline / Lưu tạm
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                {isApiConnected
                  ? `Hệ thống đang lưu trữ & đồng bộ cơ sở dữ liệu thật trên Google Sheets qua Apps Script Web App Server. Lần đồng bộ gần nhất: ${
                      lastSyncedAt || 'Vừa xong'
                    }`
                  : 'Chưa cấu hình URL Web App. Ứng dụng đang hoạt động ở chế độ lưu tạm local. Vui lòng triển khai Google Apps Script và dán URL vào bên dưới để biến ứng dụng thành cơ sở dữ liệu thật.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {isApiConnected && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => syncFromSheets()}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <DownloadCloud className={`w-4 h-4 text-sky-400 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>Nạp lại từ Sheet</span>
              </button>

              <button
                onClick={() => syncAllToSheets()}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Đẩy dữ liệu lên Sheet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* URL Config Form */}
      <form onSubmit={handleSaveUrl} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            <span>Google Apps Script Web App URL (Endpoint API)</span>
          </label>
          {appsScriptUrl && (
            <button
              type="button"
              onClick={() => testConnection()}
              disabled={isSyncing}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Kiểm tra kết nối</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={isSyncing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Server className="w-4 h-4" />
            <span>Lưu & Kết nối</span>
          </button>
        </div>

        {appsScriptUrl && (
          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-700/50">
            <span>
              URL đang cấu hình:{' '}
              <code className="text-indigo-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
                {appsScriptUrl.substring(0, 45)}...
              </code>
            </span>
            <button
              type="button"
              onClick={() => {
                setInputUrl('');
                setAppsScriptUrl('');
              }}
              className="text-rose-400 hover:underline cursor-pointer"
            >
              Hủy kết nối / Xóa URL
            </button>
          </div>
        )}
      </form>

      {/* Relational Database Sheets Structure */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Cơ sở dữ liệu quan hệ Google Sheets (9 Sheets tương ứng 9 Entities)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Mỗi entity được thiết kế riêng một sheet, sử dụng cột đầu làm khóa chính ID duy nhất
            </p>
          </div>

          <button
            onClick={() => initializeSheetsDatabase()}
            disabled={isSyncing || !appsScriptUrl}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khởi tạo cấu trúc CSDL mẫu lên Sheet</span>
          </button>
        </div>

        {/* Entity stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Students</div>
              <div className="text-[11px] text-slate-400">Khóa ngoại: enrolledClasses</div>
            </div>
            <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
              {students.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Classes</div>
              <div className="text-[11px] text-slate-400">Khóa ngoại: teacherId, assistantId</div>
            </div>
            <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-1 rounded">
              {classes.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Invoices</div>
              <div className="text-[11px] text-slate-400">Khóa ngoại: studentId, classId</div>
            </div>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              {invoices.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Sessions</div>
              <div className="text-[11px] text-slate-400">Sổ điểm danh các buổi</div>
            </div>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
              {sessions.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: TestScores</div>
              <div className="text-[11px] text-slate-400">Sổ điểm các bài test</div>
            </div>
            <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
              {testScores.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: StudentEvaluations</div>
              <div className="text-[11px] text-slate-400">Đánh giá hàng tháng</div>
            </div>
            <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
              {evaluations.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Expenses</div>
              <div className="text-[11px] text-slate-400">Phiếu chi vận hành</div>
            </div>
            <span className="font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
              {expenses.length} bản ghi
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Sheet: Users</div>
              <div className="text-[11px] text-slate-400">Tài khoản & Phân quyền</div>
            </div>
            <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
              {users.length} bản ghi
            </span>
          </div>
        </div>
      </div>

      {/* Deployment Step-by-Step Guide & Code.gs Generator */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Hướng dẫn 5 bước cài đặt Google Apps Script Backend Server</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Tạo ứng dụng Web App chạy dưới quyền quản trị trung tâm để quản lý Google Sheets
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Đã sao chép mã nguồn!' : 'Sao chép mã Code.gs'}</span>
          </button>
        </div>

        {/* 5 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-bold text-white pt-1">Mở Google Sheet</div>
            <p className="text-[11px] text-slate-400">
              Tạo file Google Sheet mới -&gt; Chọn <strong className="text-slate-200">Tiện ích mở rộng</strong> -&gt;{' '}
              <strong className="text-slate-200">Apps Script</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-bold text-white pt-1">Dán Code.gs</div>
            <p className="text-[11px] text-slate-400">
              Xóa code mặc định, nhấp nút <strong className="text-emerald-400">Sao chép mã Code.gs</strong> ở trên và dán vào. Lại bấm Lưu (Ctrl+S).
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-bold text-white pt-1">Triển khai Web App</div>
            <p className="text-[11px] text-slate-400">
              Nhấp nút <strong className="text-slate-200">Triển khai (Deploy)</strong> góc phải trên -&gt;{' '}
              <strong className="text-slate-200">Triển khai dưới dạng ứng dụng web</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </div>
            <div className="font-bold text-white pt-1">Phân quyền Web App</div>
            <p className="text-[11px] text-slate-400">
              Thực thi dưới quyền: <strong className="text-amber-300">Tôi (Me)</strong>. Ai có quyền truy cập:{' '}
              <strong className="text-emerald-300">Bất kỳ ai (Anyone)</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              5
            </div>
            <div className="font-bold text-white pt-1">Dán Web App URL</div>
            <p className="text-[11px] text-slate-400">
              Copy đường dẫn Web App URL nhận được, dán vào ô cấu hình ở trên rồi bấm <strong className="text-indigo-300">Lưu & Kết nối</strong>!
            </p>
          </div>
        </div>

        {/* Expandable Code Preview */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowCodeDetails(!showCodeDetails)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showCodeDetails ? 'Ẩn mã nguồn Apps Script (Code.gs)' : 'Xem trước toàn bộ mã nguồn Apps Script (Code.gs)'}</span>
          </button>

          {showCodeDetails && (
            <div className="mt-3 relative">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {APPS_SCRIPT_CODE_TEMPLATE}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
