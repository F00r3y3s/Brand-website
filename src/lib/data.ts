export interface ServiceItem {
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  media: string[];
  isComingSoon?: boolean;
}

export const servicesData: ServiceItem[] = [
  {
    title: "AI Research & Consultancy",
    titleAr: "بحوث الذكاء الاصطناعي والاستشارات",
    subtitle: "Innovation Studies, Strategic AI Advisory and Sustainability Research",
    subtitleAr: "دراسات الابتكار والاستشارات الاستراتيجية في الذكاء الاصطناعي وأبحاث الاستدامة",
    description: "We conduct innovation studies and deliver strategic AI advisory services grounded in sustainability research. By bridging cutting-edge AI with real-world organizational needs, we help institutions make informed, future-ready decisions that drive measurable and lasting impact.",
    descriptionAr: "نُجري دراسات الابتكار ونقدم خدمات الاستشارات الاستراتيجية في الذكاء الاصطناعي المبنية على أبحاث الاستدامة. من خلال ربط أحدث تقنيات الذكاء الاصطناعي بالاحتياجات الفعلية للمؤسسات، نساعد المنظمات على اتخاذ قرارات مستنيرة وجاهزة للمستقبل تُحدث أثراً حقيقياً ودائماً.",
    media: ["/services/custom/cons1.webp", "/services/custom/const2.webp"]
  },
  {
    title: "Platform Development",
    titleAr: "تطوير المنصات",
    subtitle: "AI-Driven Behavioral Platforms and National Digital Infrastructure",
    subtitleAr: "منصات سلوكية مدعومة بالذكاء الاصطناعي وبنية تحتية رقمية وطنية",
    description: "We design and build AI-driven behavioral platforms and national-scale digital infrastructure. Our solutions are engineered for resilience, performance, and long-term scalability, empowering governments and enterprises to deliver smarter, data-informed services to their people.",
    descriptionAr: "نصمم وننشئ منصات سلوكية مدعومة بالذكاء الاصطناعي وبنية تحتية رقمية على المستوى الوطني. حلولنا مُصممة للصمود والأداء العالي وقابلية التوسع طويلة الأمد، لتمكين الحكومات والمؤسسات من تقديم خدمات أكثر ذكاءً ومبنية على البيانات لمواطنيها.",
    media: ["/services/custom/app%20development.webp", "/services/custom/App%20development%201.webp"]
  },
  {
    title: "Digital Content Creation",
    titleAr: "إنشاء المحتوى الرقمي",
    subtitle: "Sustainability-Focused Content Strategy and Digital Production",
    subtitleAr: "استراتيجية محتوى تركّز على الاستدامة والإنتاج الرقمي",
    description: "We craft sustainability-focused content strategies and manage end-to-end digital production. By combining human creative direction with AI-powered tools, we help organizations communicate their vision compellingly, producing consistent, high-quality content that resonates and drives real engagement.",
    descriptionAr: "نضع استراتيجيات محتوى تُركّز على الاستدامة وندير عمليات الإنتاج الرقمي من الألف إلى الياء. من خلال الجمع بين التوجيه الإبداعي البشري وأدوات الذكاء الاصطناعي، نساعد المؤسسات على التعبير عن رؤيتها بشكل مقنع، بإنتاج محتوى متسق وعالي الجودة يُحدث تفاعلاً حقيقياً.",
    media: ["/services/custom/socialmedia%201.webp", "/services/custom/social%20media%202.webp"]
  },
  {
    title: "AI Developing Services",
    titleAr: "خدمات تطوير الذكاء الاصطناعي",
    subtitle: "Custom AI Model Development and Intelligent Systems Design",
    subtitleAr: "تطوير نماذج ذكاء اصطناعي مخصصة وتصميم أنظمة ذكية",
    description: "We build custom AI models and design intelligent systems tailored to your specific operational needs. From data pipelines to deployed inference engines, our end-to-end development approach ensures your AI solutions are accurate, robust, and ready to create real-world value at scale.",
    descriptionAr: "نبني نماذج ذكاء اصطناعي مخصصة ونصمم أنظمة ذكية مُصمَّمة وفق احتياجاتك التشغيلية الخاصة. من خطوط معالجة البيانات إلى محركات الاستدلال المُنشّرة، يضمن نهجنا الشامل في التطوير أن تكون حلول الذكاء الاصطناعي الخاصة بك دقيقة ومتينة وجاهزة لخلق قيمة حقيقية على نطاق واسع.",
    media: ["/services/custom/ecommerce%201.webp", "/services/custom/ecommerce%202.webp"]
  },
  {
    title: "Computer Systems & Software",
    titleAr: "أنظمة الحاسوب والبرمجيات",
    subtitle: "End-to-End System Architecture, Software Design and Deployment",
    subtitleAr: "هندسة الأنظمة الشاملة وتصميم البرمجيات ونشرها",
    description: "We deliver end-to-end system architecture, software design, and deployment services built for reliability and scale. From initial blueprinting to production rollout, we ensure every layer of your technology stack is engineered with precision, supporting continuous growth and operational excellence.",
    descriptionAr: "نُقدّم خدمات هندسة الأنظمة الشاملة وتصميم البرمجيات ونشرها، مبنية على أسس من الموثوقية وقابلية التوسع. من التخطيط المبدئي إلى الإطلاق في بيئة الإنتاج، نضمن أن كل طبقة في بنيتك التقنية مُصممة بدقة، لدعم النمو المستمر والتميز التشغيلي.",
    media: ["/services/custom/ITa.webp", "/services/custom/ITb.webp"]
  }
];
