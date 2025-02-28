import React from "react"
import { Theme } from "../types"

export const defaultThemes: Theme[] = [
  {
    name: "Light",
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      toolbarBackground: "#f8f9fa",
      borderColor: "#dee2e6",
      accentColor: "#007bff",
    },
  },
  {
    name: "Dark",
    styles: {
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      toolbarBackground: "#2d2d2d",
      borderColor: "#404040",
      accentColor: "#66b3ff",
    },
  },
  {
    name: "Sepia",
    styles: {
      backgroundColor: "#f4ecd8",
      textColor: "#5b4636",
      toolbarBackground: "#e9e1cc",
      borderColor: "#d3c7b1",
      accentColor: "#986841",
    },
  },
]

interface ThemeSelectorProps {
  onThemeChange: (theme: Theme) => void
  currentTheme?: string
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange, currentTheme = "Light" }) => {
  return (
    <select
      className="pencraft-theme-selector"
      value={currentTheme}
      onChange={(e) => {
        const selectedTheme = defaultThemes.find((theme) => theme.name === e.target.value)
        if (selectedTheme) {
          onThemeChange(selectedTheme)
        }
      }}
    >
      {defaultThemes.map((theme) => (
        <option key={theme.name} value={theme.name}>
          {theme.name}
        </option>
      ))}
    </select>
  )
}
