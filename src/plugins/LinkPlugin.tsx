import React, { useState } from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"

const LinkDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (url: string, text: string) => void
  initialText: string
}> = ({ isOpen, onClose, onInsert, initialText }) => {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")

  React.useEffect(() => {
    setText(initialText)
  }, [initialText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) {
      onInsert(url, text || url)
      setUrl("")
      setText("")
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="pencraft-form" onSubmit={handleSubmit}>
        <h3>Insert Link</h3>
        <input type="text" placeholder="Link text" value={text} onChange={(e) => setText(e.target.value)} />
        <input type="url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <button type="submit">Insert</button>
      </form>
    </Modal>
  )
}

export class LinkPlugin implements Plugin {
  name = "link"
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

  private insertLink = (url: string, text: string) => {
    if (!this.editor) return

    try {
      new URL(url)
      this.restoreSelection()

      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const editorElement = document.querySelector(".pencraft-editor")

      // Перевіряємо, чи знаходимося в редакторі
      if (!editorElement?.contains(range.commonAncestorContainer)) {
        return
      }

      // Створюємо посилання
      const link = document.createElement("a") as HTMLAnchorElement
      link.href = url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.textContent = text

      // Очищаємо вміст діапазону і вставляємо посилання
      range.deleteContents()
      range.insertNode(link)

      // Переміщуємо курсор після посилання
      range.setStartAfter(link)
      range.setEndAfter(link)
      selection.removeAllRanges()
      selection.addRange(range)

      // Перевіряємо, чи посилання знаходиться в параграфі
      let currentNode: Node = link
      while (currentNode.parentElement && currentNode.parentElement !== editorElement) {
        currentNode = currentNode.parentElement
      }

      // Якщо посилання не в параграфі, обгортаємо його
      if (currentNode === link) {
        const p = document.createElement("p")
        link.parentNode?.insertBefore(p, link)
        p.appendChild(link)
      }

      // Створюємо подію input для оновлення стану
      editorElement.dispatchEvent(new Event("input", { bubbles: true }))

      this.savedRange = null
    } catch (error) {
      alert("Please enter a valid URL")
    }
  }

  toolbar = [
    {
      name: "Link",
      icon: "🔗",
      render: () => {
        const [isOpen, setIsOpen] = useState(false)
        const [selectedText, setSelectedText] = useState("")

        return (
          <>
            <button
              className="pencraft-button"
              onClick={() => {
                this.saveSelection()
                const selection = window.getSelection()
                setSelectedText(selection?.toString() || "")
                setIsOpen(true)
              }}
              title="Insert link"
            >
              🔗
            </button>
            <LinkDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={this.insertLink} initialText={selectedText} />
          </>
        )
      },
    },
  ]
}
