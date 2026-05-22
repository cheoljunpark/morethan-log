import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"

export type UiLanguage = "ko" | "en"

type UiLanguageContextValue = {
  language: UiLanguage
  locale: string
  setLanguage: (language: UiLanguage) => void
  toggleLanguage: () => void
}

const STORAGE_KEY = "morethan-log:ui-language"

const UiLanguageContext = createContext<UiLanguageContextValue | null>(null)

type Props = {
  children: ReactNode
}

export const UiLanguageProvider: React.FC<Props> = ({ children }) => {
  const [language, setLanguage] = useState<UiLanguage>("ko")

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "ko" || saved === "en") {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (nextLanguage: UiLanguage) => {
    setLanguage(nextLanguage)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage)
    }
  }

  const value = useMemo<UiLanguageContextValue>(
    () => ({
      language,
      locale: language === "ko" ? "ko-KR" : "en-US",
      setLanguage: handleSetLanguage,
      toggleLanguage: () => handleSetLanguage(language === "ko" ? "en" : "ko"),
    }),
    [language]
  )

  return (
    <UiLanguageContext.Provider value={value}>{children}</UiLanguageContext.Provider>
  )
}

export const useUiLanguage = () => {
  const context = useContext(UiLanguageContext)

  if (!context) {
    throw new Error("useUiLanguage must be used within UiLanguageProvider")
  }

  return context
}
