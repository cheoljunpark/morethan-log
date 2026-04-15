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
          background-image: ${theme.scheme === "dark"
            ? "linear-gradient(180deg, rgba(18, 22, 29, 0.98) 0%, rgba(23, 28, 36, 0.98) 100%), radial-gradient(circle at 12% 12%, rgba(135, 162, 255, 0.14), transparent 24%), radial-gradient(circle at 88% 10%, rgba(73, 166, 255, 0.10), transparent 20%)"
            : "linear-gradient(180deg, rgba(245, 247, 251, 0.98) 0%, rgba(239, 243, 249, 0.98) 100%), radial-gradient(circle at 12% 10%, rgba(89, 115, 255, 0.10), transparent 26%), radial-gradient(circle at 88% 8%, rgba(22, 144, 255, 0.08), transparent 20%)"};
          background-attachment: fixed;
          font-family: ${pretendard.style.fontFamily}, "Pretendard Variable",
            "Inter Variable", "Inter", "SF Pro Display", "Segoe UI", sans-serif;
          font-weight: ${pretendard.style.fontWeight};
          font-style: ${pretendard.style.fontStyle};
          letter-spacing: -0.012em;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          min-height: 100vh;
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
