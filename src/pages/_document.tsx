import Document, { Html, Head, Main, NextScript } from "next/document"
import { CONFIG } from "site.config"

// The server always renders the default (light) theme; the saved theme is
// applied after hydration. For readers who saved "dark", hide the page on a
// dark background until then, instead of flashing the light theme. useScheme
// removes the marker once the real theme is in place; the timeout is a
// safety net so the page can never stay hidden.
const PRE_SCHEME_SCRIPT = `(function(){try{
var s=localStorage.getItem("scheme");
if(s!=="dark")return;
var d=document.documentElement;d.setAttribute("data-pre-scheme","dark");
setTimeout(function(){d.removeAttribute("data-pre-scheme")},3000);
}catch(e){}})()`

const PRE_SCHEME_STYLE = `html[data-pre-scheme="dark"],html[data-pre-scheme="dark"] body{background:#000;color-scheme:dark}
html[data-pre-scheme="dark"] #__next{visibility:hidden}`

class MyDocument extends Document {
  render() {
    return (
      <Html lang={CONFIG.lang}>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: PRE_SCHEME_STYLE }} />
          <script dangerouslySetInnerHTML={{ __html: PRE_SCHEME_SCRIPT }} />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="192x192" href="/logo.png"></link>
          {/* google search console */}
          {CONFIG.googleSearchConsole.enable === true && (
            <>
              <meta
                name="google-site-verification"
                content={CONFIG.googleSearchConsole.config.siteVerification}
              />
            </>
          )}
          {/* naver search advisor */}
          {CONFIG.naverSearchAdvisor.enable === true && (
            <>
              <meta
                name="naver-site-verification"
                content={CONFIG.naverSearchAdvisor.config.siteVerification}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
