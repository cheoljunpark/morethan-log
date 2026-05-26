import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"
import { SchemeType } from "src/types"

type SetScheme = (scheme: SchemeType) => void

const STORAGE_KEY = "scheme"

const isSchemeType = (value: unknown): value is SchemeType =>
  value === "light" || value === "dark"

const getSystemScheme = (): SchemeType => {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

const getConfiguredScheme = (): SchemeType => {
  if (CONFIG.blog.scheme === "system") return getSystemScheme()
  return isSchemeType(CONFIG.blog.scheme) ? CONFIG.blog.scheme : "light"
}

const getStoredScheme = (): SchemeType | undefined => {
  if (typeof window !== "undefined") {
    const localScheme = window.localStorage.getItem(STORAGE_KEY)
    if (isSchemeType(localScheme)) return localScheme
  }

  const cookieScheme = getCookie(STORAGE_KEY)
  return isSchemeType(cookieScheme) ? cookieScheme : undefined
}

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: () => getStoredScheme() || getConfiguredScheme(),
  })

  const setScheme = (scheme: SchemeType) => {
    setCookie(STORAGE_KEY, scheme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, scheme)
    }

    queryClient.setQueryData(queryKey.scheme(), scheme)
  }

  useEffect(() => {
    const nextScheme = getStoredScheme() || getConfiguredScheme()
    if (nextScheme !== data) {
      queryClient.setQueryData(queryKey.scheme(), nextScheme)
    }
  }, [data, queryClient])

  return [data, setScheme]
}

export default useScheme
