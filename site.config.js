const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Cheoljun Park",
    image: "/profile.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Fullstack Developer",
    bio: "구현 과정과 트러블슈팅, 배운 것들을 기록합니다.",
    email: "dkfnak6789@gmail.com",
    linkedin: "cheoljunpark",
    github: "cheoljunpark",
    solved_ac: "dizncjfwns",
    instagram: "",
  },
  // Projects page: sections in this order; a section with no projects is hidden.
  projectGroups: [
    {
      id: "ssafy",
      ko: "삼성 청년 SW 아카데미 10기",
      en: "Samsung SW Academy for Youth, 10th",
      note: "SSAFY",
    },
    {
      id: "university",
      ko: "세종대학교",
      en: "Sejong University",
    },
    { id: "personal", ko: "개인 프로젝트", en: "Personal" },
    { id: "etc", ko: "기타", en: "Other" },
  ],
  projects: [
    {
      name: `비타`,
      alias: "Vita",
      group: "ssafy",
      type: { ko: "자율 프로젝트", en: "Autonomous project" },
      github: "https://github.com/cheoljunpark/vita",
      youtube: ["https://youtu.be/k9dR9_LZotI"],
    },
    {
      name: `타유`,
      alias: "ErU",
      group: "ssafy",
      type: { ko: "특화 프로젝트", en: "Specialized project" },
      github: "https://github.com/cheoljunpark/eru",
      youtube: ["https://youtu.be/dFn4dRF6Jl0", "https://youtu.be/UUoUaakTzbw"],
    },
    {
      name: `모꼬지`,
      alias: "Mokkoji",
      group: "ssafy",
      type: { ko: "공통 프로젝트", en: "Common project" },
      github: "https://github.com/cheoljunpark/mokkoji",
      youtube: ["https://youtu.be/ErrhYvdskkE"],
    },
    {
      name: `트립핀`,
      alias: "Trippin",
      group: "ssafy",
      type: { ko: "관통 프로젝트", en: "Final project, 1st semester" },
      github: "https://github.com/cheoljunpark/trippin",
      youtube: ["https://youtu.be/8Cbpp_czoaY"],
    },
    {
      name: `FPS`,
      alias: "Frontend Practice Service",
      group: "university",
      type: { ko: "캡스톤 프로젝트", en: "Capstone project" },
      github: "https://github.com/cheoljunpark/fps",
      youtube: ["https://youtu.be/of65YnH_UiI"],
    },
    {
      name: `알고리즘`,
      alias: "Algorithm",
      group: "etc",
      github: "https://github.com/cheoljunpark/algorithm",
    },
  ],
  // About page content: the Notion row with this ID number. Its status can
  // stay empty, so it never appears in the post list or at its own URL.
  aboutPageId: "73",
  // blog setting (required)
  blog: {
    title: "cheoljun.dev",
    description: "구현 과정과 트러블슈팅, 배운 것들을 기록합니다.",
    scheme: "light", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://dev.cheoljunpark.site/",
  since: 2024, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID),
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo:
        process.env.NEXT_PUBLIC_UTTERANCES_REPO || "cheoljunpark/morethan-log",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 60 * 60, // ISR: regenerate pages at most once an hour so new posts show up quickly
}

module.exports = { CONFIG }
