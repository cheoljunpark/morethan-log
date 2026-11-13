import { NextPage } from "next"
import { AppProps } from "next/app"
import { ExtendedRecordMap } from "notion-types"
import { ReactElement, ReactNode } from "react"

export type NextPageWithLayout<PageProps = {}> = NextPage<PageProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export type TPostStatus = "Private" | "Public" | "PublicOnDetail"

export type TPost = {
  id: string
  date: { start_date: string }
  updatedAt?: { start_date: string }
  slug: string
  menu?: string[]
  submenu?: string[]
  tags?: string[]
  summary?: string
  title: string
  status: TPostStatus[]
  createdTime: string
  thumbnail?: string
}

export type PostDetail = TPost & {
  recordMap: ExtendedRecordMap
}

export type TPosts = TPost[]

export type SchemeType = "light" | "dark"
