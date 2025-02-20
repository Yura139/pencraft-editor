import React, { useState } from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"

const ImageDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (url: string, alt: string) => void
}> = ({ isOpen, onClose, onInsert }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")

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

export class ImagePlugin implements Plugin {
  name = "image"
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

  private insertImage = (url: string, alt: string) => {
    if (!this.editor) return

    try {
      new URL(url)
      const tempImg = new Image()

      tempImg.onload = () => {
        const editorElement = document.querySelector(".pencraft-editor") as HTMLElement
        if (!editorElement) return

        // Відновлюємо збережену позицію курсора
        this.restoreSelection()

        // Створюємо зображення
        const img = document.createElement("img")
        img.src = url
        img.alt = alt
        img.style.maxWidth = "100%"
        img.style.display = "block"

        // Отримуємо поточне виділення
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)

          // Перевіряємо, чи курсор знаходиться в редакторі
          if (editorElement.contains(range.commonAncestorContainer)) {
            // Знаходимо найближчий батьківський параграф
            let currentNode = range.commonAncestorContainer
            while (currentNode && currentNode.parentElement !== editorElement) {
              currentNode = currentNode.parentElement!
            }

            if (currentNode) {
              // Вставляємо зображення після поточного параграфа
              currentNode.parentNode?.insertBefore(img, currentNode.nextSibling)

              selection.removeAllRanges()
              selection.addRange(range)
            } else {
              // Якщо не знайшли параграф, вставляємо в поточну позицію
              range.insertNode(img)
              const br = document.createElement("br")
              img.parentNode?.insertBefore(br, img.nextSibling)
            }
          } else {
            // Якщо курсор поза редактором, додаємо в кінець
            editorElement.appendChild(img)
            const br = document.createElement("br")
            editorElement.appendChild(br)
          }
        } else {
          // Якщо немає виділення, додаємо в кінець
          editorElement.appendChild(img)
          const br = document.createElement("br")
          editorElement.appendChild(br)
        }

        // Фокусуємо редактор і створюємо подію input
        editorElement.focus()
        editorElement.dispatchEvent(new Event("input", { bubbles: true }))

        // Очищаємо збережену позицію
        this.savedRange = null
      }

      tempImg.onerror = () => {
        alert("Failed to load image. Please check the URL.")
      }

      tempImg.src = url
    } catch (error) {
      alert("Please enter a valid URL")
    }
  }

  toolbar = [
    {
      name: "Image",
      icon: "🖼️",
      render: () => {
        const [isOpen, setIsOpen] = useState(false)

        return (
          <>
            <button
              className="pencraft-button"
              onClick={(e) => {
                e.preventDefault()
                this.saveSelection() // Зберігаємо позицію курсора
                setIsOpen(true)
              }}
              type="button"
              title="Insert image"
            >
              🖼️
            </button>
            <ImageDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={this.insertImage} />
          </>
        )
      },
    },
  ]
}
