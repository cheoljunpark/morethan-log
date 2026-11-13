import React, { createContext, ReactNode, useContext } from "react"

export type UiLanguage = "ko" | "en"

type UiLanguageContextValue = {
  language: UiLanguage
  locale: string
}

// The blog is written in Korean only, so the UI stays Korean too. Components
// keep their English strings, ready if an English mode ever returns.
const VALUE: UiLanguageContextValue = { language: "ko", locale: "ko-KR" }

const UiLanguageContext = createContext<UiLanguageContextValue>(VALUE)

export const UiLanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <UiLanguageContext.Provider value={VALUE}>
    {children}
  </UiLanguageContext.Provider>
)

export const useUiLanguage = () => useContext(UiLanguageContext)
