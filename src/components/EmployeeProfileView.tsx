import React, { useState, useMemo } from 'react';
import { Employee, ArchivedDocument, DocumentCategory, CATEGORY_LABELS } from '../types';
import { DocumentViewer } from './DocumentViewer';
import {
  ArrowRight,
  FilePlus,
  Printer,
  Edit,
  Briefcase,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  FileUp,
  Award,
  Layers,
} from 'lucide-react';

interface EmployeeProfileViewProps {
  employee: Employee;
  onBack: () => void;
  onOpenUploadModal: () => void;
  onOpenEditModal: () => void;
  onPrintDossier: () => void;
  onDeleteDoc: (docId: number | string) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  onBack,
  onOpenUploadModal,
  onOpenEditModal,
  onPrintDossier,
  onDeleteDoc,
}) => {
  const [activeDocId, setActiveDocId] = useState<number | string | null>(
    employee.docs.length > 0 ? employee.docs[0].docId : null
  );
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Selected document
  const activeDocument = useMemo(() => {
    if (!activeDocId) return employee.docs[0] || null;
    return employee.docs.find((d) => d.docId === activeDocId) || employee.docs[0] || null;
  }, [employee.docs, activeDocId]);

  // Filtered documents for this employee
  const filteredDocs = useMemo(() => {
    return employee.docs.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'all' || doc.category === selectedCategory;
      const query = docSearchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        (doc.orderNumber && doc.orderNumber.toLowerCase().includes(query)) ||
        (doc.notes && doc.notes.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [employee.docs, selectedCategory, docSearchQuery]);

  return (
    <div className="space-y-5">
      
      {/* 1. Top Navigation & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 font-bold shadow-2xs hover:border-[#0F2C59]/40"
        >
          <ArrowRight className="w-4 h-4 text-[#0F2C59]" />
          <span>العودة لسجل الموظفين الرئيسي</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrintDossier}
            className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1.5 font-semibold shadow-2xs"
            title="طباعة فهرس واستمارة الإضبارة"
          >
            <Printer className="w-3.5 h-3.5 text-[#0F2C59]" />
            <span>طباعة فهرس الإضبارة</span>
          </button>

          <button
            onClick={onOpenEditModal}
            className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1.5 font-semibold shadow-2xs"
            title="تعديل بيانات الموظف"
          >
            <Edit className="w-3.5 h-3.5 text-slate-600" />
            <span>تعديل البيانات</span>
          </button>

          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-500 font-mono">
            رقم الموظف: <strong className="text-slate-800">{employee.empNumber}</strong>
          </div>
        </div>
      </div>

      {/* 2. Official Employee Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border-r-4 border-[#0F2C59] border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#0F2C59] text-[#DFC7A5] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md border border-[#C5A880]/40 shrink-0">
            {employee.name.split(' ')[0]?.[0] || 'م'}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                {employee.name}
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {employee.status === 'active' ? 'مستمر بالخدمة' : employee.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#C5A880]" />
                <strong className="text-slate-700">{employee.title}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{employee.dept}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{employee.grade} - {employee.stage}</span>
              </span>

              {employee.hireDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>المباشرة: {employee.hireDate}</span>
                </span>
              )}

              {employee.nationalId && (
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="font-mono">الرقم الوطني: {employee.nationalId}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Big Action: Upload PDF */}
        <button
          onClick={onOpenUploadModal}
          className="bg-[#0F2C59] hover:bg-[#081B38] text-white text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 font-bold shadow-md border border-[#C5A880]/40 shrink-0 active:scale-98 w-full sm:w-auto justify-center"
        >
          <FilePlus className="w-4 h-4 text-[#DFC7A5]" />
          <span>إضافة اضبارة جديدة (PDF)</span>
        </button>

      </div>

      {/* 3. Main Dossier Layout: Left Document Reader (8 Cols) / Right Files List (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Right Dossier List Side (4 Cols in RTL) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3.5 flex flex-col">
          
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <h3 className="font-black text-xs text-[#0F2C59] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#C5A880]" />
              <span>قائمة اضابير ووثائق الموظف</span>
            </h3>
            <span className="bg-[#0F2C59]/10 text-[#0F2C59] font-bold px-2.5 py-0.5 rounded-full text-[11px]">
              {employee.docs.length} وثيقة
            </span>
          </div>

          {/* Search in Dossier */}
          <div className="relative">
            <input
              type="text"
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              placeholder="بحث في وثائق الإضبارة..."
              className="w-full pr-8 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1 text-[10px] pb-1 border-b border-slate-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-1 rounded-md transition font-medium ${
                selectedCategory === 'all'
                  ? 'bg-[#0F2C59] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({employee.docs.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
              const count = employee.docs.filter((d) => d.category === key).length;
              if (count === 0 && selectedCategory !== key) return null;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as DocumentCategory)}
                  className={`px-2 py-1 rounded-md transition font-medium ${
                    selectedCategory === key
                      ? 'bg-[#0F2C59] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label.split(' ')[0]} ({count})
                </button>
              );
            })}
          </div>

          {/* Dossier Document Items List */}
          <div className="space-y-2 overflow-y-auto max-h-[520px] pr-1 flex-1">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">
                  {employee.docs.length === 0
                    ? 'لا توجد اضابير مؤرشفة لهذا الموظف بعد'
                    : 'لا توجد وثائق مطابقة للتصنيف المحدد'}
                </p>
                <button
                  onClick={onOpenUploadModal}
                  className="text-[11px] text-[#0F2C59] font-bold underline"
                >
                  اضغط هنا لرفع أول إضبارة
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = activeDocId === doc.docId || (!activeDocId && doc === employee.docs[0]);
                const catInfo = CATEGORY_LABELS[doc.category] || CATEGORY_LABELS.other;

                return (
                  <div
                    key={doc.docId}
                    onClick={() => setActiveDocId(doc.docId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? 'border-[#0F2C59] bg-[#0F2C59]/5 shadow-xs ring-1 ring-[#0F2C59]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#0F2C59] text-white'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-[#0F2C59]' : 'text-slate-800'
                          }`}
                          title={doc.title}
                        >
                          {doc.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                            {doc.orderNumber || 'وثيقة'}
                          </span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          {doc.fileSize && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-slate-400">{doc.fileSize}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`هل أنت متأكد من حذف الوثيقة "${doc.title}"؟`)) {
                          onDeleteDoc(doc.docId);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition hover:bg-red-50 shrink-0"
                      title="حذف هذه الوثيقة من الإضبارة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onOpenUploadModal}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <FileUp className="w-3.5 h-3.5 text-[#0F2C59]" />
              <span>إضافة ملف اضبارة آخر</span>
            </button>
          </div>

        </div>

        {/* Left Document Reader Side (8 Cols in RTL) */}
        <div className="lg:col-span-8 flex flex-col min-h-[580px]">
          <DocumentViewer
            document={activeDocument}
            employeeName={employee.name}
          />
        </div>

      </div>

    </div>
  );
};
