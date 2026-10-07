const FOX_PROFILE = {
  name: 'Fox',
  email: 'foxsd520@gmail.com',
  title: 'مطور وتقني ومهندس حلول',
  about: 'أنا Fox، متخصص في البرمجة، الأمن السيبراني، تطوير المواقع وتطبيقات الأعمال. أركز على بناء أنظمة احترافية قابلة للتوسع وتقديم حلول تقنية عملية وتطبيقية.',
  services: [
    'تطوير مواقع ويب احترافية',
    'تطوير تطبيقات الويب والواجهة',
    'بناء أنظمة إدارة للأعمال',
    'استشارات أمنية وقياس الثغرات',
    'تطوير APIs وواجهات خادم',
    'حلول العمل والذكاء الشخصي للأعمال'
  ],
  specialties: {
    programming: [
      'Python',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'React',
      'Next.js',
      'PHP',
      'Go'
    ],
    security: [
      'Web Security',
      'Penetration Testing',
      'Network Security',
      'OWASP',
      'API Security',
      'Threat Analysis'
    ],
    web: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Next.js',
      'Express',
      'REST APIs'
    ],
    apps: [
      'Flutter',
      'React Native',
      'Android',
      'iOS',
      'Electron',
      'Desktop Applications'
    ]
  },
  values: [
    'الحقيقة أولاً',
    'الملكية الكاملة للبيانات',
    'الحلول العملية والعملية',
    'التطوير الوظيفي والاحترافي',
    'التحكم الكامل في المشروع'
  ]
};

function profileSummary() {
  return {
    ...FOX_PROFILE,
    summary: `${FOX_PROFILE.name} هو مطور وتقني متخصص في بناء الأنظمة الرقمية والحلول الذكية للأعمال. يعمل على البرمجة، الأمن السيبراني، تطوير المواقع، إدارة المشاريع، والتقنيات الحديثة.`
  };
}

function buildPersonalReply(input = '') {
  const text = (input || '').trim();
  const lower = text.toLowerCase();

  if (!text) {
    return 'أنا Fox، أستطيع مساعدتك في البرمجة، الأمن السيبراني، تطوير المواقع والتطبيقات، وبناء حلول الأعمال. ما الذي تريد إنجازه؟';
  }

  if (/(برمجة|programming|code|python|javascript|node|react|api|backend|frontend)/.test(lower)) {
    return 'أنا Fox أعمل في البرمجة وتطوير الأنظمة، وأستطيع مساعدتك في بناء واجهات، APIs، أنظمة إدارة، وأدوات الأعمال. أستطيع تنفيذ المشروع من الفكرة حتى الإنتاج مع تصميم عملي ومرن.';
  }

  if (/(أمن|security|cyber|penetration|vulnerability|owasp|xss|csrf|sql)/.test(lower)) {
    return 'أمتلك خبرة في الأمن السيبراني، بما في ذلك تقييم الثغرات، اختبار الاختراق، حماية التطبيقات، ومراجعة أمن APIs والمواقع. أستطيع تقديم تحليل مخاطر ومقترحات مباشرة لتحسين الأمان.';
  }

  if (/(موقع|website|web|landing|front-end|react|next|html|css)/.test(lower)) {
    return 'أستطيع بناء مواقع احترافية، من landing pages إلى مواقع الشركات والمنصات المتقدمة، باستخدام تقنيات حديثة وواجهة عربية عالية الجودة.';
  }

  if (/(تطبيق|app|mobile|android|ios|flutter|react native)/.test(lower)) {
    return 'أستطيع تصميم وتطوير تطبيقات الهاتف والويب مع تجربة مستخدم احترافية وتفاعل قوي، مع دعم للوظائف الأساسية مثل تسجيل الدخول، القوائم، البيانات، والإشعارات.';
  }

  if (/(خدمة|service|business|project|startup|system|crm|dashboard)/.test(lower)) {
    return 'أستطيع المساعدة في بناء أنظمة إدارة الأعمال، CRM، لوحات التحكم، مشاريع المشاريع، والفواتير، مع تصميم عملي يساعدك على إدارة العمل بفعالية.';
  }

  return `أنا Fox، أعمل على البرمجة والأمن السيبراني وتطوير المواقع والتطبيقات، وأقدم حلولاً عملية ومخصصة لأعمالك. إذا أردت، أستطيع مساعدتك في بناء مشروعك أو صياغة خطة تنفيذ مناسبة لك.`;
}

module.exports = {
  FOX_PROFILE,
  profileSummary,
  buildPersonalReply,
};
