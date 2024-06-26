const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Cheoljun Park",
    image: "/avatar.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Frontend Developer",
    bio: "I develop SEXY UI/UX.",
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
    title: "Cheoljun's Blog",
    description: "welcome to cheoljun's blog!",
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
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: true,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
