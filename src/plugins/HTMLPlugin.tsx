import React from "react"
import { Plugin, EditorCore } from "../types"

export class HTMLPlugin implements Plugin {
  name = "html"
  private editor: EditorCore | null = null
  private isHTMLMode = false

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  toolbar = [
    {
      name: "HTML",
      icon: "</>",
      render: () => (
        <button
          className={`pencraft-button ${this.isHTMLMode ? "active" : ""}`}
          onClick={() => {
            this.isHTMLMode = !this.isHTMLMode
            const event = new CustomEvent("toggleEditMode", {
              detail: { mode: "html" },
            })
            document.dispatchEvent(event)
          }}
          title="Toggle HTML mode"
        >
          &lt;/&gt;
        </button>
      ),
    },
  ]
}
