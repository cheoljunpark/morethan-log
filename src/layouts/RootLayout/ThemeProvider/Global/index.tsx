import { Global as _Global, css, useTheme } from "@emotion/react"

import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { pretendard } from "src/assets"

export const Global = () => {
  const theme = useTheme()

  return (
    <_Global
      styles={css`
        body {
          margin: 0;
          padding: 0;
          color: ${theme.colors.gray12};
          background-color: ${theme.colors.gray2};
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Pretendard Variable", ${pretendard.style.fontFamily}, "Pretendard",
            "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
          font-size: 17px;
          font-weight: ${pretendard.style.fontWeight};
          font-style: ${pretendard.style.fontStyle};
          letter-spacing: -0.022em;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          word-break: keep-all;
          font-feature-settings: "cv05", "cv10", "cv11";
          min-height: 100vh;
          overflow-x: clip;
        }

        :root {
          --font-text: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Pretendard Variable", "Pretendard", "Apple SD Gothic Neo",
            "Malgun Gothic", sans-serif;
          --font-display: system-ui, -apple-system, BlinkMacSystemFont,
            "SF Pro Display", "Pretendard Variable", "Pretendard",
            "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
        }

        ::selection {
          background: ${theme.colors.indigo9};
          color: ${theme.colors.gray1};
        }

        :focus-visible {
          outline: 2px solid ${theme.colors.indigo9};
          outline-offset: 2px;
        }

        * {
          color-scheme: ${theme.scheme};
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          font-weight: inherit;
          font-style: inherit;
          letter-spacing: -0.03em;
          font-family: var(--font-display);
          word-break: keep-all;
        }

        a {
          all: unset;
          cursor: pointer;
        }

        ul {
          padding: 0;
        }

        // init button
        button {
          all: unset;
          cursor: pointer;
        }

        // init input
        input {
          all: unset;
          box-sizing: border-box;
        }

        // init textarea
        textarea {
          border: none;
          background-color: transparent;
          font-family: inherit;
          padding: 0;
          outline: none;
          resize: none;
          color: inherit;
        }

        hr {
          width: 100%;
          border: none;
          margin: 0;
          border-top: 1px solid ${theme.colors.gray6};
        }
      `}
    />
  )
}
