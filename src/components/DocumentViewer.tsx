import React, { useState } from 'react';
import { ArchivedDocument, CATEGORY_LABELS } from '../types';
import {
  FileText,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Info,
  Calendar,
  Tag,
  Hash,
  UserCheck,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

interface DocumentViewerProps {
  document: ArchivedDocument | null;
  employeeName: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  employeeName,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  if (!document) {
    return (
      <div className="flex-1 bg-slate-50/80 rounded-2xl flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 text-center min-h-[460px]">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-300 mb-3">
          <FileText className="w-8 h-8 text-[#0F2C59]/40" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 mb-1">
          المستعرض الرقمي للوثائق والأضابير
        </h4>
        <p className="text-xs text-slate-400 max-w-sm">
          يرجى تحديد أو النقر على أي وثيقة أو أمر إداري من القائمة الجانبية لمعاينتها وتصفحها أو طباعتها هنا.
        </p>
      </div>
    );
  }

  const categoryInfo = CATEGORY_LABELS[document.category] || CATEGORY_LABELS.other;

  const handleDownload = () => {
    const a = window.document.createElement('a');
    a.href = document.data;
    const cleanTitle = document.title.replace(/[\\/:*?"<>|]/g, '_');
    a.download = `${cleanTitle}.pdf`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handlePrint = () => {
    // If it's HTML data URL, open and print in new frame
    if (document.data.startsWith('data:text/html')) {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(decodeURIComponent(document.data.replace('data:text/html;charset=utf-8,', '')));
        printWin.document.close();
        printWin.focus();
        setTimeout(() => {
          printWin.print();
        }, 300);
      }
    } else {
      // For PDF data URL
      const printWin = window.open(document.data, '_blank');
      if (printWin) {
        printWin.focus();
      }
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(180, Math.max(70, prev + delta)));
  };

  const content = (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4 bg-slate-900/90 backdrop-blur-sm' : ''
    }`}>
      
      {/* Top Action Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Title and Category Tag */}
        <div className="flex items-center gap-2 max-w-[60%] truncate">
          <span className="p-1.5 rounded-lg bg-[#0F2C59]/10 text-[#0F2C59]">
            <FileCheck2 className="w-4 h-4" />
          </span>
          <div className="truncate">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate" title={document.title}>
              {document.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>{categoryInfo.label}</span>
              {document.orderNumber && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-medium">العدد: {document.orderNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Viewer Tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => handleZoom(-15)}
              className="p-1.5 text-slate-500 hover:text-[#0F2C59] hover:bg-slate-100 rounded transition"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-600 select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(15)}
              className="p-1.5 text-slate-500 hover:text-[#0F2C59] hover:bg-slate-100 rounded transition"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Details / Metadata Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
              showMetadata
                ? 'bg-[#0F2C59] text-white border-[#0F2C59]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="بيانات الفهرسة والأرشفة"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">بيانات الوثيقة</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition flex items-center gap-1 font-medium shadow-2xs"
            title="طباعة الوثيقة"
          >
            <Printer className="w-3.5 h-3.5 text-[#0F2C59]" />
            <span className="hidden md:inline">طباعة</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 bg-[#0F2C59] hover:bg-[#081B38] text-white rounded-lg transition flex items-center gap-1 font-medium shadow-xs"
            title="تحميل الملف"
          >
            <Download className="w-3.5 h-3.5 text-[#DFC7A5]" />
            <span className="hidden md:inline">تحميل PDF</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition shadow-2xs"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Preview Container with optional Side Metadata Drawer */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-slate-100">
        
        {/* Document Display Canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
          <div
            className="w-full h-full transition-all duration-150 flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={document.data}
              title={document.title}
              className="w-full h-full min-h-[560px] sm:min-h-[640px] bg-white rounded-xl shadow-md border border-slate-200"
            />
          </div>
        </div>

        {/* Metadata Inspector Drawer */}
        {showMetadata && (
          <div className="w-full md:w-72 bg-white border-t md:border-t-0 md:border-r border-slate-200 p-4 space-y-3.5 text-xs text-slate-700 shadow-lg shrink-0 overflow-y-auto">
            <h4 className="font-bold text-[#0F2C59] border-b pb-2 flex items-center justify-between">
              <span>بطاقة الفهرسة الرسمية</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                #{document.docId}
              </span>
            </h4>

            <div>
              <span className="text-slate-400 block text-[10px] mb-0.5">اسم الموظف المعني</span>
              <p className="font-semibold text-slate-800">{employeeName}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] mb-0.5">عنوان المستند الأرشيفي</span>
              <p className="font-semibold text-slate-800">{document.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">العدد الرسمي</span>
                <p className="font-bold text-[#0F2C59] font-mono">{document.orderNumber || '--'}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">تاريخ الصدور</span>
                <p className="font-semibold">{document.issueDate || '--'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">تاريخ الأرشفة</span>
                <p className="font-medium text-slate-600">{document.uploadDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">حجم الملف</span>
                <p className="font-mono text-slate-600">{document.fileSize || 'غير محدد'}</p>
              </div>
            </div>

            {document.archivedBy && (
              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">أرشف بواسطة</span>
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{document.archivedBy}</span>
                </p>
              </div>
            )}

            {document.notes && (
              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] mb-0.5">ملاحظات الحفظ</span>
                <p className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 text-amber-900 text-[11px] leading-relaxed">
                  {document.notes}
                </p>
              </div>
            )}

            <div className="pt-2">
              <a
                href={document.data}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-center font-medium transition flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في نافذة متصفح مستقلة</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return content;
};
