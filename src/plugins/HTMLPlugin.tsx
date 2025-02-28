import React, { useState, useEffect } from "react"
import { Plugin, EditorCore } from "../types"
import { ShortcutManager } from "../utils/Shortcuts"
import { prettifyHTML } from "../utils/HTMLFormatter"

export class HTMLPlugin implements Plugin {
  name = "html"
  private editor: EditorCore | null = null
  private isHTMLMode = false
  private shortcutManager: ShortcutManager | null = null

  initialize(editor: EditorCore, shortcutManager: ShortcutManager) {
    this.editor = editor
    this.shortcutManager = shortcutManager

    // Додаємо гарячу клавішу для перемикання HTML режиму (Ctrl+Shift+H)
    this.shortcutManager.register({
      key: "h",
      ctrl: true,
      shift: true,
      description: "Toggle HTML mode",
      handler: (e) => {
        e.preventDefault()
        this.toggleHTMLMode()
      },
    })
  }

  destroy() {
    // Видаляємо гарячу клавішу при знищенні плагіна
    if (this.shortcutManager) {
      this.shortcutManager.unregister("h")
    }
  }

  toggleHTMLMode = () => {
    this.isHTMLMode = !this.isHTMLMode
    const event = new CustomEvent("toggleEditMode", {
      detail: { mode: "html" },
    })
    document.dispatchEvent(event)
  }

  formatHTML = () => {
    if (!this.editor || !this.isHTMLMode) return

    const editorElement = document.querySelector(".pencraft-editor") as HTMLElement
    if (!editorElement) return

    const htmlContent = editorElement.textContent || ""
    const formattedHTML = prettifyHTML(htmlContent)

    editorElement.textContent = formattedHTML

    // Створюємо подію input для оновлення стану
    editorElement.dispatchEvent(new Event("input", { bubbles: true }))
  }

  toolbar = [
    {
      name: "HTML",
      icon: "</>",
      render: () => <HTMLModeToggle isHTMLMode={this.isHTMLMode} onToggle={this.toggleHTMLMode} onFormat={this.formatHTML} />,
    },
  ]
}

// Компонент для перемикання HTML режиму
const HTMLModeToggle: React.FC<{
  isHTMLMode: boolean
  onToggle: () => void
  onFormat: () => void
}> = ({ isHTMLMode, onToggle, onFormat }) => {
  useEffect(() => {
    if (isHTMLMode) {
      setTimeout(() => {
        onFormat()
      }, 100)
    }
  }, [isHTMLMode])
  return (
    <div className="pencraft-html-controls">
      <button className={`pencraft-button ${isHTMLMode ? "active" : ""}`} onClick={onToggle} title="Toggle HTML mode (Ctrl+Shift+H)" aria-pressed={isHTMLMode ? "true" : "false"}>
        &lt;/&gt;
      </button>
      {/* {isHTMLMode && (
        <button className="pencraft-button" onClick={onFormat} title="Format HTML">
          ✨
        </button>
      )} */}
    </div>
  )
}
