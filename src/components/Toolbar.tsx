import React from "react"
import { ToolbarItem } from "../types"

interface ToolbarProps {
  items: ToolbarItem[]
  editorRef: React.RefObject<HTMLDivElement>
}

export const Toolbar: React.FC<ToolbarProps> = ({ items, editorRef }) => {
  const handleClick = (item: ToolbarItem) => {
    if (!editorRef.current) return

    if (item.command) {
      document.execCommand(item.command, false, item.value || "")
    } else if (item.action && editorRef.current) {
      item.action(editorRef.current)
    }
  }

  return (
    <div className="pencraft-toolbar-items">
      {items.map((item) =>
        item.render ? (
          <React.Fragment key={item.name}>{item.render()}</React.Fragment>
        ) : (
          <button key={item.name} className="pencraft-button" onClick={() => handleClick(item)} title={item.name}>
            {item.icon}
          </button>
        )
      )}
    </div>
  )
}
