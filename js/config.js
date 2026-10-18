/* ============================================================
   config.js — إعدادات المتجر (هذا الملف هو الذي تعدّله غالباً)
   عدّل هنا: رقم واتساب، العنوان، المناطق، المنتجات والأسعار، إعدادات الفاتورة

   دليل الرموز المستخدمة في التعليقات داخل كل ملفات المشروع:
     [كما كان]  = كود موجود من قبل ولم أغيّره
     [معدّل]    = كود موجود وغيّرته (مكتوب بجانبه ما الذي تغيّر)
     [جديد]     = كود أضفته أنا في هذه النسخة
   ============================================================ */
window.STORE_CONFIG = {

  /* ---------- [كما كان] بيانات المتجر الأساسية: الاسم والشعار والشريط العلوي ---------- */
  name: "EBRAHIM STORE",
  tagline: "كل ما يحتاجه هاتفك، في مكان واحد.",
  topBar: "تسوق إكسسوارات هاتفك بسهولة مع EBRAHIM STORE",

  /* ---------- [كما كان] التواصل: واتساب والهاتف والعنوان والسوشيال ---------- */
  // رقم واتساب بالصيغة الدولية بدون + أو أصفار (ليبيا = 218)
  // مثال: 0912345678  ->  218912345678   (غيّر الرقم أدناه برقمك الفعلي)
  whatsapp: "0927000560",
  phoneDisplay: "0927000560",
  address: "صبراتة، ليبيا",          // اكتب عنوان المحل بالتفصيل
  social: { facebook: "", instagram: "" }, // ضع الروابط الحقيقية أو اتركها فارغة

  /* ---------- [كما كان] سياسة التوصيل المجاني ---------- */
  // توصيل مجاني عند بلوغ هذا المبلغ (بالدينار). 0 = معطّل. فعّله فقط إذا كان هذا فعلاً سياسة المتجر.
  freeDeliveryFrom: 0,

  /* ---------- [كما كان] مختارات المتجر (تظهر في الصفحة الرئيسية) ---------- */
  // مختارات المتجر: أرقام المنتجات التي تريد إبرازها في أعلى الصفحة (اختيارك أنت، وليست "الأكثر مبيعاً")
  featuredIds: [1, 5, 8, 10],

  /* ---------- [كما كان] جملة الثقة والمعلومات الرسمية (تظهر في أسفل كل صفحة) ---------- */
  // اختياري: جملة تعبّر عن وعد متجرك (اكتب فقط ما تلتزم به فعلاً)، ومعلومات رسمية إن رغبت (مثل رقم السجل التجاري)
  trustLine: "",
  commercialInfo: "",

  /* ---------- [كما كان] آراء العملاء (القسم يظهر في الصفحة الرئيسية فقط إذا أضفت رأياً) ---------- */
  // آراء عملاء حقيقية فقط. أضفها هكذا: { name: "اسم العميل", text: "نص رأيه كما كتبه" }
  // إذا بقيت فارغة لن يظهر القسم.
  reviews: [],

  /* ---------- [كما كان] العملة وبادئة رقم الطلب ---------- */
  currencyLabel: "د.ل",
  orderPrefix: "NOVA",

  /* ---------- [جديد] إعدادات الفاتورة (تظهر عند الضغط على «اشترِ الآن» أو بعد إرسال الطلب) ----------
     title  : عنوان الفاتورة في أعلاها
     prefix : بادئة رقم الفاتورة، مثال: INV-2026-00001
     footer : الجملة التي تظهر أسفل الفاتورة (شكر أو سياسة الاستبدال)
     note   : ملاحظة إضافية تُطبع تحت الفاتورة (اتركها فارغة إن لم تحتجها)
     taxNo  : رقم السجل التجاري/الضريبي ليظهر في الفاتورة (اختياري) */
  invoice: {
    title: "فاتورة بيع",
    prefix: "INV",
    footer: "شكراً لثقتكم بنا — نتمنى لكم تجربة سعيدة",
    note: "",
    taxNo: ""
  },

  /* ---------- [جديد] عدد المنتجات الذي يظهر في صفحة التصنيف قبل زر «عرض المزيد» ---------- */
  productsPerPage: 12,

  /* ---------- [جديد] عنوان القائمة الجانبية (أنواع المنتجات) ---------- */
  sidebarTitle: "أنواع المنتجات",

  /* ---------- [كما كان] مناطق التوصيل ورسومها ---------- */
  // مناطق التوصيل ورسومها (بالدينار) — عدّلها حسب واقعك
  deliveryAreas: [
    { name: "صبراتة - وسط المدينة", fee: 10 },
    { name: "صبراتة - الأطراف",     fee: 15 },
    { name: "صرمان",                 fee: 25 },
    { name: "الزاوية",               fee: 30 }
  ],

  /* ---------- [كما كان] أنواع المنتجات (هي نفسها القائمة الجانبية على اليسار) ----------
     id   : رمز إنجليزي قصير يُكتب في cat داخل المنتج
     icon : إيموجي يظهر بجانب الاسم
     name : الاسم الظاهر
     لإضافة نوع جديد: أضف سطراً هنا ثم اكتب نفس id في حقل cat للمنتجات. يظهر تلقائياً في القائمة الجانبية وله صفحته. */
  categories: [
    { id: "iphone", icon: "📱", name: "إكسسوارات آيفون" },
    { id: "samsung", icon: "📲", name: "إكسسوارات سامسونج" },
    { id: "charger", icon: "🔌", name: "الشواحن والكيابل" },
    { id: "audio", icon: "🎧", name: "السماعات" },
    { id: "power", icon: "🔋", name: "الباور بانك" },
    { id: "holders", icon: "🚗", name: "الحوامل" }
  ],

  /* ---------- [كما كان] المنتجات ----------
     [جديد] حقل اختياري specs: { "الخامة": "سيليكون", "اللون": "أسود" } يظهر كجدول مواصفات في صفحة المنتج
     [جديد] كل منتج له الآن صفحة خاصة: product.html?id=رقم_المنتج
     المنتجات — أسعار ومخزون تجريبية، استبدلها بالحقيقية
     image: "images/اسم-الصورة.jpg" (اختياري). بدونها يظهر emoji.
     models: موديلات الهواتف المتوافقة (فارغة = عام)
     oldPrice: السعر السابق (ضعه فقط عند وجود خصم فعلي)
     stock: الكمية المتوفرة، 0 = غير متوفر
     isNew: true لإظهار شارة "جديد"                           */
  products: [
    { id: 1,  name: "غطاء سيليكون آيفون 15",       cat: "iphone",  brand: "Apple",   price: 35,  stock: 12, emoji: "📱", models: ["iPhone 15"], isNew: true,  desc: "غطاء سيليكون ناعم يحمي الجهاز من الخدوش والسقوط الخفيف." },
    { id: 2,  name: "واقي شاشة زجاج آيفون 14",     cat: "iphone",  brand: "Generic", price: 20,  stock: 30, emoji: "🛡️", models: ["iPhone 14"], desc: "زجاج مقوى بسماكة 9H مع ملصق تركيب." },
    { id: 3,  name: "غطاء شفاف سامسونج S24",        cat: "samsung", brand: "Samsung", price: 30,  oldPrice: 40, stock: 8, emoji: "📱", models: ["Galaxy S24"], desc: "غطاء شفاف بحواف مرتفعة لحماية الكاميرا." },
    { id: 4,  name: "واقي شاشة سامسونج A54",       cat: "samsung", brand: "Generic", price: 18,  stock: 25, emoji: "🛡️", models: ["Galaxy A54"], desc: "واقي شاشة مضاد للبصمات." },
    { id: 5,  name: "شاحن سريع 20 واط USB-C",      cat: "charger", brand: "Anker",   price: 55,  stock: 15, emoji: "🔌", models: [], isNew: true, desc: "شاحن حائط بمنفذ USB-C بقدرة 20 واط." },
    { id: 6,  name: "كيبل USB-C إلى Lightning 1م", cat: "charger", brand: "Generic", price: 25,  stock: 40, emoji: "🔗", models: ["iPhone 14","iPhone 15"], desc: "كيبل بطول متر واحد." },
    { id: 7,  name: "كيبل USB-C إلى USB-C 1م",     cat: "charger", brand: "Generic", price: 22,  stock: 0,  emoji: "🔗", models: [], desc: "كيبل بطول متر واحد." },
    { id: 8,  name: "سماعات بلوتوث لاسلكية",       cat: "audio",   brand: "Generic", price: 85,  oldPrice: 110, stock: 10, emoji: "🎧", models: [], desc: "سماعات أذن لاسلكية مع علبة شحن." },
    { id: 9,  name: "سماعة سلكية بميكروفون",       cat: "audio",   brand: "Generic", price: 15,  stock: 50, emoji: "🎧", models: [], desc: "سماعة أذن بمنفذ 3.5 ملم وميكروفون." },
    { id: 10, name: "باور بانك 10000 مللي أمبير",   cat: "power",   brand: "Anker",   price: 120, stock: 6,  emoji: "🔋", models: [], isNew: true, desc: "بطارية خارجية بمنفذين USB." },
    { id: 11, name: "باور بانك 20000 مللي أمبير",   cat: "power",   brand: "Generic", price: 180, stock: 4,  emoji: "🔋", models: [], desc: "سعة كبيرة تكفي لعدة شحنات." },
    { id: 12, name: "حامل هاتف للسيارة",           cat: "holders", brand: "Generic", price: 28,  stock: 20, emoji: "🚗", models: [], desc: "حامل بتثبيت على فتحة التكييف." },
    /* ---------- [جديد] منتجات آيفون (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 13, name: "غطاء سيليكون آيفون 16", cat: "iphone", brand: "Apple", price: 40, stock: 14, emoji: "📱", models: ["iPhone 16"], isNew: true, desc: "غطاء سيليكون ناعم بتشطيب مطفي وحواف تحمي الكاميرا." },
    { id: 14, name: "غطاء سيليكون آيفون 14", cat: "iphone", brand: "Generic", price: 30, stock: 22, emoji: "📱", models: ["iPhone 14"], desc: "غطاء سيليكون مرن بملمس ناعم يمنع الانزلاق." },
    { id: 15, name: "غطاء سيليكون آيفون 13", cat: "iphone", brand: "Generic", price: 28, stock: 18, emoji: "📱", models: ["iPhone 13"], desc: "غطاء سيليكون خفيف يحمي الجهاز من الخدوش." },
    { id: 16, name: "غطاء سيليكون آيفون 12", cat: "iphone", brand: "Generic", price: 25, oldPrice: 32, stock: 20, emoji: "📱", models: ["iPhone 12"], desc: "غطاء سيليكون بتصميم رفيع." },
    { id: 17, name: "غطاء شفاف آيفون 15", cat: "iphone", brand: "Generic", price: 25, stock: 30, emoji: "📱", models: ["iPhone 15"], desc: "غطاء شفاف مقاوم للاصفرار بحواف مرتفعة." },
    { id: 18, name: "غطاء شفاف آيفون 14", cat: "iphone", brand: "Generic", price: 22, stock: 26, emoji: "📱", models: ["iPhone 14"], desc: "غطاء شفاف رفيع يُظهر لون الهاتف." },
    { id: 19, name: "غطاء مضاد للصدمات آيفون 15 برو", cat: "iphone", brand: "Generic", price: 45, stock: 9, emoji: "🛡️", models: ["iPhone 15 Pro"], isNew: true, desc: "طبقتان لامتصاص الصدمات مع زوايا معززة." },
    { id: 20, name: "غطاء جلد آيفون 15 برو ماكس", cat: "iphone", brand: "Generic", price: 60, stock: 7, emoji: "📱", models: ["iPhone 15 Pro Max"], desc: "غطاء بملمس الجلد وحواف ناعمة." },
    { id: 21, name: "غطاء مغناطيسي آيفون 15 يدعم الشحن اللاسلكي", cat: "iphone", brand: "Baseus", price: 65, stock: 10, emoji: "🧲", models: ["iPhone 15"], isNew: true, desc: "حلقة مغناطيسية تدعم الحوامل والشواحن المغناطيسية." },
    { id: 22, name: "غطاء مغناطيسي آيفون 14 برو", cat: "iphone", brand: "Baseus", price: 60, stock: 6, emoji: "🧲", models: ["iPhone 14 Pro"], desc: "غطاء بحلقة مغناطيسية وحماية للكاميرا." },
    { id: 23, name: "غطاء محفظة آيفون 11", cat: "iphone", brand: "Generic", price: 40, stock: 5, emoji: "👛", models: ["iPhone 11"], desc: "غطاء بجيب للبطاقات وحامل قابل للطي." },
    { id: 24, name: "واقي شاشة زجاج آيفون 16", cat: "iphone", brand: "Generic", price: 25, stock: 40, emoji: "🛡️", models: ["iPhone 16"], isNew: true, desc: "زجاج مقوى 9H مع إطار مساعد للتركيب." },
    { id: 25, name: "واقي شاشة زجاج آيفون 15", cat: "iphone", brand: "Generic", price: 20, stock: 35, emoji: "🛡️", models: ["iPhone 15"], desc: "زجاج مقوى مضاد للخدوش والبصمات." },
    { id: 26, name: "واقي شاشة زجاج آيفون 13", cat: "iphone", brand: "Generic", price: 18, stock: 28, emoji: "🛡️", models: ["iPhone 13"], desc: "زجاج مقوى شفاف بسماكة 9H." },
    { id: 27, name: "واقي خصوصية آيفون 14 برو", cat: "iphone", brand: "Generic", price: 35, stock: 12, emoji: "🕶️", models: ["iPhone 14 Pro"], desc: "يمنع رؤية الشاشة من الجانبين." },
    { id: 28, name: "واقي عدسة الكاميرا آيفون 15 برو", cat: "iphone", brand: "Generic", price: 15, stock: 0, emoji: "📷", models: ["iPhone 15 Pro"], desc: "زجاج شفاف لحماية عدسات الكاميرا الثلاث." },

    /* ---------- [جديد] منتجات سامسونج (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 29, name: "غطاء سيليكون سامسونج S24 ألترا", cat: "samsung", brand: "Samsung", price: 45, stock: 11, emoji: "📱", models: ["Galaxy S24 Ultra"], isNew: true, desc: "غطاء سيليكون ناعم متوافق مع القلم." },
    { id: 30, name: "غطاء شفاف سامسونج S23", cat: "samsung", brand: "Generic", price: 25, stock: 20, emoji: "📱", models: ["Galaxy S23"], desc: "غطاء شفاف بحواف مرتفعة." },
    { id: 31, name: "غطاء مضاد للصدمات سامسونج S24 بلس", cat: "samsung", brand: "Generic", price: 40, stock: 8, emoji: "🛡️", models: ["Galaxy S24+"], desc: "حماية مزدوجة الطبقات مع حواف للكاميرا." },
    { id: 32, name: "غطاء سيليكون سامسونج A54", cat: "samsung", brand: "Generic", price: 20, stock: 24, emoji: "📱", models: ["Galaxy A54"], desc: "غطاء سيليكون مرن يحمي الجهاز." },
    { id: 33, name: "غطاء شفاف سامسونج A34", cat: "samsung", brand: "Generic", price: 18, stock: 22, emoji: "📱", models: ["Galaxy A34"], desc: "غطاء شفاف رفيع." },
    { id: 34, name: "غطاء مضاد للصدمات سامسونج A15", cat: "samsung", brand: "Generic", price: 22, stock: 18, emoji: "🛡️", models: ["Galaxy A15"], isNew: true, desc: "زوايا معززة وحماية للشاشة." },
    { id: 35, name: "غطاء محفظة سامسونج A25", cat: "samsung", brand: "Generic", price: 30, stock: 9, emoji: "👛", models: ["Galaxy A25"], desc: "غطاء بجيب للبطاقات وحامل." },
    { id: 36, name: "غطاء سيليكون سامسونج A35", cat: "samsung", brand: "Generic", price: 22, stock: 15, emoji: "📱", models: ["Galaxy A35"], isNew: true, desc: "غطاء سيليكون بملمس ناعم." },
    { id: 37, name: "غطاء جلد سامسونج S24", cat: "samsung", brand: "Generic", price: 50, oldPrice: 60, stock: 6, emoji: "📱", models: ["Galaxy S24"], desc: "غطاء بملمس الجلد." },
    { id: 38, name: "واقي شاشة زجاج سامسونج S24", cat: "samsung", brand: "Generic", price: 20, stock: 30, emoji: "🛡️", models: ["Galaxy S24"], desc: "زجاج مقوى 9H." },
    { id: 39, name: "واقي شاشة سامسونج S23", cat: "samsung", brand: "Generic", price: 20, stock: 26, emoji: "🛡️", models: ["Galaxy S23"], desc: "زجاج مقوى مضاد للخدوش." },
    { id: 40, name: "واقي شاشة سامسونج A34", cat: "samsung", brand: "Generic", price: 15, stock: 32, emoji: "🛡️", models: ["Galaxy A34"], desc: "واقي زجاجي شفاف." },
    { id: 41, name: "واقي شاشة سامسونج A15", cat: "samsung", brand: "Generic", price: 14, stock: 40, emoji: "🛡️", models: ["Galaxy A15"], desc: "واقي زجاجي مقوى." },
    { id: 42, name: "واقي شاشة سامسونج A35", cat: "samsung", brand: "Generic", price: 15, stock: 28, emoji: "🛡️", models: ["Galaxy A35"], isNew: true, desc: "واقي زجاجي مقوى." },
    { id: 43, name: "واقي شاشة خصوصية سامسونج S24 ألترا", cat: "samsung", brand: "Generic", price: 38, stock: 0, emoji: "🕶️", models: ["Galaxy S24 Ultra"], desc: "يمنع رؤية الشاشة من الجانبين." },
    { id: 44, name: "واقي عدسة الكاميرا سامسونج S24 ألترا", cat: "samsung", brand: "Generic", price: 15, stock: 14, emoji: "📷", models: ["Galaxy S24 Ultra"], desc: "حماية لعدسات الكاميرا الخلفية." },

    /* ---------- [جديد] منتجات الشواحن والكيابل (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 45, name: "شاحن سريع 25 واط USB-C", cat: "charger", brand: "Samsung", price: 45, stock: 20, emoji: "🔌", models: [], desc: "شاحن حائط سريع بمنفذ USB-C بقدرة 25 واط." },
    { id: 46, name: "شاحن سريع 35 واط بمنفذين", cat: "charger", brand: "Anker", price: 85, stock: 12, emoji: "🔌", models: [], isNew: true, desc: "منفذان USB-C لشحن جهازين معاً." },
    { id: 47, name: "شاحن GaN بقدرة 65 واط", cat: "charger", brand: "Baseus", price: 140, oldPrice: 165, stock: 6, emoji: "🔌", models: [], desc: "شاحن صغير يكفي للهاتف واللابتوب." },
    { id: 48, name: "شاحن سريع 30 واط", cat: "charger", brand: "Generic", price: 50, stock: 18, emoji: "🔌", models: [], desc: "شاحن حائط سريع بمنفذ USB-C." },
    { id: 49, name: "شاحن مكتبي 3 منافذ", cat: "charger", brand: "Generic", price: 60, stock: 10, emoji: "🔌", models: [], desc: "ثلاثة منافذ USB لشحن عدة أجهزة." },
    { id: 50, name: "شاحن سيارة بمنفذين", cat: "charger", brand: "Generic", price: 30, stock: 25, emoji: "🚗", models: [], desc: "منفذان USB لشحن جهازين في السيارة." },
    { id: 51, name: "شاحن سيارة سريع 45 واط", cat: "charger", brand: "Baseus", price: 70, stock: 8, emoji: "🚗", models: [], isNew: true, desc: "شاحن سيارة سريع بمنفذ USB-C ومنفذ USB." },
    { id: 52, name: "شاحن لاسلكي 15 واط", cat: "charger", brand: "Generic", price: 55, stock: 14, emoji: "🔋", models: [], desc: "قاعدة شحن لاسلكي مع مؤشر ضوئي." },
    { id: 53, name: "شاحن لاسلكي مغناطيسي", cat: "charger", brand: "Generic", price: 75, stock: 9, emoji: "🧲", models: ["iPhone 14", "iPhone 15", "iPhone 16"], desc: "شاحن لاسلكي مغناطيسي يتثبت خلف الهاتف." },
    { id: 54, name: "كيبل USB-C إلى USB-C 2م", cat: "charger", brand: "Generic", price: 30, stock: 35, emoji: "🔗", models: [], desc: "كيبل بطول مترين." },
    { id: 55, name: "كيبل USB-C إلى Lightning 2م", cat: "charger", brand: "Generic", price: 35, stock: 22, emoji: "🔗", models: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14"], desc: "كيبل بطول مترين للشحن ونقل البيانات." },
    { id: 56, name: "كيبل Lightning إلى USB-A 1م", cat: "charger", brand: "Generic", price: 20, stock: 30, emoji: "🔗", models: ["iPhone 11", "iPhone 12"], desc: "كيبل بطول متر واحد." },
    { id: 57, name: "كيبل مجدول USB-C 1.5م", cat: "charger", brand: "Baseus", price: 32, stock: 28, emoji: "🔗", models: [], desc: "كيبل مجدول متين يقاوم التلف." },
    { id: 58, name: "كيبل Micro USB 1م", cat: "charger", brand: "Generic", price: 12, stock: 45, emoji: "🔗", models: [], desc: "كيبل للأجهزة ذات منفذ Micro USB." },
    { id: 59, name: "كيبل 3 في 1 (USB-C / Lightning / Micro)", cat: "charger", brand: "Generic", price: 28, stock: 25, emoji: "🔗", models: [], desc: "كيبل واحد بثلاثة رؤوس." },
    { id: 60, name: "كيبل شحن سريع 100 واط 1م", cat: "charger", brand: "Anker", price: 55, stock: 12, emoji: "🔗", models: [], isNew: true, desc: "يدعم الشحن السريع حتى 100 واط." },
    { id: 61, name: "كيبل مغناطيسي بثلاثة رؤوس", cat: "charger", brand: "Generic", price: 30, stock: 16, emoji: "🧲", models: [], desc: "رؤوس مغناطيسية قابلة للتبديل." },
    { id: 62, name: "محول OTG من USB-C", cat: "charger", brand: "Generic", price: 10, stock: 50, emoji: "🔌", models: [], desc: "لتوصيل فلاشة أو ماوس بالهاتف." },
    { id: 63, name: "محول Lightning إلى منفذ سماعة 3.5 ملم", cat: "charger", brand: "Generic", price: 18, stock: 0, emoji: "🎧", models: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14"], desc: "يتيح استعمال السماعات السلكية." },
    { id: 64, name: "وصلة USB-C متعددة المنافذ", cat: "charger", brand: "Generic", price: 65, stock: 7, emoji: "🔌", models: [], desc: "منافذ USB وHDMI وقارئ بطاقات في وصلة واحدة." },

    /* ---------- [جديد] منتجات السماعات (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 65, name: "سماعات لاسلكية TWS بعلبة شحن", cat: "audio", brand: "Generic", price: 70, stock: 20, emoji: "🎧", models: [], isNew: true, desc: "سماعات أذن لاسلكية مع علبة شحن." },
    { id: 66, name: "سماعة رأس بلوتوث فوق الأذن", cat: "audio", brand: "Generic", price: 95, stock: 9, emoji: "🎧", models: [], desc: "سماعة بوسادة مريحة وبطارية طويلة." },
    { id: 67, name: "سماعة رياضية لاسلكية", cat: "audio", brand: "Generic", price: 60, oldPrice: 75, stock: 13, emoji: "🎧", models: [], desc: "خفيفة وثابتة أثناء الحركة." },
    { id: 68, name: "سماعة سلكية USB-C بميكروفون", cat: "audio", brand: "Generic", price: 20, stock: 35, emoji: "🎧", models: [], desc: "سماعة أذن بمنفذ USB-C." },
    { id: 69, name: "سماعة سلكية Lightning", cat: "audio", brand: "Generic", price: 25, stock: 18, emoji: "🎧", models: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14"], desc: "سماعة أذن بمنفذ Lightning." },
    { id: 70, name: "سماعة ألعاب بميكروفون", cat: "audio", brand: "Generic", price: 90, stock: 8, emoji: "🎮", models: [], desc: "سماعة رأس للألعاب بميكروفون قابل للتعديل." },
    { id: 71, name: "سماعة عنق لاسلكية", cat: "audio", brand: "Generic", price: 45, stock: 15, emoji: "🎧", models: [], desc: "سماعة بحلقة عنق مريحة." },
    { id: 72, name: "سماعة بلوتوث أحادية للسيارة", cat: "audio", brand: "Generic", price: 30, stock: 22, emoji: "🚗", models: [], desc: "سماعة أذن واحدة لمكالمات القيادة." },
    { id: 73, name: "مكبر صوت بلوتوث صغير", cat: "audio", brand: "Generic", price: 50, stock: 17, emoji: "🔊", models: [], desc: "مكبر محمول بحجم الكف." },
    { id: 74, name: "مكبر صوت بلوتوث مقاوم للرذاذ", cat: "audio", brand: "Generic", price: 110, stock: 6, emoji: "🔊", models: [], isNew: true, desc: "صوت قوي ومقاومة للرذاذ." },
    { id: 75, name: "ميكروفون ياقة لاسلكي", cat: "audio", brand: "Generic", price: 65, stock: 5, emoji: "🎙️", models: [], desc: "ميكروفون صغير للتسجيل والمقابلات." },
    { id: 76, name: "حامل سماعات مكتبي", cat: "audio", brand: "Generic", price: 25, stock: 12, emoji: "🎧", models: [], desc: "حامل لتنظيم السماعات على المكتب." },
    { id: 77, name: "علبة حماية سماعات", cat: "audio", brand: "Generic", price: 12, stock: 30, emoji: "🎧", models: [], desc: "غطاء سيليكون لعلبة السماعات." },
    { id: 78, name: "مقسم سماعة 3.5 ملم", cat: "audio", brand: "Generic", price: 8, stock: 40, emoji: "🔌", models: [], desc: "يتيح لشخصين الاستماع بنفس الجهاز." },

    /* ---------- [جديد] منتجات الباور بانك (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 79, name: "باور بانك 5000 مللي أمبير", cat: "power", brand: "Generic", price: 60, stock: 18, emoji: "🔋", models: [], desc: "بطارية صغيرة خفيفة للجيب." },
    { id: 80, name: "باور بانك رفيع 10000 مللي أمبير", cat: "power", brand: "Generic", price: 95, stock: 14, emoji: "🔋", models: [], desc: "تصميم رفيع بمنفذين." },
    { id: 81, name: "باور بانك 10000 شحن سريع 22.5 واط", cat: "power", brand: "Anker", price: 135, stock: 8, emoji: "🔋", models: [], isNew: true, desc: "شحن سريع بمنفذ USB-C." },
    { id: 82, name: "باور بانك 20000 شحن سريع 22.5 واط", cat: "power", brand: "Anker", price: 190, stock: 5, emoji: "🔋", models: [], desc: "سعة كبيرة وشحن سريع." },
    { id: 83, name: "باور بانك 30000 مللي أمبير", cat: "power", brand: "Generic", price: 230, stock: 4, emoji: "🔋", models: [], desc: "سعة عالية للرحلات الطويلة." },
    { id: 84, name: "باور بانك 20000 بقدرة 65 واط للابتوب", cat: "power", brand: "Baseus", price: 320, oldPrice: 360, stock: 3, emoji: "🔋", models: [], desc: "يشحن الهاتف واللابتوب." },
    { id: 85, name: "باور بانك لاسلكي مغناطيسي 10000", cat: "power", brand: "Generic", price: 150, stock: 7, emoji: "🧲", models: ["iPhone 14", "iPhone 15", "iPhone 16"], isNew: true, desc: "يلتصق خلف الهاتف ويشحن لاسلكياً." },
    { id: 86, name: "باور بانك صغير بحلقة تثبيت", cat: "power", brand: "Generic", price: 70, stock: 11, emoji: "🔋", models: [], desc: "حلقة لتعليقه بالحقيبة أو المفاتيح." },
    { id: 87, name: "باور بانك بكيبل مدمج", cat: "power", brand: "Generic", price: 105, stock: 9, emoji: "🔋", models: [], desc: "كيبل مدمج لا تحتاج حمله." },
    { id: 88, name: "باور بانك شمسي 20000", cat: "power", brand: "Generic", price: 140, stock: 6, emoji: "☀️", models: [], desc: "يمكن شحنه بالطاقة الشمسية عند الطوارئ." },
    { id: 89, name: "باور بانك 50000 مللي أمبير", cat: "power", brand: "Generic", price: 330, stock: 0, emoji: "🔋", models: [], desc: "سعة ضخمة بعدة منافذ." },
    { id: 90, name: "حقيبة حماية للباور بانك", cat: "power", brand: "Generic", price: 15, stock: 25, emoji: "🔋", models: [], desc: "حقيبة صغيرة لحمل الباور بانك والكيبلات." },

    /* ---------- [جديد] منتجات الحوامل (تجريبية: عدّل الأسماء والأسعار والكميات) ---------- */
    { id: 91, name: "حامل هاتف مكتبي قابل للطي", cat: "holders", brand: "Generic", price: 20, stock: 30, emoji: "📱", models: [], desc: "حامل مكتبي يتحمل زوايا مختلفة." },
    { id: 92, name: "حامل سيارة مغناطيسي", cat: "holders", brand: "Generic", price: 25, stock: 24, emoji: "🚗", models: [], desc: "تثبيت مغناطيسي على لوحة القيادة." },
    { id: 93, name: "حامل سيارة للزجاج الأمامي", cat: "holders", brand: "Generic", price: 32, stock: 16, emoji: "🚗", models: [], desc: "قاعدة شفط قوية وذراع قابل للتعديل." },
    { id: 94, name: "حامل مغناطيسي للسيارة يدعم MagSafe", cat: "holders", brand: "Baseus", price: 55, stock: 8, emoji: "🧲", models: ["iPhone 14", "iPhone 15", "iPhone 16"], isNew: true, desc: "حلقة مغناطيسية قوية للهواتف المتوافقة." },
    { id: 95, name: "حامل ثلاثي القوائم 1.6 متر", cat: "holders", brand: "Generic", price: 60, stock: 10, emoji: "📷", models: [], desc: "ترايبود للتصوير مع ريموت بلوتوث." },
    { id: 96, name: "عصا سيلفي بلوتوث", cat: "holders", brand: "Generic", price: 35, stock: 18, emoji: "🤳", models: [], desc: "عصا سيلفي قابلة للطي مع زر تصوير." },
    { id: 97, name: "حامل هاتف للدراجة", cat: "holders", brand: "Generic", price: 30, stock: 12, emoji: "🚲", models: [], desc: "حامل متين للدراجة الهوائية أو النارية." },
    { id: 98, name: "حلقة تثبيت خلفية للهاتف", cat: "holders", brand: "Generic", price: 8, stock: 60, emoji: "💍", models: [], desc: "حلقة لاصقة للإمساك بأمان وتعمل كحامل." },
    { id: 99, name: "حامل تابلت مكتبي", cat: "holders", brand: "Generic", price: 40, stock: 9, emoji: "📱", models: [], desc: "قاعدة لتثبيت التابلت بزوايا متعددة." },
    { id: 100, name: "حامل هاتف للرقبة", cat: "holders", brand: "Generic", price: 28, stock: 0, emoji: "📱", models: [], desc: "حامل يعلّق حول الرقبة لاستعمال اليدين." }
  ]
};
