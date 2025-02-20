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
    const editor = screen.getByRole("textbox")
    expect(editor).toHaveProperty("innerHTML", initialContent)
  })

  it("calls onChange when content changes", () => {
    const onChange = jest.fn()
    render(<PencraftEditor onChange={onChange} />)
    const editor = screen.getByRole("textbox")

    fireEvent.input(editor, {
      target: { innerHTML: "<p>New content</p>" },
    })

    expect(onChange).toHaveBeenCalledWith("<p>New content</p>")
  })

  it("applies theme correctly", () => {
    render(<PencraftEditor />)
    const themeSelector = screen.getByRole("combobox")

    fireEvent.change(themeSelector, { target: { value: "Dark" } })

    const container = document.querySelector(".pencraft-container")
    expect(container).toHaveAttribute("data-theme", "dark")
  })

  it("handles list button clicks", () => {
    render(<PencraftEditor />)
    const bulletListButton = screen.getByTitle("Bullet List")

    fireEvent.click(bulletListButton)

    // Перевіряємо, що document.execCommand був викликаний з правильними параметрами
    expect(document.execCommand).toHaveBeenCalledWith("insertUnorderedList", false, "")
  })

  it("renders toolbar items", () => {
    const customToolbarItems = [{ name: "Bold", command: "bold", icon: "B" }]

    render(<PencraftEditor toolbarItems={customToolbarItems} />)
    const boldButton = screen.getByTitle("Bold")
    expect(boldButton).toBeInTheDocument()
  })
})
