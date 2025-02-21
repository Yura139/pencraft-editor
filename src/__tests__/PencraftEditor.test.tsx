import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import { PencraftEditor } from "../components/PencraftEditor"

describe("PencraftEditor", () => {
  beforeEach(() => {
    // Очищаємо моки перед кожним тестом
    jest.clearAllMocks()
  })

  it("renders with initial content", () => {
    const initialContent = "<p>Test content</p>"
    render(<PencraftEditor initialContent={initialContent} />)
    const editor = document.querySelector(".pencraft-editor")
    expect(editor?.innerHTML).toContain("Test content")
  })

  it("calls onChange when content changes", () => {
    const onChange = jest.fn()
    render(<PencraftEditor onChange={onChange} />)
    const editor = document.querySelector(".pencraft-editor")

    if (editor) {
      fireEvent.input(editor, {
        target: { innerHTML: "<p>New content</p>" },
      })
    }

    expect(onChange).toHaveBeenCalledWith("<p>New content</p>")
  })

  it("applies theme correctly", () => {
    render(<PencraftEditor />)
    const container = document.querySelector(".pencraft-container")
    expect(container).toHaveAttribute("data-theme", "light")
  })

  it("handles list button clicks", () => {
    render(<PencraftEditor />)
    const bulletListButton = screen.getByTitle("Bullet List")
    expect(bulletListButton).toBeInTheDocument()
  })

  it("renders toolbar items", () => {
    render(<PencraftEditor />)
    const toolbar = document.querySelector(".pencraft-toolbar-items")
    expect(toolbar).toBeInTheDocument()
  })
})
