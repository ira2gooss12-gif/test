export type DocumentCategory =
  | 'orders' // أوامر إدارية ووزارية
  | 'identity' // مستمسكات ثبوتية وسيرة ذاتية
  | 'rewards' // كتب الشكر والتقدير والعقوبات
  | 'promotions' // ترفيعات وعلاوات سنوية
  | 'leaves' // إجازات وتقارير طبية
  | 'assignments' // كتب التكليف والتنسيب والإيفاد
  | 'other'; // وثائق أخرى

export interface ArchivedDocument {
  docId: number | string;
  title: string;
  category: DocumentCategory;
  orderNumber?: string; // رقم الأمر الإداري / الكتاب
  issueDate?: string; // تاريخ صدور الكتاب
  uploadDate: string; // تاريخ الأرشفة
  archivedBy?: string; // أرشف بواسطة
  fileSize?: string;
  fileType: 'pdf' | 'image' | 'text';
  data: string; // Base64 or Data URI
  notes?: string;
  isSample?: boolean;
}

export interface Employee {
  id: number;
  empNumber: string; // الرقم الوظيفي
  nationalId?: string; // الرقم الوطني الموحد
  name: string; // الاسم الرباعي واللقب
  title: string; // العنوان الوظيفي
  dept: string; // القسم / الشعبة
  grade: string; // الدرجة الوظيفية
  stage: string; // المرحلة الوظيفية
  hireDate: string; // تاريخ التعيين والمباشرة
  status: 'active' | 'leave' | 'retired' | 'assigned'; // الحالة الوظيفية
  phone?: string;
  email?: string;
  notes?: string;
  avatarColor?: string;
  docs: ArchivedDocument[];
  createdAt?: string;
}

export interface UserSession {
  username: string;
  fullName: string;
  role: 'admin' | 'archivist' | 'hr_auditor';
  roleTitle: string;
  department: string;
  loginTime: string;
}

export const CATEGORY_LABELS: Record<DocumentCategory, { label: string; icon: string; color: string }> = {
  orders: { label: 'الأوامر الإدارية والوزارية', icon: 'FileText', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  identity: { label: 'المستمسكات الثبوتية والسيرة الذاتية', icon: 'UserCheck', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rewards: { label: 'كتب الشكر والتقدير والتكريم', icon: 'Award', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  promotions: { label: 'الترفيعات والعلاوات السنوية', icon: 'TrendingUp', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  leaves: { label: 'الإجازات والتقارير الطبية', icon: 'CalendarDays', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  assignments: { label: 'كتب التكليف والتنسيب والإيفاد', icon: 'Send', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  other: { label: 'وثائق ومراسلات أخرى', icon: 'Folder', color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

export const DEPARTMENTS_LIST = [
  'قسم وقاية المزروعات',
  'شعبة الأراضي والتأجير',
  'قسم الثروة والإنتاج الحيواني',
  'شعبة الإرشاد والتدريب الزراعي',
  'شعبة الشؤون الإدارية والمالية',
  'قسم الغابات ومكافحة التصحر',
  'شعبة التخطيط والمتابعة الإحصائية',
  'شعبة الرقابة والتدقيق الداخلي',
  'شعبة الشؤون القانونية والعقود',
  'شعبة تكنولوجيا المعلومات والأرشفة',
  'مكتب السيد المدير العام'
];

export const GRADES_LIST = [
  'الدرجة الأولى (مدير عام / خبير)',
  'الدرجة الثانية (رئيس مهندسين أقدم)',
  'الدرجة الثالثة (رئيس مهندسين)',
  'الدرجة الرابعة (مهندس أقدم)',
  'الدرجة الخامسة (مهندس زراعي)',
  'الدرجة السادسة (معاون مهندس)',
  'الدرجة السابعة (رئيس ملاحظين)',
  'الدرجة الثامنة (ملاحظ فني)',
  'الدرجة التاسعة (كاتب فني)',
  'الدرجة العاشرة (معاون كاتب)'
];
