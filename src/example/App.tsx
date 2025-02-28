import React from "react"
import { PencraftEditor } from "../components/PencraftEditor"

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
        settings={{
          placeholder: "Start typing...",
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
