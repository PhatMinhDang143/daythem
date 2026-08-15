import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Student } from '../../../types';

interface DeleteStudentModalProps {
  student: Student | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({ student, onClose, onConfirm }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Xác Nhận Xóa Học Sinh?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Bạn có chắc chắn muốn xóa học sinh <strong className="text-white">{student.name}</strong> ({student.code}) khỏi hệ thống quản lý trung tâm? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
            >
              Xác Nhận Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
