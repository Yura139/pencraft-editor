import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, MutableRefObject } from "react"
import { EditorProps, EditorRef, EditorCore, Theme } from "../types"
import { Toolbar } from "./Toolbar"
import { ThemeSelector, defaultThemes } from "./ThemeSelector"
import "../styles/editor.css"
import { PluginManager } from "../utils/PluginManager"
import { History } from "../utils/History"
import { ImagePlugin } from "../plugins/ImagePlugin"
import { LinkPlugin } from "../plugins/LinkPlugin"
import { TablePlugin } from "../plugins/TablePlugin"
import { CodePlugin } from "../plugins/CodePlugin"
import { ListPlugin } from "../plugins/ListPlugin"
import { HTMLPlugin } from "../plugins/HTMLPlugin"

export const PencraftEditor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    initialContent = "",
    onChange,
    settings = {
      readOnly: false,
      spellCheck: true,
      placeholder: "Start typing...",
      allowPaste: true,
      toolbar: {
        fixed: true,
        show: true,
        position: "top",
      },
      maxLength: undefined,
    },
    toolbarItems = [],
  } = props

  const editorRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>
  const [content, setContent] = useState(initialContent)
  const [history] = useState(new History())
  const [pluginManager, setPluginManager] = useState<PluginManager | null>(null)
  const [isHTMLMode, setIsHTMLMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent
    }
  }, [initialContent])

  useEffect(() => {
    const handleToggleEditMode = (e: CustomEvent<{ mode: string }>) => {
      if (e.detail.mode === "html") {
        setIsHTMLMode((prev) => !prev)
      }
    }

    document.addEventListener("toggleEditMode" as any, handleToggleEditMode)
    return () => {
      document.removeEventListener("toggleEditMode" as any, handleToggleEditMode)
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      if (isHTMLMode) {
        const htmlContent = editorRef.current.innerHTML
        editorRef.current.textContent = htmlContent
      } else {
        const textContent = editorRef.current.textContent || ""
        if (!/<[a-z][\s\S]*>/i.test(textContent)) {
          const lines = textContent.split(/\n\s*\n/)
          const wrappedContent =
            lines
              .map((line) => (line.trim() ? `<p>${line.trim()}</p>` : ""))
              .filter(Boolean)
              .join("") || "<p><br></p>"
          editorRef.current.innerHTML = wrappedContent
        } else {
          editorRef.current.innerHTML = textContent
        }
      }
    }
  }, [isHTMLMode])

  useEffect(() => {
    const editorCore: EditorCore = {
      getContent: () => content,
      setContent: (newContent: string) => {
        setContent(newContent)
        if (editorRef.current) {
          editorRef.current.innerHTML = newContent
        }
      },
      insertHTML: (html: string) => {
        if (editorRef.current) {
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const temp = document.createElement("div")
            temp.innerHTML = html
            range.deleteContents()
            range.insertNode(temp.firstChild!)
          } else {
            editorRef.current.innerHTML += html
          }
        }
      },
      focus: () => editorRef.current?.focus(),
      blur: () => editorRef.current?.blur(),
      undo: () => history.undo(),
      redo: () => history.redo(),
      isHTMLMode: () => isHTMLMode,
      toggleHTMLMode: () => setIsHTMLMode((prev) => !prev),
    }

    const manager = new PluginManager(editorCore)
    manager.register(new ImagePlugin())
    manager.register(new LinkPlugin())
    manager.register(new TablePlugin())
    manager.register(new CodePlugin())
    manager.register(new ListPlugin())
    manager.register(new HTMLPlugin())
    setPluginManager(manager)
  }, [])

  useImperativeHandle(ref, () => ({
    getContent: () => content,
    setContent: (newContent: string) => {
      setContent(newContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = newContent
      }
    },
    focus: () => editorRef.current?.focus(),
    blur: () => editorRef.current?.blur(),
  }))

  const handleInput = () => {
    if (editorRef.current) {
      const wrapTextNodesInParagraphs = () => {
        const childNodes = Array.from(editorRef.current.childNodes)
        let changed = false

        if (childNodes.every((node) => (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "P" && !(node as HTMLElement).textContent?.trim()) || (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()))) {
          editorRef.current.innerHTML = ""
          return true
        }

        childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            const p = document.createElement("p")
            const selection = window.getSelection()
            const range = selection?.getRangeAt(0)
            const offset = range?.startOffset || 0

            p.textContent = node.textContent
            node.parentNode?.replaceChild(p, node)

            if (selection && range) {
              const newRange = document.createRange()
              const textNode = p.firstChild
              if (textNode) {
                newRange.setStart(textNode, offset)
                newRange.setEnd(textNode, offset)
                selection.removeAllRanges()
                selection.addRange(newRange)
              }
            }

            changed = true
          }
        })

        return changed
      }

      const wasChanged = wrapTextNodesInParagraphs()

      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      onChange?.(newContent)

      if (wasChanged || newContent !== content) {
        history.push({ content: newContent })
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (settings.allowPaste === false) {
      e.preventDefault()
      return
    }

    if (settings.maxLength) {
      const content = editorRef.current?.innerText || ""
      const pastedText = e.clipboardData.getData("text") || ""

      if (content.length + pastedText.length > settings.maxLength) {
        e.preventDefault()
        return
      }
    }

    const pastedText = e.clipboardData.getData("text/plain")
    if (pastedText && !e.clipboardData.getData("text/html")) {
      e.preventDefault()

      const paragraphs = pastedText
        .split(/\n\s*\n/)
        .map((text) => `<p>${text.trim() || "<br>"}</p>`)
        .join("")

      document.execCommand("insertHTML", false, paragraphs)
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      if (initialContent) {
        if (!/<[a-z][\s\S]*>/i.test(initialContent)) {
          editorRef.current.innerHTML = `<p>${initialContent}</p>`
        } else {
          editorRef.current.innerHTML = initialContent
        }
      } else {
        editorRef.current.innerHTML = ""
      }
    }
  }, [initialContent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()

      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const currentNode = range.commonAncestorContainer

      const listItem = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentElement?.closest("li") : (currentNode as HTMLElement).closest("li")

      if (listItem) {
        const isEmpty = listItem.textContent?.trim() === ""
        const list = listItem.parentElement

        if (isEmpty && list) {
          if (listItem.previousElementSibling) {
            listItem.remove()

            if (!list.querySelector("li")) {
              list.remove()
            }

            const p = document.createElement("p")
            p.innerHTML = "<br>"

            if (list.nextSibling) {
              list.parentNode?.insertBefore(p, list.nextSibling)
            } else {
              list.parentNode?.appendChild(p)
            }

            range.selectNodeContents(p)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        } else {
          const newLi = document.createElement("li")
          newLi.innerHTML = "<br>"

          listItem.parentNode?.insertBefore(newLi, listItem.nextSibling)

          range.selectNodeContents(newLi)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } else {
        const currentBlock = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentElement : (currentNode as HTMLElement)

        if (!editorRef.current?.textContent?.trim() && (!currentBlock || currentBlock === editorRef.current)) {
          e.preventDefault()
          return
        }

        if (currentBlock) {
          const tagName = currentBlock.tagName.toLowerCase()
          const isEmpty = currentBlock.textContent?.trim() === ""

          if (isEmpty && tagName !== "p") {
            const p = document.createElement("p")
            p.innerHTML = "<br>"
            currentBlock.parentNode?.replaceChild(p, currentBlock)

            range.selectNodeContents(p)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            const newBlock = document.createElement(tagName === "p" ? "p" : "p")
            newBlock.innerHTML = "<br>"

            currentBlock.parentNode?.insertBefore(newBlock, currentBlock.nextSibling)

            range.selectNodeContents(newBlock)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      }

      const event = new Event("input", { bubbles: true })
      editorRef.current?.dispatchEvent(event)
    }
  }

  return (
    <div className="pencraft-container" data-theme={currentTheme.name.toLowerCase()}>
      <div className={`pencraft-toolbar ${settings.toolbar?.fixed ? "fixed" : ""}`}>
        <Toolbar items={[...toolbarItems, ...(pluginManager?.getAllToolbarItems() || [])]} editorRef={editorRef} />
        <ThemeSelector onThemeChange={setCurrentTheme} currentTheme={currentTheme.name} />
      </div>
      <div ref={editorRef} className={`pencraft-editor ${isHTMLMode ? "html-mode" : ""}`} contentEditable={!settings.readOnly} onInput={handleInput} onKeyDown={handleKeyDown} onPaste={handlePaste} data-placeholder={settings.placeholder} spellCheck={settings.spellCheck} suppressContentEditableWarning />
    </div>
  )
})

PencraftEditor.displayName = "PencraftEditor"
