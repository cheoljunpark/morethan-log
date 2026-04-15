const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Cheoljun Park",
    image: "/janggun-transparent.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Fullstack Developer",
    bio: "구현 과정과 트러블슈팅, 배운 것들을 기록합니다.",
    email: "dkfnak6789@gmail.com",
    linkedin: "cheoljunpark",
    github: "cheoljunpark",
    solved_ac: "dizncjfwns",
    instagram: "",
  },
  projects: [
    {
      name: `Vita`,
      href: "https://github.com/cheoljunpark/vita",
    },
    {
      name: `ErU`,
      href: "https://github.com/cheoljunpark/eru",
    },
    {
      name: `Mokkoji`,
      href: "https://github.com/cheoljunpark/mokkoji",
    },
    {
      name: `Trippin`,
      href: "https://github.com/cheoljunpark/trippin",
    },
    {
      name: `FPS`,
      href: "https://github.com/cheoljunpark/fps",
    },
    {
      name: `Algorithm`,
      href: "https://github.com/cheoljunpark/algorithm",
    },
  ],
  // blog setting (required)
  blog: {
    title: "cheoljun.dev",
    description: "welcome to cheoljun's blog!",
    scheme: "light", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://cheoljunpark.vercel.app/",
  since: 2024, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
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
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
