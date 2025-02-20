import React, { useState } from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"

const TableDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number) => void
}> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onInsert(rows, cols)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="pencraft-form" onSubmit={handleSubmit}>
        <h3>Insert Table</h3>
        <div>
          <label>
            Rows:
            <input type="number" min="1" max="10" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Columns:
            <input type="number" min="1" max="10" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} />
          </label>
        </div>
        <button type="submit">Insert</button>
      </form>
    </Modal>
  )
}

export class TablePlugin implements Plugin {
  name = "table"
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

  private createTable = (rows: number, cols: number) => {
    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.marginBottom = "1rem"

    for (let i = 0; i < rows; i++) {
      const row = table.insertRow()
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell()
        cell.style.border = "1px solid #ddd"
        cell.style.padding = "8px"
        cell.innerHTML = "<br>"
      }
    }

    return table
  }

  private insertTable = (rows: number, cols: number) => {
    if (!this.editor) return

    this.restoreSelection()
    const table = this.createTable(rows, cols)

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const editorElement = document.querySelector(".pencraft-editor")

      if (!editorElement) return

      // Знаходимо найближчий параграф
      let currentNode = range.commonAncestorContainer
      while (currentNode && currentNode.parentElement !== editorElement) {
        currentNode = currentNode.parentElement!
      }

      // Якщо ми в параграфі, вставляємо таблицю після нього
      if (currentNode && currentNode.nodeName === "P") {
        currentNode.parentNode?.insertBefore(table, currentNode.nextSibling)
      } else {
        // Якщо ми не в параграфі, просто вставляємо таблицю
        range.deleteContents()
        range.insertNode(table)
      }

      selection.removeAllRanges()
      selection.addRange(range)

      // Створюємо подію input для оновлення стану
      editorElement.dispatchEvent(new Event("input", { bubbles: true }))
    }

    this.savedRange = null
  }

  toolbar = [
    {
      name: "Table",
      icon: "📊",
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
              title="Insert table"
            >
              📊
            </button>
            <TableDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={this.insertTable} />
          </>
        )
      },
    },
  ]
}
