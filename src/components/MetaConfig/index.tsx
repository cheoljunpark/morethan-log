import { CONFIG } from "site.config"
import Head from "next/head"

export type MetaConfigProps = {
  title: string
  description: string
  type: "Website" | "Post" | "Page" | string
  date?: string
  image?: string
  url: string
  canonicalUrl?: string
  keywords?: string[]
  jsonLd?: Record<string, any> | null
}

const MetaConfig: React.FC<MetaConfigProps> = (props) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />
      <meta name="description" content={props.description} />
      {props.keywords?.length && (
        <meta name="keywords" content={props.keywords.join(", ")} />
      )}
      <link rel="canonical" href={props.canonicalUrl || props.url} />
      {/* og */}
      <meta property="og:type" content={props.type} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:url" content={props.url} />
      {CONFIG.lang && <meta property="og:locale" content={CONFIG.lang} />}
      {props.image && <meta property="og:image" content={props.image} />}
      {/* twitter */}
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:card" content="summary_large_image" />
      {props.image && <meta name="twitter:image" content={props.image} />}
      {/* post */}
      {props.type === "Post" && (
        <>
          <meta property="article:published_time" content={props.date} />
          <meta property="article:author" content={CONFIG.profile.name} />
        </>
      )}
      {props.jsonLd && (
        <script
          key="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(props.jsonLd),
          }}
        />
      )}
    </Head>
  )
}

export default MetaConfig
