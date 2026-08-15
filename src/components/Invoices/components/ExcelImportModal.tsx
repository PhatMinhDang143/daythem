import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  csvRawText: string;
  setCsvRawText: (text: string) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  csvRawText,
  setCsvRawText,
}) => {
  const { importInvoicesFromGoogleSheet, isSyncing, appsScriptUrl } = useApp();
  const [isSheetImporting, setIsSheetImporting] = useState(false);

  if (!isOpen) return null;

  const handleDirectSheetImport = async () => {
    setIsSheetImporting(true);
    const success = await importInvoicesFromGoogleSheet();
    setIsSheetImporting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4" />
            Nhập Danh Sách Hóa Đơn Trực Tiếp Từ Google Sheet
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Recommended Option: Direct Google Sheet Sync */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Khuyên dùng: Điền vào Sheet "Import_Invoices" trên Google Sheets
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                Tự động & Chuẩn xác
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Kế toán chỉ cần truy cập Google Sheet, mở tab <strong className="text-emerald-300">Import_Invoices</strong>, điền các cột (MaHocSinh, MaLop, Thang, HocPhiGoc, MienGiam, HanThanhToan) rồi bấm nút bên dưới để tự động tạo hóa đơn hàng loạt.
            </p>

            <button
              type="button"
              onClick={handleDirectSheetImport}
              disabled={isSyncing || isSheetImporting || !appsScriptUrl}
              className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing || isSheetImporting ? 'animate-spin' : ''}`} />
              <span>Đọc & Tạo Hóa Đơn Hàng Loạt Từ Google Sheet</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Hoặc dán tay dữ liệu CSV
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Dán (Paste) Nội Dung Dữ Liệu CSV/Excel Vào Đây:
              </label>
              <textarea
                rows={4}
                placeholder={`HS-2026-001,Nguyễn Văn A,ENG-10A1,2026-08,1200000,0,,2026-08-10\nHS-2026-002,Trần Thị B,MATH-11B2,2026-08,1500000,200000,Học bổng,2026-08-10`}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                Nhập Bằng CSV Dán Tay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
