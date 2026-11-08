import React, { useState, useMemo } from 'react';
import { Employee, DEPARTMENTS_LIST } from '../types';
import {
  Users,
  FolderOpen,
  Building2,
  FileText,
  Search,
  UserPlus,
  Plus,
  Trash2,
  Edit,
  Printer,
  ChevronLeft,
  Filter,
  Download,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface DashboardViewProps {
  employees: Employee[];
  onSelectEmployee: (empId: number) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (emp: Employee) => void;
  onQuickUpload: (empId: number) => void;
  onPrintDossier: (emp: Employee) => void;
  onDeleteEmployee: (empId: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  onSelectEmployee,
  onOpenAddModal,
  onOpenEditModal,
  onQuickUpload,
  onPrintDossier,
  onDeleteEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [docFilter, setDocFilter] = useState<'all' | 'has_docs' | 'no_docs'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'docs' | 'recent'>('recent');

  // Statistics
  const totalEmployees = employees.length;
  const totalDocs = employees.reduce((acc, emp) => acc + (emp.docs?.length || 0), 0);
  const activeDepts = useMemo(() => new Set(employees.map((e) => e.dept)).size, [employees]);
  const ministerialOrders = useMemo(
    () =>
      employees.reduce(
        (acc, emp) => acc + (emp.docs?.filter((d) => d.category === 'orders').length || 0),
        0
      ),
    [employees]
  );

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          emp.name.toLowerCase().includes(query) ||
          emp.title.toLowerCase().includes(query) ||
          emp.empNumber.toLowerCase().includes(query) ||
          (emp.nationalId && emp.nationalId.includes(query)) ||
          emp.dept.toLowerCase().includes(query);

        const matchesDept = selectedDept === 'all' || emp.dept === selectedDept;

        const matchesDocs =
          docFilter === 'all' ||
          (docFilter === 'has_docs' && emp.docs.length > 0) ||
          (docFilter === 'no_docs' && emp.docs.length === 0);

        return matchesQuery && matchesDept && matchesDocs;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
        if (sortBy === 'docs') return b.docs.length - a.docs.length;
        return b.id - a.id;
      });
  }, [employees, searchQuery, selectedDept, docFilter, sortBy]);

  // Export Roster as CSV
  const handleExportCSV = () => {
    const headers = ['ت', 'الرقم الوظيفي', 'اسم الموظف', 'العنوان الوظيفي', 'القسم/الشعبة', 'الدرجة والمرحلة', 'عدد الاضابير', 'تاريخ التعيين'];
    const rows = filteredEmployees.map((emp, idx) => [
      idx + 1,
      emp.empNumber,
      `"${emp.name}"`,
      `"${emp.title}"`,
      `"${emp.dept}"`,
      `"${emp.grade} - ${emp.stage}"`,
      emp.docs.length,
      emp.hireDate,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_موظفي_زراعة_بابل_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Official Statistics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
        
        {/* Total Employees */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mb-1">
                إجمالي الموظفين المسجلين
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59]">
                {totalEmployees}
              </h3>
              <p className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                محدث على الملاك الدائم
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Archived Dossiers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mb-1">
                مجموع الأضابير والوثائق
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59]">
                {totalDocs}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-medium flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-[#C5A880]" />
                مفهرسة رقمياً ومحفوظة
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Departments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mb-1">
                الأقسام والشعب الزراعية
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59]">
                {activeDepts}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                في مركز ديوان المديرية والأقضية
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Ministerial Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mb-1">
                الأوامر الوزارية والإدارية
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2C59]">
                {ministerialOrders}
              </h3>
              <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                أوامر تثبيت وترفيع نافذة
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Search, Filter & Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4 no-print">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-[#0F2C59] flex items-center gap-2">
              <span>سجل الموظفين والاضابير الإلكترونية</span>
              <span className="text-xs bg-[#0F2C59]/10 text-[#0F2C59] px-2.5 py-0.5 rounded-full font-bold">
                {filteredEmployees.length} من {totalEmployees}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              إدارة وأرشفة مستمسكات وأوامر كوادر مديرية زراعة بابل
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-300 shadow-2xs"
              title="تصدير السجل إلى Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>تصدير السجل</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="bg-[#0F2C59] hover:bg-[#081B38] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 border border-[#C5A880]/40 grow sm:grow-0 justify-center"
            >
              <UserPlus className="w-4 h-4 text-[#DFC7A5]" />
              <span>إضافة موظف جديد</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، العنوان، أو الرقم الوظيفي..."
              className="w-full pr-9 pl-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            >
              <option value="all">كافة الأقسام والشعب الزراعية</option>
              {DEPARTMENTS_LIST.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Dossier Filter */}
          <div>
            <select
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            >
              <option value="all">حالة الإضبارة: الكل</option>
              <option value="has_docs">لديه أضابير مؤرشفة (مكتمل)</option>
              <option value="no_docs">بدون أضابير (يحتاج أرشفة)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
            >
              <option value="recent">الترتيب: الأحدث تسجيلاً</option>
              <option value="name">الترتيب: أبجدياً بالاسم</option>
              <option value="docs">الترتيب: الأكثر وثائق وأضابير</option>
            </select>
          </div>

        </div>

      </div>

      {/* 3. Employee Records Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#0F2C59] text-xs font-bold border-b border-slate-200 select-none">
                <th className="p-3.5 sm:px-4 w-12 text-center">#</th>
                <th className="p-3.5 sm:px-4">اسم الموظف الكامل</th>
                <th className="p-3.5 sm:px-4">العنوان الوظيفي</th>
                <th className="p-3.5 sm:px-4">القسم / الشعبة</th>
                <th className="p-3.5 sm:px-4">الدرجة والمرحلة</th>
                <th className="p-3.5 sm:px-4 text-center">عدد الأضابير</th>
                <th className="p-3.5 sm:px-4 text-center w-64">الإجراءات والخيارات</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FolderOpen className="w-12 h-12 mx-auto text-slate-300" />
                      <p className="font-bold text-slate-600">لا توجد نتائج مطابقة لبحثك</p>
                      <p className="text-[11px] text-slate-400">
                        جرب تعديل كلمات البحث أو تصفية الأقسام، أو قم بإضافة موظف جديد.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp.id)}
                  >
                    {/* Sequence */}
                    <td className="p-3.5 sm:px-4 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {/* Name & ID Badge */}
                    <td className="p-3.5 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F2C59] to-[#1A3E75] text-[#DFC7A5] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {emp.name.split(' ')[0]?.[0] || 'م'}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F2C59] text-xs sm:text-sm group-hover:text-[#9A7B4F] transition">
                            {emp.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                              {emp.empNumber}
                            </span>
                            {emp.nationalId && (
                              <span className="font-mono">وطني: {emp.nationalId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="p-3.5 sm:px-4 font-semibold text-slate-700">
                      {emp.title}
                    </td>

                    {/* Department */}
                    <td className="p-3.5 sm:px-4 text-slate-600">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                        {emp.dept}
                      </span>
                    </td>

                    {/* Grade & Stage */}
                    <td className="p-3.5 sm:px-4 text-slate-600">
                      <p className="font-medium">{emp.grade.split('(')[0]}</p>
                      <p className="text-[10px] text-slate-400">{emp.stage}</p>
                    </td>

                    {/* Dossier Count Badge */}
                    <td className="p-3.5 sm:px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          emp.docs.length > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{emp.docs.length} إضبارة</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="p-3.5 sm:px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View Dossier Button */}
                        <button
                          onClick={() => onSelectEmployee(emp.id)}
                          className="bg-[#0F2C59]/10 hover:bg-[#0F2C59] hover:text-white text-[#0F2C59] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                          title="عرض ملف الإضبارة الإلكترونية"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>عرض</span>
                        </button>

                        {/* Quick Add PDF Button */}
                        <button
                          onClick={() => onQuickUpload(emp.id)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                          title="إضافة وحفظ إضبارة جديدة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة</span>
                        </button>

                        {/* Print Slip */}
                        <button
                          onClick={() => onPrintDossier(emp)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-xs transition"
                          title="طباعة بطاقة وفهرس الموظف"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Employee Details */}
                        <button
                          onClick={() => onOpenEditModal(emp)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-xs transition"
                          title="تعديل بيانات الموظف"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Employee */}
                        <button
                          onClick={() => onDeleteEmployee(emp.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg text-xs transition"
                          title="حذف الموظف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>
            يعرض {filteredEmployees.length} من أصل {totalEmployees} موظف مسجل
          </span>
          <span className="text-[11px] text-slate-400">
            نظام الحفظ والأرشفة الإلكتروني - مديرية زراعة بابل
          </span>
        </div>

      </div>

    </div>
  );
};
