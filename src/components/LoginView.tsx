import React, { useState } from 'react';
import { UserSession } from '../types';
import { Lock, User, Eye, EyeOff, ShieldCheck, FolderGit2, AlertCircle } from 'lucide-react';
import { OfficialEmblem } from './OfficialEmblem';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Predefined accounts
    if (username.trim() === 'admin' && password === '123456') {
      const session: UserSession = {
        username: 'admin',
        fullName: 'المهندس حيدر كاظم عبيد',
        role: 'admin',
        roleTitle: 'مدير عام / مسؤول الأرشفة المركزية',
        department: 'مكتب السيد المدير العام - ديوان مديرية زراعة بابل',
        loginTime: new Date().toLocaleTimeString('ar-IQ'),
      };
      if (rememberMe) {
        localStorage.setItem('babil_session', JSON.stringify(session));
      }
      onLoginSuccess(session);
    } else if (username.trim() === 'archivist' && (password === '123456' || password === 'archive')) {
      const session: UserSession = {
        username: 'archivist',
        fullName: 'الأستاذ ثامر مهدي خضير',
        role: 'archivist',
        roleTitle: 'مسؤول شعبة الحفظ والأرشفة الإلكترونية',
        department: 'شعبة تكنولوجيا المعلومات والأرشفة',
        loginTime: new Date().toLocaleTimeString('ar-IQ'),
      };
      if (rememberMe) {
        localStorage.setItem('babil_session', JSON.stringify(session));
      }
      onLoginSuccess(session);
    } else if (username.trim() === 'hr' && password === '123456') {
      const session: UserSession = {
        username: 'hr',
        fullName: 'الست نغم صلاح عبد الكريم',
        role: 'hr_auditor',
        roleTitle: 'مدقق أول شؤون الموظفين والتقاعد',
        department: 'شعبة الشؤون الإدارية والمالية',
        loginTime: new Date().toLocaleTimeString('ar-IQ'),
      };
      if (rememberMe) {
        localStorage.setItem('babil_session', JSON.stringify(session));
      }
      onLoginSuccess(session);
    } else {
      setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة! يرجى التأكد من البيانات المدخلة.');
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Card Header with Iraqi Crest & Emblem */}
        <div className="bg-[#0F2C59] text-white p-6 sm:p-8 text-center relative border-b-4 border-[#C5A880]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
          
          <div className="mx-auto w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center p-2 border border-[#C5A880]/50 mb-3 shadow-lg">
            <OfficialEmblem size={64} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#C5A880]/20 text-[#DFC7A5] border border-[#C5A880]/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFC7A5]" />
            بوابة تسجيل الدخول الآمنة
          </span>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            تسجيل الدخول للنظام
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            منظومة أرشفة اضابير الموظفين - مديرية زراعة بابل
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs rounded-lg flex items-start gap-2 shadow-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المستخدم المعتمد
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pr-10 pl-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none transition"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور السرية
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10 pl-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none transition"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#0F2C59] focus:ring-[#0F2C59]"
              />
              <span>تذكر تسجيل الدخول على هذا الجهاز</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0F2C59] hover:bg-[#081B38] text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm border border-[#C5A880]/30 active:scale-[0.99]"
          >
            <FolderGit2 className="w-4 h-4 text-[#DFC7A5]" />
            <span>تسجيل الدخول للمنظومة</span>
          </button>

          {/* Fast Switch / Demo Credentials Section */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-700 flex items-center justify-between">
              <span>حسابات تجريبية سريعة:</span>
              <span className="text-[10px] text-[#0F2C59] font-bold">كلمة السر للكل: 123456</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', '123456')}
                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-[#0F2C59] hover:text-[#0F2C59] font-medium transition text-center shadow-2xs"
              >
                مدير النظام
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('archivist', '123456')}
                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-[#0F2C59] hover:text-[#0F2C59] font-medium transition text-center shadow-2xs"
              >
                مسؤول الأرشفة
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hr', '123456')}
                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-[#0F2C59] hover:text-[#0F2C59] font-medium transition text-center shadow-2xs"
              >
                الموارد البشرية
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-[10px] text-slate-400">
              جميع العمليات والوثائق مسجلة ومحمية بموجب قانون الوثائق الوطنية لجمهورية العراق
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
