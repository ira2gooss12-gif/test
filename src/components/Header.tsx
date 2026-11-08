import React from 'react';
import { UserSession } from '../types';
import { OfficialEmblem } from './OfficialEmblem';
import { LogOut, Database, Printer, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  currentUser: UserSession | null;
  onLogout: () => void;
  onOpenBackup: () => void;
  onPrintCurrentPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenBackup,
  onPrintCurrentPage,
}) => {
  // Format current date in Arabic
  const todayArabic = new Intl.DateTimeFormat('ar-IQ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-[#0F2C59] text-white shadow-xl border-b-4 border-[#C5A880] relative z-20 no-print">
      {/* Top subtle golden bar */}
      <div className="bg-gradient-to-r from-[#9A7B4F] via-[#C5A880] to-[#9A7B4F] h-1 w-full" />

      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Emblem & Official Directorate Titles */}
          <div className="flex items-center gap-3.5 text-center md:text-right">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center p-1.5 border border-[#C5A880]/50 shadow-inner backdrop-blur-sm shrink-0">
              <OfficialEmblem size={48} />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C5A880] animate-pulse"></span>
                <h2 className="text-[11px] sm:text-xs text-[#DFC7A5] font-semibold tracking-wider">
                  جمهورية العراق - ديوان محافظة بابل
                </h2>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-sm">
                مديرية زراعة بابل
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                نظام أرشفة وإدارة اضابير الموظفين الإلكتروني الموحد
              </p>
            </div>
          </div>

          {/* Controls: Date, User Profile & Actions */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3">
            {/* Live Iraqi Date Display */}
            <div className="hidden lg:flex flex-col text-left text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
              <span className="text-[10px] text-[#DFC7A5]">تاريخ اليوم الرسمي:</span>
              <span className="font-semibold text-white">{todayArabic}</span>
            </div>

            {currentUser && (
              <>
                {/* Backup & System Tools */}
                <button
                  onClick={onOpenBackup}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg border border-white/15 transition flex items-center gap-1.5 font-medium shadow-sm hover:border-[#C5A880]/60"
                  title="النسخ الاحتياطي واستعادة البيانات"
                >
                  <Database className="w-3.5 h-3.5 text-[#DFC7A5]" />
                  <span className="hidden sm:inline">النسخ الاحتياطي</span>
                </button>

                {onPrintCurrentPage && (
                  <button
                    onClick={onPrintCurrentPage}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg border border-white/15 transition flex items-center gap-1.5 font-medium shadow-sm hover:border-[#C5A880]/60"
                    title="طباعة الصفحة الحالية"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#DFC7A5]" />
                    <span className="hidden sm:inline">طباعة</span>
                  </button>
                )}

                {/* User Session Info Header */}
                <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/15 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#0F2C59] flex items-center justify-center font-bold text-xs shrink-0 shadow">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-right leading-tight">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-[#DFC7A5]">
                        {currentUser.fullName}
                      </p>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-300">
                      {currentUser.roleTitle}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="bg-rose-600/90 hover:bg-rose-700 text-white px-3 py-2 rounded-lg transition duration-200 text-xs flex items-center gap-1.5 shadow font-semibold"
                  title="تسجيل الخروج من النظام"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
