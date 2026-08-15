import React from 'react';
import { Search, Plus, Layers, FileSpreadsheet, DollarSign, TrendingDown, Mail } from 'lucide-react';
import { useInvoiceModule } from './hooks/useInvoiceModule';
import { useApp } from '../../context/AppContext';
import { InvoiceStatsHeader } from './components/InvoiceStatsHeader';
import { InvoiceTable } from './components/InvoiceTable';
import { ExpenseTable } from './components/ExpenseTable';
import { SingleInvoiceModal } from './components/SingleInvoiceModal';
import { BatchInvoiceModal } from './components/BatchInvoiceModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { ExpenseModal } from './components/ExpenseModal';
import { ReceiptModal } from './components/ReceiptModal';

interface InvoicesModuleProps {
  isAddInvoiceModalOpenFromHeader?: boolean;
  onCloseHeaderModal?: () => void;
}

export const InvoicesModule: React.FC<InvoicesModuleProps> = ({
  isAddInvoiceModalOpenFromHeader,
  onCloseHeaderModal,
}) => {
  const { sendParentEmailReminders } = useApp();
  const {
    invoices,
    expenses,
    students,
    classes,
    centerSettings,
    hasPermission,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredInvoices,
    filteredExpenses,
    // Modals state
    isAddInvoiceModalOpen,
    setIsAddInvoiceModalOpen,
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
    isClassBatchModalOpen,
    setIsClassBatchModalOpen,
    isExcelImportModalOpen,
    setIsExcelImportModalOpen,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    // Forms & Errors
    invoiceFormData,
    setInvoiceFormData,
    invoiceErrors,
    expenseFormData,
    setExpenseFormData,
    expenseErrors,
    // Batch
    batchClassId,
    setBatchClassId,
    batchMonth,
    setBatchMonth,
    batchDueDate,
    setBatchDueDate,
    batchDefaultDiscount,
    setBatchDefaultDiscount,
    batchDefaultDiscountReason,
    setBatchDefaultDiscountReason,
    batchStudentExclusions,
    setBatchStudentExclusions,
    batchStudentDiscounts,
    setBatchStudentDiscounts,
    selectedBatchClass,
    enrolledStudentsInBatchClass,
    // CSV
    csvRawText,
    setCsvRawText,
    // Handlers
    handleCreateInvoiceSubmit,
    handleCreateClassBatchInvoices,
    handleDownloadExcelTemplate,
    handleProcessExcelImport,
    handleCreateExpenseSubmit,
    handleSendReminder,
    updateInvoiceStatus,
  } = useInvoiceModule(isAddInvoiceModalOpenFromHeader, onCloseHeaderModal);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Stats Overview */}
      <InvoiceStatsHeader invoices={invoices} expenses={expenses} />

      {/* Control Toolbar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'invoices' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Hóa Đơn Học Phí ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'expenses' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Phiếu Chi Chi Phí ({expenses.length})
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'invoices' ? 'Tìm mã HĐ, học sinh, lớp...' : 'Tìm tên phiếu chi, đơn vị...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {activeTab === 'invoices' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          )}

          {hasPermission && (
            <div className="flex items-center gap-2">
              {activeTab === 'invoices' ? (
                <>
                  <button
                    type="button"
                    onClick={() => sendParentEmailReminders()}
                    className="px-3 py-2 bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer"
                    title="Gửi Email tự động tới Phụ huynh qua GmailApp/MailApp cho các hóa đơn chưa thanh toán"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-200" />
                    Gửi Email Nhắc Nợ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsClassBatchModalOpen(true)}
                    className="px-3 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Sinh Theo Lớp
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExcelImportModalOpen(true)}
                    className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Nhập Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddInvoiceModalOpen(true)}
                    className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tạo Hóa Đơn
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="px-3 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Lập Phiếu Chi
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      {activeTab === 'invoices' ? (
        <InvoiceTable
          invoices={filteredInvoices}
          onSelectForPrint={setSelectedInvoiceForPrint}
          onSendReminder={handleSendReminder}
          onUpdateStatus={updateInvoiceStatus}
          hasPermission={hasPermission}
        />
      ) : (
        <ExpenseTable expenses={filteredExpenses} />
      )}

      {/* Modals */}
      <SingleInvoiceModal
        isOpen={isAddInvoiceModalOpen}
        onClose={() => {
          setIsAddInvoiceModalOpen(false);
          onCloseHeaderModal?.();
        }}
        onSubmit={handleCreateInvoiceSubmit}
        students={students}
        classes={classes}
        formData={invoiceFormData}
        setFormData={setInvoiceFormData}
        errors={invoiceErrors}
      />

      <BatchInvoiceModal
        isOpen={isClassBatchModalOpen}
        onClose={() => setIsClassBatchModalOpen(false)}
        onSubmit={handleCreateClassBatchInvoices}
        classes={classes}
        selectedBatchClass={selectedBatchClass}
        batchClassId={batchClassId}
        setBatchClassId={setBatchClassId}
        batchMonth={batchMonth}
        setBatchMonth={setBatchMonth}
        batchDueDate={batchDueDate}
        setBatchDueDate={setBatchDueDate}
        batchDefaultDiscount={batchDefaultDiscount}
        setBatchDefaultDiscount={setBatchDefaultDiscount}
        batchDefaultDiscountReason={batchDefaultDiscountReason}
        setBatchDefaultDiscountReason={setBatchDefaultDiscountReason}
        enrolledStudentsInBatchClass={enrolledStudentsInBatchClass}
        batchStudentExclusions={batchStudentExclusions}
        setBatchStudentExclusions={setBatchStudentExclusions}
        batchStudentDiscounts={batchStudentDiscounts}
        setBatchStudentDiscounts={setBatchStudentDiscounts}
        onDownloadTemplate={handleDownloadExcelTemplate}
        defaultFeePerMonth={centerSettings.defaultFeePerMonth}
      />

      <ExcelImportModal
        isOpen={isExcelImportModalOpen}
        onClose={() => setIsExcelImportModalOpen(false)}
        onSubmit={handleProcessExcelImport}
        csvRawText={csvRawText}
        setCsvRawText={setCsvRawText}
      />

      <ExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onSubmit={handleCreateExpenseSubmit}
        formData={expenseFormData}
        setFormData={setExpenseFormData}
        errors={expenseErrors}
      />

      <ReceiptModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        centerSettings={centerSettings}
      />
    </div>
  );
};
