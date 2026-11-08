import React, { useState, useEffect } from 'react';
import { Employee, ArchivedDocument, UserSession } from './types';
import { getAllEmployees, saveEmployee, deleteEmployee, saveAllEmployees } from './services/db';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { UploadDocModal } from './components/UploadDocModal';
import { PrintDossierModal } from './components/PrintDossierModal';
import { BackupModal } from './components/BackupModal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('babil_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    // Default logged in session for immediate usability
    return {
      username: 'admin',
      fullName: 'المهندس حيدر كاظم عبيد',
      role: 'admin',
      roleTitle: 'مسؤول الأرشفة والتوثيق المركزي',
      department: 'ديوان مديرية زراعة بابل',
      loginTime: '08:30 ص',
    };
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetEmp, setUploadTargetEmp] = useState<Employee | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printTargetEmp, setPrintTargetEmp] = useState<Employee | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load database on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to load employees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('babil_session');
    setCurrentUser(null);
    setActiveEmployeeId(null);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    showToast(`مرحباً بك مجدداً، ${session.fullName}`);
  };

  // Add or Edit Employee
  const handleSaveEmployee = async (empData: Partial<Employee>) => {
    if (editingEmployee) {
      // Edit existing
      const updated: Employee = {
        ...editingEmployee,
        ...empData,
      } as Employee;

      await saveEmployee(updated);
      setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showToast('تم تحديث بيانات الموظف بنجاح');
      setEditingEmployee(null);
    } else {
      // Add new
      const newEmp: Employee = {
        id: Date.now(),
        empNumber: empData.empNumber || `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
        nationalId: empData.nationalId || '',
        name: empData.name || '',
        title: empData.title || '',
        dept: empData.dept || 'قسم وقاية المزروعات',
        grade: empData.grade || 'الدرجة الرابعة',
        stage: empData.stage || 'المرحلة 1',
        hireDate: empData.hireDate || new Date().toISOString().split('T')[0],
        status: empData.status || 'active',
        phone: empData.phone || '',
        email: empData.email || '',
        notes: empData.notes || '',
        docs: [],
        createdAt: new Date().toISOString(),
      };

      await saveEmployee(newEmp);
      setEmployees((prev) => [newEmp, ...prev]);
      showToast(`تم تسجيل الموظف "${newEmp.name}" وإضافته للسجل`);
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (empId: number) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    if (
      window.confirm(
        `تنبيه أمني: هل أنت متأكد من حذف الموظف "${emp.name}" وكافة الأضابير والوثائق المرتبطة به؟`
      )
    ) {
      await deleteEmployee(empId);
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
      if (activeEmployeeId === empId) {
        setActiveEmployeeId(null);
      }
      showToast(`تم حذف سجل الموظف "${emp.name}"`);
    }
  };

  // Upload Document into Employee Dossier
  const handleDocUploaded = async (newDoc: ArchivedDocument) => {
    if (!uploadTargetEmp) return;

    const updatedEmp: Employee = {
      ...uploadTargetEmp,
      docs: [newDoc, ...uploadTargetEmp.docs],
    };

    await saveEmployee(updatedEmp);
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    setUploadTargetEmp(updatedEmp);
    showToast(`تمت أرشفة وحفظ "${newDoc.title}" في إضبارة الموظف بنجاح`);
  };

  // Delete Document from Employee Dossier
  const handleDeleteDoc = async (docId: number | string) => {
    if (!activeEmployeeId) return;
    const emp = employees.find((e) => e.id === activeEmployeeId);
    if (!emp) return;

    const updatedEmp: Employee = {
      ...emp,
      docs: emp.docs.filter((d) => d.docId !== docId),
    };

    await saveEmployee(updatedEmp);
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    showToast('تم حذف الوثيقة من الإضبارة');
  };

  // Active employee for profile view
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-slate-800 font-sans" dir="rtl">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#0F2C59] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#C5A880]/50 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Official Government Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onPrintCurrentPage={() => window.print()}
      />

      {/* Main Container */}
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
        
        {/* If Not Logged In, Show Login Section */}
        {!currentUser ? (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-12 h-12 border-4 border-[#0F2C59]/20 border-t-[#0F2C59] rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold text-slate-600">
              جاري تحميل قاعدة بيانات اضابير مديرية زراعة بابل...
            </p>
          </div>
        ) : activeEmployee ? (
          /* Profile Dossier View */
          <EmployeeProfileView
            employee={activeEmployee}
            onBack={() => setActiveEmployeeId(null)}
            onOpenUploadModal={() => {
              setUploadTargetEmp(activeEmployee);
              setIsUploadModalOpen(true);
            }}
            onOpenEditModal={() => {
              setEditingEmployee(activeEmployee);
              setIsAddModalOpen(true);
            }}
            onPrintDossier={() => {
              setPrintTargetEmp(activeEmployee);
              setIsPrintModalOpen(true);
            }}
            onDeleteDoc={handleDeleteDoc}
          />
        ) : (
          /* Dashboard Roster View */
          <DashboardView
            employees={employees}
            onSelectEmployee={(empId) => setActiveEmployeeId(empId)}
            onOpenAddModal={() => {
              setEditingEmployee(null);
              setIsAddModalOpen(true);
            }}
            onOpenEditModal={(emp) => {
              setEditingEmployee(emp);
              setIsAddModalOpen(true);
            }}
            onQuickUpload={(empId) => {
              const emp = employees.find((e) => e.id === empId);
              if (emp) {
                setUploadTargetEmp(emp);
                setIsUploadModalOpen(true);
              }
            }}
            onPrintDossier={(emp) => {
              setPrintTargetEmp(emp);
              setIsPrintModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

      </main>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        editingEmployee={editingEmployee}
      />

      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadTargetEmp(null);
        }}
        employee={uploadTargetEmp}
        onUploadSuccess={handleDocUploaded}
        archivistName={currentUser?.fullName || 'مسؤول الأرشفة'}
      />

      <PrintDossierModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintTargetEmp(null);
        }}
        employee={printTargetEmp}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        employees={employees}
        onDataChanged={(newEmployees) => {
          setEmployees(newEmployees);
          showToast('تم تحديث قاعدة البيانات بنجاح');
        }}
      />

      {/* Official Government Footer */}
      <footer className="bg-[#0F2C59] text-slate-300 text-xs py-5 border-t-2 border-[#C5A880] mt-auto no-print">
        <div className="container mx-auto px-4 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <p className="font-bold">
              جميع الحقوق محفوظة &copy; 2026 - مديرية زراعة بابل
            </p>
          </div>
          <p className="text-[11px] text-slate-400">
            نظام الأرشفة الإلكترونية لأضابير وسجلات الموظفين - ديوان محافظة بابل - جمهورية العراق
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            نظام محمي ومشفر محلياً بواسطة IndexedDB Storage v2.0
          </p>
        </div>
      </footer>

    </div>
  );
}
