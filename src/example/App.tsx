import React from "react"
import { PencraftEditor } from "../components/PencraftEditor"
import { ToolbarItem } from "../types"

const defaultToolbarItems: ToolbarItem[] = [
  { name: "Bold", command: "bold", icon: "B" },
  { name: "Italic", command: "italic", icon: "I" },
  { name: "Underline", command: "underline", icon: "U" },
  { name: "Strike", command: "strikeThrough", icon: "S" },
  { name: "Left", command: "justifyLeft", icon: "←" },
  { name: "Center", command: "justifyCenter", icon: "↔" },
  { name: "Right", command: "justifyRight", icon: "→" },
  { name: "H1", command: "formatBlock", value: "h1", icon: "H1" },
  { name: "H2", command: "formatBlock", value: "h2", icon: "H2" },
  { name: "H3", command: "formatBlock", value: "h3", icon: "H3" },
  { name: "Quote", command: "formatBlock", value: "blockquote", icon: "❝" },
]

export const App: React.FC = () => {
  const handleChange = (content: string) => {
    console.log("Content changed:", content)
  }

  return (
    <div style={{ padding: "60px 120px", maxWidth: "1920px", margin: "0 auto" }}>
      <h1>Pencraft Editor Example</h1>
      <PencraftEditor
        initialContent=""
        onChange={handleChange}
        toolbarItems={defaultToolbarItems}
        settings={{
          placeholder: "Start typing...",
          // height: "400px",
          spellCheck: true,
          toolbar: {
            fixed: true,
            show: true,
            position: "top",
          },
        }}
      />
    </div>
  )
}
