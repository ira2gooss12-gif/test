import { Employee } from '../types';

/**
 * Creates an authentic official Iraqi Government Document data URL (formatted HTML / printable document)
 */
export function generateOfficialDocumentDataUrl(
  title: string,
  orderNumber: string,
  issueDate: string,
  employeeName: string,
  dept: string,
  bodyContent: string,
  signatory: string = 'المهندس الزراعي حيدر كاظم عبيد\nمدير زراعة بابل'
): string {
  const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Amiri:wght@700&display=swap');
    body {
      margin: 0;
      padding: 30px;
      background-color: #f8fafc;
      font-family: 'Cairo', sans-serif;
      color: #0f172a;
      display: flex;
      justify-content: center;
    }
    .page {
      background: #ffffff;
      width: 100%;
      max-width: 760px;
      min-height: 980px;
      padding: 40px 50px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
      position: relative;
      box-sizing: border-box;
    }
    .border-frame {
      border: 2px solid #0F2C59;
      outline: 1px solid #C5A880;
      outline-offset: 4px;
      padding: 30px;
      min-height: 880px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0F2C59;
      padding-bottom: 18px;
      margin-bottom: 25px;
    }
    .header-col {
      text-align: center;
      flex: 1;
    }
    .header-col.right { text-align: right; }
    .header-col.left { text-align: left; }
    .header-title-main {
      font-size: 14px;
      font-weight: 700;
      color: #0F2C59;
      margin: 0 0 3px 0;
    }
    .header-subtitle {
      font-size: 12px;
      color: #475569;
      margin: 0 0 2px 0;
    }
    .emblem-box {
      width: 70px;
      height: 70px;
      margin: 0 auto;
    }
    .doc-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      font-size: 13px;
      background: #f8fafc;
      padding: 10px 16px;
      border-radius: 6px;
      border-right: 4px solid #C5A880;
    }
    .subject-box {
      text-align: center;
      margin: 25px 0 30px 0;
    }
    .subject-title {
      font-size: 17px;
      font-weight: 800;
      color: #0F2C59;
      display: inline-block;
      border-bottom: 2px solid #C5A880;
      padding-bottom: 6px;
    }
    .content-body {
      font-size: 14px;
      line-height: 2.1;
      text-align: justify;
      color: #1e293b;
      margin-bottom: 45px;
    }
    .employee-highlight {
      font-weight: 700;
      color: #0F2C59;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .signatures-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }
    .official-seal {
      width: 100px;
      height: 100px;
      border: 3px double #0F2C59;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 10px;
      color: #0F2C59;
      transform: rotate(-12deg);
      background: rgba(15, 44, 89, 0.03);
      padding: 5px;
    }
    .signature-block {
      text-align: center;
      min-width: 200px;
    }
    .signatory-name {
      font-size: 14px;
      font-weight: 700;
      color: #0F2C59;
      white-space: pre-line;
      line-height: 1.6;
    }
    .barcode-footer {
      position: absolute;
      bottom: 15px;
      left: 30px;
      right: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #94a3b8;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="border-frame">
      <div class="header">
        <div class="header-col right">
          <p class="header-title-main">جمهورية العراق</p>
          <p class="header-subtitle">وزارة الزراعة</p>
          <p class="header-subtitle">ديوان محافظة بابل</p>
          <p class="header-subtitle" style="font-weight:bold; color:#0F2C59;">مديرية زراعة بابل</p>
        </div>
        <div class="header-col">
          <svg class="emblem-box" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#0F2C59" stroke-width="3" fill="#fafafa"/>
            <circle cx="50" cy="50" r="41" stroke="#C5A880" stroke-width="1.5"/>
            <path d="M50 20 L58 35 L75 38 L62 50 L65 67 L50 58 L35 67 L38 50 L25 38 L42 35 Z" fill="#0F2C59"/>
            <rect x="36" y="70" width="28" height="4" rx="2" fill="#C5A880"/>
          </svg>
        </div>
        <div class="header-col left">
          <p class="header-title-main">Republic of Iraq</p>
          <p class="header-subtitle">Ministry of Agriculture</p>
          <p class="header-subtitle">Babil Agriculture Dir.</p>
          <p class="header-subtitle">Electronic Archive</p>
        </div>
      </div>

      <div class="doc-meta">
        <div><strong>العدد:</strong> ${orderNumber}</div>
        <div><strong>التاريخ:</strong> ${issueDate}</div>
        <div><strong>القسم المختص:</strong> ${dept}</div>
      </div>

      <div class="subject-box">
        <div class="subject-title">م / ${title}</div>
      </div>

      <div class="content-body">
        ${bodyContent}
      </div>

      <div class="signatures-row">
        <div class="official-seal">
          <div style="font-weight:bold; font-size:10px;">جمهورية العراق</div>
          <div style="font-size:9px;">وزارة الزراعة</div>
          <div style="font-size:8px;">مديرية زراعة بابل</div>
          <div style="font-weight:bold; font-size:8px; color:#C5A880; margin-top:2px;">ختم الحفظ والأرشفة</div>
        </div>

        <div class="signature-block">
          <div style="height:35px; margin-bottom:5px;">
            <svg width="120" height="30" viewBox="0 0 120 30" fill="none">
              <path d="M10 25 C30 5, 50 28, 80 12 C95 5, 105 20, 115 15" stroke="#0F2C59" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="signatory-name">${signatory}</div>
        </div>
      </div>

      <div class="barcode-footer">
        <span>وثيقة رسمية مؤرشفة إلكترونياً - نظام أرشفة مديرية زراعة بابل</span>
        <span>الباركود الأرشيفي: BBL-AGRI-${orderNumber.replace(/[^0-9]/g, '') || '2026'}</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
}

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 101,
    empNumber: 'EMP-74921',
    nationalId: '198421049281',
    name: 'أحمد علي حسين الخفاجي',
    title: 'رئيس مهندسين زراعيين أقدم',
    dept: 'قسم وقاية المزروعات',
    grade: 'الدرجة الثانية (رئيس مهندسين أقدم)',
    stage: 'المرحلة 4',
    hireDate: '2008-04-15',
    status: 'active',
    phone: '07801234567',
    email: 'ahmed.ali@babil-agri.gov.iq',
    notes: 'مسؤول شعبة مكافحة الآفات الزراعية سابقاً، مشهود له بالكفاءة والانضباط العالي.',
    avatarColor: 'from-blue-700 to-indigo-900',
    createdAt: '2024-01-10',
    docs: [
      {
        docId: 1001,
        title: 'الأمر الوزاري المرقم 481 لسنة 2024 - التثبيت والترقية المهنية',
        category: 'orders',
        orderNumber: 'و.ز/481/2024',
        issueDate: '2024-02-18',
        uploadDate: '2024-02-20',
        archivedBy: 'مسؤول الأرشفة المركزية',
        fileSize: '412 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر وزاري بالترقية المهنية والتثبيت',
          'و.ز/481/2024',
          '2024/02/18',
          'أحمد علي حسين الخفاجي',
          'قسم وقاية المزروعات',
          `بناءً على مقتضيات المصلحة العامة، واستناداً إلى أحكام قانون الخدمة المدنية رقم (24) لسنة 1960 المعدل، وقانون الملاك النافذ.<br><br>
          <strong>تقرر ما يلي:</strong><br>
          1. ترقية السيد <span class="employee-highlight">أحمد علي حسين الخفاجي</span> من عنوان (رئيس مهندسين) إلى عنوان (رئيس مهندسين زراعيين أقدم) على ملاك مديرية زراعة بابل - قسم وقاية المزروعات اعتباراً من تاريخ استحقاقه القانوني.<br>
          2. يُمنح المذكور الراتب الاسمي المحدد للدرجة الثانية / المرحلة الرابعة وفق سلم الرواتب المعتمد.<br>
          3. ينفذ هذا الأمر من تاريخ صدوره وتتولى شعبة الشؤون الإدارية والمالية إشعار ديوان الرقابة والتقاعد الوطنية.`
        ),
        notes: 'مستند أصلي مصدق من ديوان وزارة الزراعة'
      },
      {
        docId: 1002,
        title: 'كتاب شكر وتقدير من معالي وزير الزراعة - جهود الحملة الوطنية لمكافحة سوسة النخيل',
        category: 'rewards',
        orderNumber: 'م.و/1092',
        issueDate: '2023-11-05',
        uploadDate: '2023-11-10',
        archivedBy: 'مسؤول الأرشفة المركزية',
        fileSize: '320 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'كتاب شكر وتقدير رسمي',
          'م.و/1092',
          '2023/11/05',
          'أحمد علي حسين الخفاجي',
          'قسم وقاية المزروعات',
          `إلى / السيد <span class="employee-highlight">أحمد علي حسين الخفاجي</span> المحترم<br>
          العنوان: رئيس مهندسين زراعيين - مديرية زراعة بابل<br><br>
          نظراً للجهود المتميزة والمخلصة المبذولة من قبلكم في إنجاح الحملة الاستباقية لمكافحة حشرة سوسة النخيل الحمراء وحماية بساتين محافظة بابل لعام 2023، وحرصكم الدؤوب على صيانة الثروة الزراعية الوطنية.<br><br>
          لا يسعنا إلا أن نتقدم إليكم بوافر <strong>الشكر والتقدير</strong>، متمنين لكم دوام التوفيق والنجاح خدمة لعراقنا العزيز.<br><br>
          <em>* يُمنح المذكور قدماً لمدة (شهر واحد) لأغراض العلاوة والترفيع استناداً لأحكام قانون انضباط موظفي الدولة رقم 14 لسنة 1991 المعدل.</em>`
        ),
        notes: 'يترتب عليه قدم وظيفي مدة شهر واحد'
      },
      {
        docId: 1003,
        title: 'البطاقة الوطنية الموحدة وبطاقة السكن المعتمدة',
        category: 'identity',
        orderNumber: 'ثبوتية/8834',
        issueDate: '2022-06-12',
        uploadDate: '2022-07-01',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '518 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'خلاصة القيد والمستمسكات الثبوتية الرسمية',
          'ثبوتية/8834',
          '2022/06/12',
          'أحمد علي حسين الخفاجي',
          'شعبة الشؤون الإدارية',
          `تأييد صحة صدور ومطابقة البيانات المدنية للموظف المذكور:<br><br>
          • <strong>الاسم الكامل:</strong> أحمد علي حسين علوان الخفاجي<br>
          • <strong>رقم البطاقة الوطنية الموحدة:</strong> 198421049281<br>
          • <strong>جهة الإصدار:</strong> دائرة أحوال الحلة المركزية<br>
          • <strong>محل وتاريخ التولد:</strong> بابل - 1984/03/12<br>
          • <strong>بطاقة السكن:</strong> مكتب معلومات الحلة - رقم الاستمارة: 772194<br>
          • <strong>الحالة الاجتماعية:</strong> متزوج ولديه أربعة أطفال.<br><br>
          تم تدقيق الوثائق ومطابقتها مع الأصول المحفوظة في الإضبارة الأساسية.`
        ),
        notes: 'مستمسكات رسمية سارية المفعول ومحدثة'
      },
      {
        docId: 1004,
        title: 'الأمر الإداري بالعلاوة السنوية لعام 2024',
        category: 'promotions',
        orderNumber: 'ع.س/319',
        issueDate: '2024-04-10',
        uploadDate: '2024-04-12',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '290 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر إداري بمنح العلاوة السنوية',
          'ع.س/319',
          '2024/04/10',
          'أحمد علي حسين الخفاجي',
          'قسم وقاية المزروعات',
          `استناداً إلى أحكام المادة (3) من قانون رواتب موظفي الدولة والقطاع العام رقم (22) لسنة 2008 المعدل.<br><br>
          <strong>تقرر:</strong><br>
          منح السيد <span class="employee-highlight">أحمد علي حسين الخفاجي</span> رئيس مهندسين زراعيين العلاوة السنوية المقررة ونقله من المرحلة الثالثة إلى المرحلة الرابعة ضمن الدرجة الثانية لاستيفائه الشروط القانونية وحصوله على تقييم كفاءة بدرجة (امتياز).`
        ),
        notes: 'تمت مصادقة ديوان المديرية'
      }
    ]
  },
  {
    id: 102,
    empNumber: 'EMP-61204',
    nationalId: '199042918231',
    name: 'زينب كمال عبد الحسين المعموري',
    title: 'ملاحظ فني أقدم',
    dept: 'شعبة الأراضي والتأجير',
    grade: 'الدرجة الخامسة (ملاحظ فني)',
    stage: 'المرحلة 2',
    hireDate: '2013-09-01',
    status: 'active',
    phone: '07719876543',
    email: 'zainab.kamal@babil-agri.gov.iq',
    notes: 'عضو اللجنة الدائمية لتدقيق عقود الأراضي الزراعية وقوانين الإصلاح الزراعي 117 و35.',
    avatarColor: 'from-amber-600 to-yellow-800',
    createdAt: '2024-01-12',
    docs: [
      {
        docId: 2001,
        title: 'الأمر الإداري بالتعيين والمباشرة في شعبة الأراضي',
        category: 'orders',
        orderNumber: 'أ.إ/2180',
        issueDate: '2013-09-01',
        uploadDate: '2022-01-15',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '345 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر إداري بالمباشرة الرسمية',
          'أ.إ/2180',
          '2013/09/01',
          'زينب كمال عبد الحسين المعموري',
          'شعبة الأراضي والتأجير',
          `نظراً لصدور الأمر الوزاري المرقم (8901) الخاص بتعيين خريجي المعاهد والجامعات.<br><br>
          باشرت السيدة <span class="employee-highlight">زينب كمال عبد الحسين المعموري</span> مهام عملها الوظيفي في مديرية زراعة بابل / شعبة الأراضي والتأجير اعتباراً من 2013/09/01، وتتحمل الجهات المختصة تسوية استحقاقاتها وفق التعليمات.`
        ),
        notes: 'وثيقة التعيين الأصلية'
      },
      {
        docId: 2002,
        title: 'وثيقة التخرج والأمر الجامعي الصادر من المعهد التقني / قسم المساحة والزراعة',
        category: 'identity',
        orderNumber: 'ج.ف/4412',
        issueDate: '2012-07-20',
        uploadDate: '2022-01-15',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '430 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'صحة صدور الوثيقة الدراسية والأمر الجامعي',
          'ج.ف/4412',
          '2012/07/20',
          'زينب كمال عبد الحسين المعموري',
          'شعبة الشؤون الإدارية',
          `إلى / مديرية زراعة بابل - قسم الموارد البشرية<br><br>
          نؤيد لكم صحة صدور وثيقة تخرج الطالبة <span class="employee-highlight">زينب كمال عبد الحسين</span> للعام الدراسي 2011/2012 بتقدير (جيد جداً)، والصادرة بموجب الأمر الجامعي ذي العدد 4412، وقد دُققت من قبل لجان التدقيق المختصة.`
        ),
        notes: 'شهادة دراسية مدققة وصادرة رسمياً'
      },
      {
        docId: 2003,
        title: 'أمر تكليف بلجنة تدقيق وتمليك العقارات الزراعية المقاطعة 17 الحلة',
        category: 'assignments',
        orderNumber: 'ل.ت/612',
        issueDate: '2023-08-14',
        uploadDate: '2023-08-15',
        archivedBy: 'شعبة الأرشفة الإلكترونية',
        fileSize: '298 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر إداري بتشكيل لجنة تدقيق عقود الأراضي',
          'ل.ت/612',
          '2023/08/14',
          'زينب كمال عبد الحسين المعموري',
          'شعبة الأراضي والتأجير',
          `استناداً إلى توجيهات وزارة الزراعة بشأن حسم ملفات العقود الزراعية المشمولة بالقانون 35 لسنة 1983.<br><br>
          <strong>تقرر:</strong><br>
          تكليف السيدة <span class="employee-highlight">زينب كمال عبد الحسين</span> بعضوية لجنة الكشف الموقعي وتدقيق المساحات المشمولة بالتأجير والتمليك في قضاء الحلة ومتابعة خرائط المقاطعات مع مديرية التسجيل العقاري في بابل.`
        ),
        notes: 'مهمة تفتيش ومطابقة عقارية'
      }
    ]
  },
  {
    id: 103,
    empNumber: 'EMP-43890',
    nationalId: '197931084729',
    name: 'د. حيدر جاسم محمد الجبوري',
    title: 'رئيس بحوث زراعية أقدم',
    dept: 'قسم الثروة والإنتاج الحيواني',
    grade: 'الدرجة الثالثة (رئيس بحوث)',
    stage: 'المرحلة 5',
    hireDate: '2005-11-20',
    status: 'active',
    phone: '07812349988',
    email: 'hayder.jasim@babil-agri.gov.iq',
    notes: 'حاصل على شهادة الدكتوراه في الإنتاج الحيواني، المشرف العلمي على محطات التلقيح الاصطناعي وتربية الأبقار المحسنة.',
    avatarColor: 'from-emerald-700 to-teal-900',
    createdAt: '2024-01-14',
    docs: [
      {
        docId: 3001,
        title: 'الأمر الوزاري باحتساب الشهادة العليا (الدكتوراه) وتعديل العنوان الوظيفي',
        category: 'promotions',
        orderNumber: 'د.ع/1109',
        issueDate: '2019-03-25',
        uploadDate: '2022-01-16',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '480 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر وزاري باحتساب الشهادة الدراسية العليا',
          'د.ع/1109',
          '2019/03/25',
          'د. حيدر جاسم محمد الجبوري',
          'قسم الثروة والإنتاج الحيواني',
          `استناداً إلى أحكام قانون أسس تعادل الشهادات والدرجات العلمية والتعليمات الوزارية الصادرة بموجبه.<br><br>
          تقرر احتساب شهادة (الدكتوراه في علوم الإنتاج الحيواني) الحاصل عليها السيد <span class="employee-highlight">د. حيدر جاسم محمد الجبوري</span> من كلية الزراعة - جامعة بغداد، وتعديل عنوانه الوظيفي إلى (رئيس بحوث زراعية) مع منحه كافة الامتيازات والمخصصات المهنية المقررة قانوناً.`
        ),
        notes: 'احتساب شهادة الدكتوراه رسمياً'
      },
      {
        docId: 3002,
        title: 'كتاب شكر وتقدير من السيد محافظ بابل - مشروع تطوير سلالات الأبقار',
        category: 'rewards',
        orderNumber: 'محافظة/4481',
        issueDate: '2023-05-18',
        uploadDate: '2023-05-20',
        archivedBy: 'أرشفة الموارد البشرية',
        fileSize: '365 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'كتاب شكر وتقدير من ديوان محافظة بابل',
          'محافظة/4481',
          '2023/05/18',
          'د. حيدر جاسم محمد الجبوري',
          'قسم الثروة والإنتاج الحيواني',
          `إلى / الدكتور <span class="employee-highlight">حيدر جاسم محمد الجبوري</span> المحترم<br>
          مديرية زراعة بابل - قسم الإنتاج الحيواني<br><br>
          تثميناً لجهودكم القيمة والمتميزة في إدارة المشروع الريادي لتطوير وتحسين سلالات الأبقار والجاموس في أقضية ونواحي المحافظة، وتقديمكم الاستشارات العلمية المجانية لمربي الثروة الحيوانية.<br><br>
          يسرنا أن نعرب عن بالغ <strong>شكرنا وتقديرنا</strong> لجهودكم المخلصة متمنين لكم التوفيق والسداد في خدمة وطننا ومحافظتنا العزيزة.`
        ),
        notes: 'شكر وتقدير من السيد المحافظ'
      }
    ]
  },
  {
    id: 104,
    empNumber: 'EMP-90214',
    nationalId: '199583019482',
    name: 'فاطمة عمار كاظم السلطاني',
    title: 'مبرمج أقدم',
    dept: 'شعبة تكنولوجيا المعلومات والأرشفة',
    grade: 'الدرجة الخامسة (مبرمج)',
    stage: 'المرحلة 3',
    hireDate: '2018-02-10',
    status: 'active',
    phone: '07703344556',
    email: 'fatima.ammar@babil-agri.gov.iq',
    notes: 'مسؤولة إدارة قاعدة البيانات المركزية وشبكة الاتصالات والأرشفة الإلكترونية في المديرية.',
    avatarColor: 'from-rose-600 to-pink-800',
    createdAt: '2024-02-01',
    docs: [
      {
        docId: 4001,
        title: 'أمر إداري بتكليف إدارة منظومة الأرشفة الإلكترونية الرقمية',
        category: 'assignments',
        orderNumber: 'ت.م/551',
        issueDate: '2022-10-12',
        uploadDate: '2022-10-14',
        archivedBy: 'شعبة تكنولوجيا المعلومات',
        fileSize: '315 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'أمر إداري بإدارة المنظومة الإلكترونية للأرشفة',
          'ت.م/551',
          '2022/10/12',
          'فاطمة عمار كاظم السلطاني',
          'شعبة تكنولوجيا المعلومات والأرشفة',
          `بناءً على التوجه الحكومي نحو التحول الرقمي وحوكمة إدارة الوثائق والمستندات الرسمية.<br><br>
          <strong>تقرر:</strong><br>
          تخويل السيدة <span class="employee-highlight">فاطمة عمار كاظم السلطاني</span> مهام الإشراف البرمجي وإدارة صلاحيات المستخدمين والنسخ الاحتياطي لمنظومة أرشفة اضابير موظفي مديرية زراعة بابل، والتأكد من سرية وحماية البيانات المؤرشفة.`
        ),
        notes: 'تكليف إداري رسمي بحماية الأرشيف'
      }
    ]
  },
  {
    id: 105,
    empNumber: 'EMP-32095',
    nationalId: '198112093845',
    name: 'حسين صادق نعمة المسعودي',
    title: 'رئيس ملاحظين قانوني',
    dept: 'شعبة الشؤون القانونية والعقود',
    grade: 'الدرجة الرابعة (مشاور قانوني)',
    stage: 'المرحلة 2',
    hireDate: '2007-06-18',
    status: 'active',
    phone: '07809988776',
    email: 'hussain.sadiq@babil-agri.gov.iq',
    notes: 'ممثل المديرية أمام محاكم بابل واللجان التحقيقية الوزارية.',
    avatarColor: 'from-slate-700 to-slate-900',
    createdAt: '2024-02-05',
    docs: [
      {
        docId: 5001,
        title: 'أمر وكالة وتفويض قانوني للمرافعة أمام المحاكم واللجان القضائية',
        category: 'orders',
        orderNumber: 'ق.و/882',
        issueDate: '2023-01-10',
        uploadDate: '2023-01-12',
        archivedBy: 'شعبة الشؤون القانونية',
        fileSize: '390 KB',
        fileType: 'text',
        data: generateOfficialDocumentDataUrl(
          'وكالة وتفويض بالمرافعة القانونية',
          'ق.و/882',
          '2023/01/10',
          'حسين صادق نعمة المسعودي',
          'شعبة الشؤون القانونية والعقود',
          `نحن مدير عام مديرية زراعة بابل إضافة لوظيفتنا، قد وكّلنا وفوضنا المشاور القانوني السيد <span class="employee-highlight">حسين صادق نعمة المسعودي</span> بتمثيل المديرية والمرافعة والمدافعة في سائر الدعاوى المقامة منها أو عليها أمام كافة المحاكم العراقية واللجان التحكيمية وقضايا النزاعات الزراعية.`
        ),
        notes: 'وكالة قانونية معتمدة سنوياً'
      }
    ]
  }
];
