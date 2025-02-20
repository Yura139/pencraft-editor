import React, { useState, useEffect } from "react"
import { Modal } from "./Modal"

interface HTMLEditorProps {
  isOpen: boolean
  onClose: () => void
  content: string
  onSave: (html: string) => void
}

export const HTMLEditor: React.FC<HTMLEditorProps> = ({ isOpen, onClose, content, onSave }) => {
  const [html, setHtml] = useState(content)

  useEffect(() => {
    setHtml(content)
  }, [content])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(html)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="pencraft-form html-editor" onSubmit={handleSubmit}>
        <h3>Edit HTML</h3>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={20}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "8px",
          }}
        />
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
