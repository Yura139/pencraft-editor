import React from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"
import { SelectionManager } from "../utils/SelectionManager"

// Виносимо компонент діалогу окремо
const ImageDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (url: string, alt: string) => void
}> = ({ isOpen, onClose, onInsert }) => {
  const [imageUrl, setImageUrl] = React.useState("")
  const [altText, setAltText] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      onInsert(imageUrl, altText)
      setImageUrl("")
      setAltText("")
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="pencraft-form" onSubmit={handleSubmit}>
        <h3>Insert Image</h3>
        <input type="url" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <input type="text" placeholder="Alt text" value={altText} onChange={(e) => setAltText(e.target.value)} />
        <button type="submit">Insert</button>
      </form>
    </Modal>
  )
}

// Виносимо компонент кнопки окремо
const ImageButton: React.FC<{
  onButtonClick: () => void
}> = ({ onButtonClick }) => {
  return (
    <button
      className="pencraft-button"
      onClick={(e) => {
        e.preventDefault()
        onButtonClick()
      }}
      type="button"
      title="Insert image"
    >
      🖼️
    </button>
  )
}

export class ImagePlugin implements Plugin {
  name = "image"
  private editor: EditorCore | null = null
  private selectionManager: SelectionManager = new SelectionManager()

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  private insertImage = (url: string, alt: string) => {
    if (!this.editor) return

    try {
      new URL(url)
      const editorElement = document.querySelector(".pencraft-editor") as HTMLElement
      if (!editorElement) return

      const img = `<img src="${url}" alt="${alt}" class="pencraft-image">`
      this.selectionManager.insertHTML(img, editorElement)

      // Створюємо подію input для оновлення стану
      editorElement.dispatchEvent(new Event("input", { bubbles: true }))
    } catch (error) {
      alert("Please enter a valid URL")
    }
  }

  toolbar = [
    {
      name: "Image",
      icon: "🖼️",
      render: () => {
        // Використовуємо компонент ImageToolbarItem замість вбудованого рендеру
        return <ImageToolbarItem onInsert={this.insertImage} onSaveSelection={() => this.selectionManager.saveSelection()} />
      },
    },
  ]
}

// Створюємо окремий компонент для елемента тулбару
const ImageToolbarItem: React.FC<{
  onInsert: (url: string, alt: string) => void
  onSaveSelection: () => void
}> = ({ onInsert, onSaveSelection }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <ImageButton
        onButtonClick={() => {
          onSaveSelection()
          setIsOpen(true)
        }}
      />
      <ImageDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={onInsert} />
    </>
  )
}
