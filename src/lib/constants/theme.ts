export const THEMES = ["light", "dark", "purple"] as const

export type Theme = (typeof THEMES)[number]

export interface ThemeOption {
  value: Theme
  label: string
}

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "purple", label: "Purple" },
] as const

export const DEFAULT_THEME: Theme = "light"
