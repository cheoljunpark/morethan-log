import {
  gray,
  blue,
  red,
  green,
  grayDark,
  blueDark,
  redDark,
  greenDark,
  indigo,
  indigoDark,
} from "@radix-ui/colors"

export type Colors = typeof colors.light & typeof colors.dark

export const colors = {
  light: {
    ...indigo,
    ...gray,
    ...blue,
    ...red,
    ...green,
  },
  dark: {
    ...indigoDark,
    ...grayDark,
    ...blueDark,
    ...redDark,
    ...greenDark,
    gray1: "#101418",
    gray2: "#161b22",
    gray3: "#1d232d",
    gray4: "#242c36",
    gray5: "#2b3440",
    gray6: "#34404d",
    gray7: "#425062",
    gray8: "#526176",
    gray9: "#a9b6c7",
    gray10: "#bac6d3",
    gray11: "#d2dbe5",
    gray12: "#f3f7fb",
    indigo3: "#1f2b45",
    indigo4: "#273453",
    indigo9: "#8da4ff",
    indigo10: "#a3b6ff",
    indigo11: "#c0ceff",
    indigo12: "#e7ecff",
  },
}
