/**
 * 智能 Tag 格式化系统
 * 为技术术语提供准确的显示格式化，支持连字符处理和智能回退
 */

// 标准化技术术语映射表
const TAG_DISPLAY_MAP: Record<string, string> = {
  // 编程语言
  javascript: "JavaScript",
  typescript: "TypeScript",
  rust: "Rust",
  python: "Python",
  golang: "Go",
  go: "Go",
  java: "Java",
  cpp: "C++",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  elixir: "Elixir",

  // 前端框架和库
  react: "React",
  vue: "Vue.js",
  angular: "Angular",
  svelte: "Svelte",
  nextjs: "Next.js",
  nuxt: "Nuxt.js",
  astro: "Astro",
  vite: "Vite",
  webpack: "Webpack",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",

  // 后端技术
  nodejs: "Node.js",
  express: "Express.js",
  fastify: "Fastify",
  nestjs: "NestJS",
  django: "Django",
  flask: "Flask",
  laravel: "Laravel",
  rails: "Ruby on Rails",
  springboot: "Spring Boot",

  // 数据库
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  sqlite: "SQLite",
  elasticsearch: "Elasticsearch",
  dynamodb: "DynamoDB",
  cassandra: "Cassandra",

  // DevOps 和基础设施
  devops: "DevOps",
  docker: "Docker",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  terraform: "Terraform",
  ansible: "Ansible",
  jenkins: "Jenkins",
  gitlab: "GitLab",
  github: "GitHub",
  aws: "AWS",
  azure: "Azure",
  gcp: "GCP",
  cloudflare: "Cloudflare",
  nginx: "Nginx",
  apache: "Apache",

  // AI/ML
  ai: "AI",
  ml: "Machine Learning",
  nlp: "NLP",
  llm: "LLM",
  openai: "OpenAI",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  huggingface: "Hugging Face",

  // 安全
  security: "Security",
  cybersecurity: "Cybersecurity",
  ssl: "SSL",
  tls: "TLS",
  oauth: "OAuth",
  jwt: "JWT",
  cors: "CORS",

  // 系统架构
  microservices: "Microservices",
  monolith: "Monolith",
  serverless: "Serverless",
  jamstack: "JAMstack",
  graphql: "GraphQL",
  restapi: "REST API",
  grpc: "gRPC",

  // 商业和产品
  saas: "SaaS",
  b2b: "B2B",
  b2c: "B2C",
  mvp: "MVP",
  roi: "ROI",
  kpi: "KPI",
  ux: "UX",
  ui: "UI",
  seo: "SEO",

  // 开发概念
  tdd: "TDD",
  bdd: "BDD",
  ci: "CI",
  cd: "CD",
  git: "Git",
  agile: "Agile",
  scrum: "Scrum",
  kanban: "Kanban",

  // 其他技术
  blockchain: "Blockchain",
  cryptocurrency: "Cryptocurrency",
  nft: "NFT",
  iot: "IoT",
  ar: "AR",
  vr: "VR",
  webrtc: "WebRTC",
  pwa: "PWA",
};

// 连字符特殊映射（优先级高于拆分处理）
const HYPHENATED_SPECIAL_MAP: Record<string, string> = {
  "api-design": "API Design",
  "system-design": "System Design",
  "product-design": "Product Design",
  "web-development": "Web Development",
  "software-engineering": "Software Engineering",
  "machine-learning": "Machine Learning",
  "deep-learning": "Deep Learning",
  "natural-language-processing": "Natural Language Processing",
  "user-experience": "User Experience",
  "user-interface": "User Interface",
  "zero-trust": "Zero Trust",
  "cloud-native": "Cloud Native",
  "event-driven": "Event-Driven",
  "data-driven": "Data-Driven",
  "test-driven": "Test-Driven Development",
  "behavior-driven": "Behavior-Driven Development",
  "domain-driven": "Domain-Driven Design",
  "user-acquisition": "User Acquisition",
  "growth-hacking": "Growth Hacking",
  "product-management": "Product Management",
  "knowledge-management": "Knowledge Management",
  "note-taking": "Note Taking",
  "second-brain": "Second Brain",
  "personal-assistant": "Personal Assistant",
  "context-aware": "Context-Aware",
  "real-time": "Real-Time",
  "open-source": "Open Source",
  "full-stack": "Full Stack",
  "front-end": "Front-End",
  "back-end": "Back-End",
  "end-to-end": "End-to-End",
  "cross-platform": "Cross-Platform",
  "multi-tenant": "Multi-Tenant",
  "single-sign-on": "Single Sign-On",
  "role-based": "Role-Based",
  "time-series": "Time Series",
  "key-value": "Key-Value",
  "pub-sub": "Pub-Sub",
  "request-response": "Request-Response",
  "circuit-breaker": "Circuit Breaker",
  "load-balancer": "Load Balancer",
  "reverse-proxy": "Reverse Proxy",
  "content-delivery": "Content Delivery",
  "infrastructure-as-code": "Infrastructure as Code",
  "platform-as-a-service": "Platform as a Service",
  "software-as-a-service": "Software as a Service",
};

// 标签分类定义
export type TagCategory =
  | "programming-language"
  | "framework-library"
  | "database"
  | "devops-infrastructure"
  | "ai-ml"
  | "security"
  | "architecture"
  | "business-product"
  | "methodology"
  | "general";

// 分类映射
const TAG_CATEGORY_MAP: Record<string, TagCategory> = {
  // 编程语言
  javascript: "programming-language",
  typescript: "programming-language",
  rust: "programming-language",
  python: "programming-language",
  go: "programming-language",
  java: "programming-language",

  // 框架库
  react: "framework-library",
  vue: "framework-library",
  nextjs: "framework-library",
  astro: "framework-library",
  nodejs: "framework-library",

  // 数据库
  postgresql: "database",
  mysql: "database",
  mongodb: "database",
  redis: "database",

  // DevOps
  devops: "devops-infrastructure",
  docker: "devops-infrastructure",
  kubernetes: "devops-infrastructure",
  aws: "devops-infrastructure",
  infrastructure: "devops-infrastructure",

  // AI/ML
  ai: "ai-ml",
  ml: "ai-ml",
  nlp: "ai-ml",
  llm: "ai-ml",

  // 安全
  security: "security",
  "zero-trust": "security",

  // 架构
  architecture: "architecture",
  microservices: "architecture",
  "system-design": "architecture",
  "api-design": "architecture",

  // 商业产品
  startup: "business-product",
  entrepreneurship: "business-product",
  "product-design": "business-product",
  "user-acquisition": "business-product",

  // 方法论
  agile: "methodology",
  scrum: "methodology",
  tdd: "methodology",
};

/**
 * 核心格式化函数：将 tag 转换为适合显示的格式
 * @param tag - 原始标签（通常是 kebab-case 或 lowercase）
 * @returns 格式化后的显示标签
 */
export function formatTag(tag: string): string {
  if (!tag) return "";

  // 移除前后空格并转为小写进行匹配
  const normalizedTag = tag.trim().toLowerCase();

  // 1. 优先检查完整映射表
  if (TAG_DISPLAY_MAP[normalizedTag]) {
    return TAG_DISPLAY_MAP[normalizedTag];
  }

  // 2. 检查连字符特殊映射
  if (HYPHENATED_SPECIAL_MAP[normalizedTag]) {
    return HYPHENATED_SPECIAL_MAP[normalizedTag];
  }

  // 3. 处理连字符分隔的标签
  if (normalizedTag.includes("-")) {
    return normalizedTag
      .split("-")
      .map(word => {
        // 检查单个词是否在映射表中
        if (TAG_DISPLAY_MAP[word]) {
          return TAG_DISPLAY_MAP[word];
        }
        // 否则首字母大写
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  // 4. 回退：简单首字母大写
  return normalizedTag.charAt(0).toUpperCase() + normalizedTag.slice(1);
}

/**
 * 批量格式化标签
 * @param tags - 标签数组
 * @returns 格式化后的标签数组
 */
export function formatTags(tags: string[]): string[] {
  return tags.map(formatTag);
}

/**
 * 将格式化的标签转回 URL 友好格式
 * @param displayTag - 格式化后的标签
 * @returns URL 友好的标签格式
 */
export function normalizeTag(displayTag: string): string {
  // 简单反向映射（用于 URL 生成）
  const reverseMap = Object.fromEntries(
    Object.entries(TAG_DISPLAY_MAP).map(([key, value]) => [value, key])
  );

  const reverseHyphenatedMap = Object.fromEntries(
    Object.entries(HYPHENATED_SPECIAL_MAP).map(([key, value]) => [value, key])
  );

  return (
    reverseMap[displayTag] ||
    reverseHyphenatedMap[displayTag] ||
    displayTag.toLowerCase().replace(/\s+/g, "-")
  );
}

/**
 * 验证标签格式是否有效
 * @param tag - 要验证的标签
 * @returns 是否为有效标签
 */
export function isValidTag(tag: string): boolean {
  if (!tag || typeof tag !== "string") return false;

  // 基本格式检查：只允许字母、数字、连字符，不能以连字符开头或结尾
  const tagRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return tagRegex.test(tag.trim());
}

/**
 * 获取标签分类
 * @param tag - 标签
 * @returns 标签分类
 */
export function getTagCategory(tag: string): TagCategory {
  const normalizedTag = tag.trim().toLowerCase();
  return TAG_CATEGORY_MAP[normalizedTag] || "general";
}

/**
 * 获取相关标签建议
 * @param tag - 当前标签
 * @returns 相关标签数组
 */
export function getRelatedTags(tag: string): string[] {
  const category = getTagCategory(tag);

  return Object.entries(TAG_CATEGORY_MAP)
    .filter(([_, cat]) => cat === category)
    .map(([tagName]) => tagName)
    .filter(relatedTag => relatedTag !== tag.toLowerCase())
    .slice(0, 5); // 最多返回 5 个相关标签
}

/**
 * 获取所有可用的标签及其显示格式
 * @returns 标签映射对象
 */
export function getAllTagMappings(): Record<string, string> {
  return { ...TAG_DISPLAY_MAP, ...HYPHENATED_SPECIAL_MAP };
}

// 类型定义
export interface FormattedTag {
  original: string;
  display: string;
  category: TagCategory;
  normalized: string;
}

/**
 * 获取标签的完整信息
 * @param tag - 原始标签
 * @returns 标签的完整信息对象
 */
export function getTagInfo(tag: string): FormattedTag {
  return {
    original: tag,
    display: formatTag(tag),
    category: getTagCategory(tag),
    normalized: normalizeTag(formatTag(tag)),
  };
}
