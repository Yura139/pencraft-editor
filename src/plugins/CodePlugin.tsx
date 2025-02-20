import React, { useState } from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"

const CodeDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (code: string, language: string) => void
}> = ({ isOpen, onClose, onInsert }) => {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code) {
      onInsert(code, language)
      setCode("")
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="pencraft-form" onSubmit={handleSubmit}>
        <h3>Insert Code</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="python">Python</option>
        </select>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your code here..." rows={10} required />
        <button type="submit">Insert</button>
      </form>
    </Modal>
  )
}

export class CodePlugin implements Plugin {
  name = "code"
  private editor: EditorCore | null = null
  private savedRange: Range | null = null

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  private saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0).cloneRange()
    }
  }

  private restoreSelection = () => {
    if (this.savedRange) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(this.savedRange)
      }
    }
  }

  private insertCode = (code: string, language: string) => {
    if (!this.editor) return

    this.restoreSelection()
    const pre = document.createElement("pre")
    const codeElement = document.createElement("code")
    codeElement.className = `language-${language}`
    codeElement.textContent = code
    pre.appendChild(codeElement)

    if (this.savedRange) {
      this.savedRange.deleteContents()
      this.savedRange.insertNode(pre)

      // Додаємо перенос рядка після коду
      const br = document.createElement("br")
      pre.parentNode?.insertBefore(br, pre.nextSibling)

      // Оновлюємо виділення
      this.savedRange.setStartAfter(br)
      this.savedRange.setEndAfter(br)

      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(this.savedRange)
      }

      // Створюємо подію input для оновлення стану
      const editorElement = document.querySelector(".pencraft-editor")
      editorElement?.dispatchEvent(new Event("input", { bubbles: true }))
    }

    this.savedRange = null
  }

  toolbar = [
    {
      name: "Code",
      icon: "📝",
      render: () => {
        const [isOpen, setIsOpen] = useState(false)

        return (
          <>
            <button
              className="pencraft-button"
              onClick={() => {
                this.saveSelection()
                setIsOpen(true)
              }}
              title="Insert code"
            >
              📝
            </button>
            <CodeDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={this.insertCode} />
          </>
        )
      },
    },
  ]
}
