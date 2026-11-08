import React from 'react';
import { Employee, CATEGORY_LABELS } from '../types';
import { OfficialEmblem } from './OfficialEmblem';
import { Printer, X, FileSpreadsheet } from 'lucide-react';

interface PrintDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateArabic = new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Toolbar - Hidden during print */}
        <div className="bg-[#0F2C59] text-white p-4 flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#DFC7A5]" />
            <h3 className="font-bold text-sm sm:text-base">
              معاينة وطباعة فهرس إضبارة الموظف الرسمية
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#C5A880] hover:bg-[#9A7B4F] text-[#0F2C59] hover:text-white font-bold px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>إرسال للطابعة الرسمية</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Frame */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-slate-50 print:bg-white print:p-0 print:overflow-visible">
          <div className="bg-white p-8 sm:p-12 border-2 border-slate-300 rounded-xl shadow-xs print:border-none print:shadow-none print:p-0">
            
            {/* Official Header */}
            <div className="border-b-2 border-[#0F2C59] pb-4 mb-6">
              <div className="flex justify-between items-center text-center">
                
                {/* Right Header */}
                <div className="text-right space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">جمهورية العراق</p>
                  <p className="text-xs text-slate-700">وزارة الزراعة</p>
                  <p className="text-xs text-slate-700">ديوان محافظة بابل</p>
                  <p className="text-sm font-black text-[#0F2C59]">مديرية زراعة بابل</p>
                  <p className="text-[10px] text-slate-500">شعبة تكنولوجيا المعلومات والأرشفة</p>
                </div>

                {/* Center Emblem */}
                <div className="flex flex-col items-center">
                  <OfficialEmblem size={56} />
                  <p className="text-[11px] font-bold text-[#0F2C59] mt-1">
                    استمارة فهرس إضبارة الخدمة
                  </p>
                  <span className="text-[9px] text-slate-500 font-mono">
                    BBL-DOSSIER-V2
                  </span>
                </div>

                {/* Left Header */}
                <div className="text-left space-y-0.5 font-mono text-xs">
                  <p><strong>الرقم الوظيفي:</strong> {employee.empNumber}</p>
                  <p><strong>تاريخ الطباعة:</strong> {currentDateArabic}</p>
                  <p><strong>إجمالي الوثائق:</strong> {employee.docs.length} وثيقة</p>
                </div>

              </div>
            </div>

            {/* Employee Information Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
              <h4 className="text-xs font-black text-[#0F2C59] mb-3 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>البيانات الوظيفية والمدنية للموظف</span>
                <span className="text-[10px] bg-[#0F2C59] text-white px-2 py-0.5 rounded-full font-normal">
                  الحالة: {employee.status === 'active' ? 'مستمر بالخدمة' : employee.status}
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">الاسم الرباعي واللقب</span>
                  <span className="font-bold text-slate-900">{employee.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">العنوان الوظيفي</span>
                  <span className="font-bold text-slate-800">{employee.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">القسم / الشعبة</span>
                  <span className="font-semibold text-slate-800">{employee.dept}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الرقم الوطني الموحد</span>
                  <span className="font-mono font-bold text-slate-800">{employee.nationalId || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الدرجة والمرحلة</span>
                  <span className="font-semibold text-slate-700">{employee.grade} - {employee.stage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">تاريخ المباشرة</span>
                  <span className="font-mono text-slate-700">{employee.hireDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">رقم الهاتف</span>
                  <span className="font-mono text-slate-700">{employee.phone || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">البريد الإلكتروني</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate">{employee.email || '--'}</span>
                </div>
              </div>
            </div>

            {/* Documents Inventory Table */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-[#0F2C59] mb-2 flex items-center justify-between">
                <span>جدول محتويات الإضبارة والأوامر المؤرشفة</span>
                <span className="text-[10px] text-slate-500">محدث إلكترونياً</span>
              </h4>

              <table className="w-full text-right text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-l border-slate-300 w-10 text-center">ت</th>
                    <th className="p-2 border-l border-slate-300">عنوان المستند / القرار</th>
                    <th className="p-2 border-l border-slate-300">التصنيف الأرشيفي</th>
                    <th className="p-2 border-l border-slate-300">رقم الأمر / الكتاب</th>
                    <th className="p-2 border-l border-slate-300">تاريخ الصدور</th>
                    <th className="p-2 border-l border-slate-300">تاريخ الحفظ</th>
                    <th className="p-2">الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employee.docs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                        لا توجد وثائق مؤرشفة في إضبارة هذا الموظف حتى الآن
                      </td>
                    </tr>
                  ) : (
                    employee.docs.map((doc, idx) => (
                      <tr key={doc.docId} className="hover:bg-slate-50">
                        <td className="p-2 border-l border-slate-200 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="p-2 border-l border-slate-200 font-semibold text-slate-800">
                          {doc.title}
                        </td>
                        <td className="p-2 border-l border-slate-200 text-slate-600">
                          {CATEGORY_LABELS[doc.category]?.label || 'أخرى'}
                        </td>
                        <td className="p-2 border-l border-slate-200 font-mono text-slate-700">
                          {doc.orderNumber || '--'}
                        </td>
                        <td className="p-2 border-l border-slate-200 font-mono text-slate-700">
                          {doc.issueDate || '--'}
                        </td>
                        <td className="p-2 border-l border-slate-200 text-slate-600">
                          {doc.uploadDate}
                        </td>
                        <td className="p-2 text-slate-500 text-[11px]">
                          {doc.notes || '--'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signatures & Seal Section */}
            <div className="grid grid-cols-3 gap-6 text-center pt-8 border-t-2 border-slate-200 mt-10">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-10">منظم الفهرس والأرشفة</p>
                <div className="border-t border-dotted border-slate-400 pt-1 text-[11px] text-slate-600">
                  التوقيع والاسم والتاريخ
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 border-2 border-dashed border-[#0F2C59] rounded-full flex flex-col items-center justify-center text-center p-1 text-[#0F2C59] opacity-80">
                  <span className="text-[9px] font-bold">جمهورية العراق</span>
                  <span className="text-[8px]">مديرية زراعة بابل</span>
                  <span className="text-[7px] text-[#C5A880] font-bold">ختم الأرشفة الإلكترونية</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 mb-10">مدير زراعة بابل / وكالة</p>
                <div className="border-t border-dotted border-slate-400 pt-1 text-[11px] text-slate-600">
                  المصادقة والتاريخ
                </div>
              </div>
            </div>

            {/* Document Bottom Barcode */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>نظام الأرشفة الإلكتروني - ديوان محافظة بابل - مديرية زراعة بابل</span>
              <span>BARCODE: *BBL-AGRI-{employee.empNumber}*</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
