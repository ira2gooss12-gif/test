import React, { useState } from 'react';
import { exportDatabaseBackup, importDatabaseBackup, resetToDefault } from '../services/db';
import { Employee } from '../types';
import { Database, Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: (newEmployees: Employee[]) => void;
  employees: Employee[];
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  employees,
}) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const totalDocs = employees.reduce((acc, emp) => acc + (emp.docs?.length || 0), 0);

  const handleExport = async () => {
    setIsExporting(true);
    setStatusMsg(null);
    try {
      const jsonStr = await exportDatabaseBackup();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `babil_agri_archive_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: 'تم تصدير النسخة الاحتياطية بنجاح وحفظها على جهازك.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'فشل تصدير النسخة الاحتياطية: ' + err.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const restored = await importDatabaseBackup(text);
        onDataChanged(restored);
        setStatusMsg({
          type: 'success',
          text: `تم استعادة النسخة الاحتياطية بنجاح (${restored.length} موظف).`,
        });
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: 'الملف غير صالح أو تالف: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط قاعدة البيانات إلى البيانات النموذجية الأولية؟')) {
      try {
        const defaultData = await resetToDefault();
        onDataChanged(defaultData);
        setStatusMsg({ type: 'success', text: 'تمت استعادة البيانات الرسمية الأولية للمديرية.' });
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: 'فشل إعادة التعيين: ' + err.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0F2C59] text-white p-4 sm:p-5 flex justify-between items-center border-b-2 border-[#C5A880]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#C5A880]/40 text-[#DFC7A5]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">إدارة قاعدة البيانات والنسخ الاحتياطي</h3>
              <p className="text-xs text-slate-300">نظام أرشفة مديرية زراعة بابل</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700">
          
          {statusMsg && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-r-4 border-emerald-500'
                  : 'bg-rose-50 text-rose-800 border-r-4 border-rose-500'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Current Stats */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-slate-400 text-[10px]">إجمالي سجلات الموظفين</p>
              <p className="text-base font-bold text-[#0F2C59]">{employees.length} موظف</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">إجمالي الوثائق والأضابير</p>
              <p className="text-base font-bold text-[#0F2C59]">{totalDocs} وثيقة</p>
            </div>
          </div>

          {/* Action 1: Export */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-center justify-between gap-3 hover:border-[#0F2C59]/40 transition">
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">تصدير نسخة احتياطية كاملة</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تنزيل ملف JSON يحتوي على كافة الموظفين والوثائق والملفات المرفوعة.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-[#0F2C59] hover:bg-[#081B38] text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition shadow-xs text-xs"
            >
              <Download className="w-4 h-4 text-[#DFC7A5]" />
              <span>تصدير</span>
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-center justify-between gap-3 hover:border-[#0F2C59]/40 transition">
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">استعادة نسخة احتياطية سابقة</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                رفع واسترجاع ملف نسخة احتياطية محفوظة على جهازك.
              </p>
            </div>
            <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition cursor-pointer border border-slate-300 text-xs">
              <Upload className="w-4 h-4 text-[#0F2C59]" />
              <span>استعادة</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {/* Action 3: Reset */}
          <div className="border border-rose-100 bg-rose-50/40 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-rose-800 text-xs sm:text-sm">إعادة تعيين البيانات الأولية</h4>
              <p className="text-[11px] text-rose-600 mt-0.5">
                استرجاع السجلات والأضابير النموذجية المعتمدة للمديرية.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition text-xs shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط</span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              إغلاق النافذة
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
