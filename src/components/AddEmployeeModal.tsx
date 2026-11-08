import React, { useState, useEffect } from 'react';
import { Employee, DEPARTMENTS_LIST, GRADES_LIST } from '../types';
import { UserPlus, Edit3, X, Save, AlertCircle } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => void;
  editingEmployee?: Employee | null;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEmployee,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS_LIST[0]);
  const [empNumber, setEmpNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [grade, setGrade] = useState(GRADES_LIST[3]);
  const [stage, setStage] = useState('المرحلة 1');
  const [hireDate, setHireDate] = useState('2020-01-01');
  const [status, setStatus] = useState<'active' | 'leave' | 'retired' | 'assigned'>('active');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name || '');
      setTitle(editingEmployee.title || '');
      setDept(editingEmployee.dept || DEPARTMENTS_LIST[0]);
      setEmpNumber(editingEmployee.empNumber || '');
      setNationalId(editingEmployee.nationalId || '');
      setGrade(editingEmployee.grade || GRADES_LIST[3]);
      setStage(editingEmployee.stage || 'المرحلة 1');
      setHireDate(editingEmployee.hireDate || '2020-01-01');
      setStatus(editingEmployee.status || 'active');
      setPhone(editingEmployee.phone || '');
      setEmail(editingEmployee.email || '');
      setNotes(editingEmployee.notes || '');
    } else {
      // Generate default employee ID
      const randomId = Math.floor(10000 + Math.random() * 90000);
      setName('');
      setTitle('');
      setDept(DEPARTMENTS_LIST[0]);
      setEmpNumber(`EMP-${randomId}`);
      setNationalId('');
      setGrade(GRADES_LIST[3]);
      setStage('المرحلة 1');
      setHireDate(new Date().toISOString().split('T')[0]);
      setStatus('active');
      setPhone('');
      setEmail('');
      setNotes('');
    }
    setError('');
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم الموظف كاملاً.');
      return;
    }
    if (!title.trim()) {
      setError('يرجى تحديد العنوان الوظيفي للموظف.');
      return;
    }

    onSave({
      name: name.trim(),
      title: title.trim(),
      dept,
      empNumber: empNumber.trim() || `EMP-${Date.now().toString().slice(-5)}`,
      nationalId: nationalId.trim(),
      grade,
      stage,
      hireDate,
      status,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#0F2C59] text-white p-4 sm:p-5 flex justify-between items-center border-b-2 border-[#C5A880]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#C5A880]/40 text-[#DFC7A5]">
              {editingEmployee ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {editingEmployee ? 'تعديل بيانات الموظف والإضبارة' : 'إضافة موظف جديد لسجل الأضابير'}
              </h3>
              <p className="text-xs text-slate-300">
                مديرية زراعة بابل - قسم الموارد البشرية والحفظ الأرشيفي
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الكامل للموظف (الرباعي واللقب) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد علي حسين الخفاجي"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العنوان الوظيفي المعتمد *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: رئيس مهندسين زراعيين أقدم"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                القسم / الشعبة الزراعية *
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              >
                {DEPARTMENTS_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الرقم الوظيفي المعتمد
              </label>
              <input
                type="text"
                value={empNumber}
                onChange={(e) => setEmpNumber(e.target.value)}
                placeholder="EMP-XXXXX"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white text-left font-mono"
                dir="ltr"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم البطاقة الوطنية الموحدة
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="مثال: 198421049281"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white text-left font-mono"
                dir="ltr"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الدرجة الوظيفية
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              >
                {GRADES_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المرحلة
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
                  <option key={n} value={`المرحلة ${n}`}>
                    المرحلة {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Hire Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ التعيين والمباشرة
              </label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الحالة الوظيفية
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              >
                <option value="active">مستمر بالخدمة (على الملاك الدائم)</option>
                <option value="assigned">منسب / مفرغ</option>
                <option value="leave">في إجازة طويلة / دراسية</option>
                <option value="retired">متقاعد / منفك</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف للتواصل
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXXX"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white text-left"
                dir="ltr"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني الرسمي
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@babil-agri.gov.iq"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white text-left"
                dir="ltr"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات إضافية وسجل الإضبارة
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="سجل مختصر عن اللجان، الإيفادات، أو ملاحظات الحفظ..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F2C59] focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0F2C59] hover:bg-[#081B38] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4 text-[#DFC7A5]" />
              <span>{editingEmployee ? 'حفظ التعديلات' : 'تسجيل وإضافة الموظف'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
