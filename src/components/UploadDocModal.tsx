import React, { useState } from 'react';
import { ArchivedDocument, DocumentCategory, CATEGORY_LABELS, Employee } from '../types';
import { generateOfficialDocumentDataUrl } from '../services/sampleData';
import { FileUp, FileText, CheckCircle2, AlertCircle, X, Sparkles, Upload } from 'lucide-react';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onUploadSuccess: (newDoc: ArchivedDocument) => void;
  archivistName: string;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUploadSuccess,
  archivistName,
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('orders');
  const [orderNumber, setOrderNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Template generation state
  const [templateBody, setTemplateBody] = useState(
    'بناءً على الصلاحيات المخولة لنا ومقتضيات المصلحة العامة، تقرر ما يلي:\n1. المصادقة والعمل بموجب التعليمات الرسمية.\n2. إشعار الجهات المعنية للتنفيذ من تاريخ الصدور.'
  );

  if (!isOpen || !employee) return null;

  const handleFileChange = (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف بصيغة PDF أو صورة رسمية.');
      return;
    }

    // Limit check (e.g. 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى الموصى به هو 15 ميغابايت.');
      return;
    }

    setError('');
    setSelectedFile(file);

    // If title is empty, prefill with file name without extension
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان الإضبارة أو المستند.');
      return;
    }

    setIsProcessing(true);

    try {
      let finalDataUri = fileBase64;
      let finalFileSize = '150 KB';
      let finalFileType: 'pdf' | 'text' = 'pdf';

      if (mode === 'generate' || !finalDataUri) {
        finalDataUri = generateOfficialDocumentDataUrl(
          title.trim(),
          orderNumber.trim() || `بابل/${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`,
          issueDate,
          employee.name,
          employee.dept,
          templateBody.replace(/\n/g, '<br>')
        );
        finalFileSize = '280 KB';
        finalFileType = 'text';
      } else if (selectedFile) {
        const kb = Math.round(selectedFile.size / 1024);
        finalFileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
        finalFileType = selectedFile.type === 'application/pdf' ? 'pdf' : 'pdf';
      }

      const newDoc: ArchivedDocument = {
        docId: Date.now(),
        title: title.trim(),
        category,
        orderNumber: orderNumber.trim() || `و.ز/${Math.floor(100 + Math.random() * 900)}`,
        issueDate,
        uploadDate: new Date().toLocaleDateString('ar-IQ'),
        archivedBy: archivistName,
        fileSize: finalFileSize,
        fileType: finalFileType,
        data: finalDataUri,
        notes: notes.trim(),
      };

      onUploadSuccess(newDoc);
      onClose();
    } catch (err: any) {
      setError('حدث خطأ أثناء أرشفة الملف: ' + (err.message || 'خطأ غير متوقع'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#0F2C59] text-white p-4 sm:p-5 flex justify-between items-center border-b-2 border-[#C5A880]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#C5A880]/40 text-[#DFC7A5]">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                أرشفة إضبارة جديدة للموظف
              </h3>
              <p className="text-xs text-slate-300">
                الموظف: <span className="text-[#DFC7A5] font-semibold">{employee.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Upload File or Generate Document */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'upload'
                ? 'bg-[#0F2C59] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف PDF من الحاسوب</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'generate'
                ? 'bg-[#0F2C59] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFC7A5]" />
            <span>إنشاء كتاب رسمي فوري</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان المستند / اسم الإضبارة *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الأمر الوزاري بالتثبيت / كتاب شكر وتقدير / ترفيع"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تصنيف الوثيقة *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Order/Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الأمر / الكتاب الإداري
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="مثال: و.ز/481/2026"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none text-left"
                dir="ltr"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ صدور الوثيقة
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none"
              />
            </div>

            {/* Archiver */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المسؤول عن الأرشفة
              </label>
              <input
                type="text"
                disabled
                value={archivistName}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 bg-slate-100 text-slate-600 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          {/* Upload Mode UI */}
          {mode === 'upload' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملف الإضبارة (PDF أو صورة مصورة) *
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
                  isDragging
                    ? 'border-[#0F2C59] bg-blue-50/50'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
                onClick={() => document.getElementById('modalDocFileInput')?.click()}
              >
                <input
                  id="modalDocFileInput"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    <p className="font-bold text-xs">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      الحجم: {(selectedFile.size / 1024).toFixed(1)} كيلوبايت - جاهز للأرشفة
                    </p>
                    <span className="text-[10px] text-[#0F2C59] underline mt-1">انقر لاختيار ملف آخر</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-500">
                    <FileText className="w-8 h-8 text-[#0F2C59]/60" />
                    <p className="text-xs font-semibold text-slate-700">
                      اسحب وأفلت ملف الـ PDF هنا أو اضغط للاستعراض
                    </p>
                    <p className="text-[10px] text-slate-400">
                      صيغ مقبولة: PDF، JPG، PNG (يتم تخزينها بشكل آمن ومحلي في قاعدة بيانات الأرشيف)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Template Generation Mode */
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص القرار أو الأمر الإداري (نموذج رسمي مصدق)
              </label>
              <textarea
                rows={4}
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                placeholder="أدخل تفاصيل الأمر أو الترفيع أو كتاب الشكر..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                سيقوم النظام بإنشاء كتاب رسمي معتمد يحمل الترويسة الرسمية لجمهورية العراق وختم مديرية زراعة بابل.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات الحفظ والأرشفة (اختياري)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: أصلي محفوظ في الخزينة / مصادق من ديوان الوزارة"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isProcessing || (mode === 'upload' && !selectedFile)}
              className="px-5 py-2 bg-[#0F2C59] hover:bg-[#081B38] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow"
            >
              <FileUp className="w-4 h-4 text-[#DFC7A5]" />
              <span>{isProcessing ? 'جاري الحفظ...' : 'تثبيت وحفظ الإضبارة'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
