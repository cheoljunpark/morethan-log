import localFont from "next/font/local"

// Only the weights the design uses (300 light / 400 regular / 600 semibold).
// Each file carries the full Korean glyph set (~780 KB), so every extra
// weight is a large download. No preload: text renders in the system font
// first and each weight is fetched only when a page actually uses it.
export const pretendard = localFont({
  src: [
    { path: "./Pretendard-Light.woff2", weight: "300", style: "normal" },
    { path: "./Pretendard-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Pretendard-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  preload: false,
})
