import React from "react"
import { Plugin, EditorCore } from "../types"
import { Modal } from "../components/Modal"
import { SelectionManager } from "../utils/SelectionManager"

// Виносимо компонент діалогу окремо
const TableDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number) => void
}> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = React.useState(2)
  const [cols, setCols] = React.useState(2)

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
  private selectionManager: SelectionManager = new SelectionManager()

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  private createTable(rows: number, cols: number): string {
    let tableHTML = '<table class="pencraft-table">'

    for (let i = 0; i < rows; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < cols; j++) {
        tableHTML += "<td><br></td>"
      }
      tableHTML += "</tr>"
    }

    tableHTML += "</table>"
    return tableHTML
  }

  private insertTable = (rows: number, cols: number) => {
    if (!this.editor) return

    const editorElement = document.querySelector(".pencraft-editor") as HTMLElement
    if (!editorElement) return

    const tableHTML = this.createTable(rows, cols)
    this.selectionManager.insertHTML(tableHTML, editorElement)

    // Створюємо подію input для оновлення стану
    editorElement.dispatchEvent(new Event("input", { bubbles: true }))
  }

  toolbar = [
    {
      name: "Table",
      icon: "📊",
      render: () => {
        return <TableToolbarItem onInsert={this.insertTable} onSaveSelection={() => this.selectionManager.saveSelection()} />
      },
    },
  ]
}

// Створюємо окремий компонент для елемента тулбару
const TableToolbarItem: React.FC<{
  onInsert: (rows: number, cols: number) => void
  onSaveSelection: () => void
}> = ({ onInsert, onSaveSelection }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        className="pencraft-button"
        onClick={() => {
          onSaveSelection()
          setIsOpen(true)
        }}
        title="Insert table"
      >
        📊
      </button>
      <TableDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onInsert={onInsert} />
    </>
  )
}
