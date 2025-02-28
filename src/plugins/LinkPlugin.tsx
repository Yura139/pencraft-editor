import React from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"
import { SelectionManager } from "../utils/SelectionManager"

// Виносимо компонент діалогу окремо
const LinkDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (url: string, text: string) => void
  initialText: string
}> = ({ isOpen, onClose, onInsert, initialText }) => {
  const [url, setUrl] = React.useState("")
  const [text, setText] = React.useState("")

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

// Виносимо компонент кнопки окремо
const LinkButton: React.FC<{
  onButtonClick: () => void
}> = ({ onButtonClick }) => {
  return (
    <button className="pencraft-button" onClick={onButtonClick} title="Insert link">
      🔗
    </button>
  )
}

export class LinkPlugin implements Plugin {
  name = "link"
  private editor: EditorCore | null = null
  private selectionManager: SelectionManager = new SelectionManager()

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  private insertLink = (url: string, text: string) => {
    if (!this.editor) return

    try {
      new URL(url)
      const editorElement = document.querySelector(".pencraft-editor") as HTMLElement
      if (!editorElement) return

      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      this.selectionManager.insertHTML(link, editorElement)

      // Створюємо подію input для оновлення стану
      editorElement.dispatchEvent(new Event("input", { bubbles: true }))
    } catch (error) {
      alert("Please enter a valid URL")
    }
  }

  toolbar = [
    {
      name: "Link",
      icon: "🔗",
      render: () => {
        return <LinkToolbarItem onInsert={this.insertLink} onSaveSelection={() => this.selectionManager.saveSelection()} />
      },
    },
  ]
}

// Створюємо окремий компонент для елемента тулбару
const LinkToolbarItem: React.FC<{
  onInsert: (url: string, text: string) => void
  onSaveSelection: () => void
}> = ({ onInsert, onSaveSelection }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedText, setSelectedText] = React.useState("")

  return (
    <>
      <LinkButton
        onButtonClick={() => {
          onSaveSelection()
          const selection = window.getSelection()
          setSelectedText(selection?.toString() || "")
          setIsOpen(true)
        }}
      />
      <LinkDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={onInsert} initialText={selectedText} />
    </>
  )
}
