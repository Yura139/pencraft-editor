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
import { ListPlugin } from "../plugins/ListPlugin"
import { HTMLPlugin } from "../plugins/HTMLPlugin"
import { ShortcutManager } from "../utils/Shortcuts"

// Додаємо стандартні елементи панелі інструментів
const defaultToolbarItems = [
  { name: "Bold", command: "bold", icon: "B" },
  { name: "Italic", command: "italic", icon: "I" },
  { name: "Underline", command: "underline", icon: "U" },
  { name: "Strike", command: "strikeThrough", icon: "S" },
  { name: "p", command: "formatBlock", value: "p", icon: "p" },
  { name: "H1", command: "formatBlock", value: "h1", icon: "H1" },
  { name: "H2", command: "formatBlock", value: "h2", icon: "H2" },
  { name: "H3", command: "formatBlock", value: "h3", icon: "H3" },
  { name: "Quote", command: "formatBlock", value: "blockquote", icon: "❝" },
]

export const PencraftEditor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    initialContent = "",
    onChange,
    settings: userSettings = {},
    toolbarItems = defaultToolbarItems || props.toolbarItems, // Використовуємо стандартні елементи за замовчуванням
  } = props

  const editorRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>
  const [content, setContent] = useState(initialContent)
  const [history] = useState(new History())
  const [pluginManager, setPluginManager] = useState<PluginManager | null>(null)
  const [isHTMLMode, setIsHTMLMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0])
  const [shortcutManager] = useState(() => new ShortcutManager())

  useEffect(() => {
    if (editorRef.current) {
      const cleanupContent = (content: string) => {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = content

        const cleanupFormats = (element: HTMLElement) => {
          const style = element.style

          if (style.fontWeight === "bold" || style.fontWeight === "700") {
            const strong = document.createElement("strong")
            strong.innerHTML = element.innerHTML
            element.parentNode?.replaceChild(strong, element)
          }

          if (style.fontStyle === "italic") {
            const em = document.createElement("em")
            em.innerHTML = element.innerHTML
            element.parentNode?.replaceChild(em, element)
          }

          if (style.textDecoration === "underline") {
            const u = document.createElement("u")
            u.innerHTML = element.innerHTML
            element.parentNode?.replaceChild(u, element)
          }

          if (style.textDecoration === "line-through") {
            const strike = document.createElement("strike")
            strike.innerHTML = element.innerHTML
            element.parentNode?.replaceChild(strike, element)
          }

          element.removeAttribute("style")

          Array.from(element.children).forEach((child) => {
            if (child instanceof HTMLElement) {
              cleanupFormats(child)
            }
          })
        }

        cleanupFormats(tempDiv)
        return tempDiv.innerHTML
      }

      if (initialContent) {
        if (!/<[a-z][\s\S]*>/i.test(initialContent)) {
          editorRef.current.innerHTML = `<p>${initialContent}</p>`
        } else {
          editorRef.current.innerHTML = cleanupContent(initialContent)
        }
      } else {
        // Встановлюємо порожній параграф за замовчуванням
        editorRef.current.innerHTML = "<p><br></p>"
      }

      // Встановлюємо параграф як активний блок за замовчуванням
      document.execCommand("defaultParagraphSeparator", false, "p")
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

    const manager = new PluginManager(editorCore, shortcutManager)
    const plugins = [new ListPlugin(), new ImagePlugin(), new LinkPlugin(), new TablePlugin(), new HTMLPlugin()]
    plugins.forEach((plugin) => manager.register(plugin))

    setPluginManager(manager)

    return () => manager.destroy()
  }, [])

  useEffect(() => {
    const shortcutManager = new ShortcutManager()

    // Додаємо базові клавіатурні скорочення
    shortcutManager.register({
      key: "b",
      ctrl: true,
      description: "Bold",
      handler: (e) => {
        e.preventDefault()
        document.execCommand("bold", false)
      },
    })

    shortcutManager.register({
      key: "i",
      ctrl: true,
      description: "Italic",
      handler: (e) => {
        e.preventDefault()
        document.execCommand("italic", false)
      },
    })

    shortcutManager.register({
      key: "u",
      ctrl: true,
      description: "Underline",
      handler: (e) => {
        e.preventDefault()
        document.execCommand("underline", false)
      },
    })

    // Додаємо обробник для клавіатурних скорочень
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      shortcutManager.handleKeyDown(e)
    }

    document.addEventListener("keydown", handleKeyboardShortcuts)

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts)
      shortcutManager.destroy()
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      // Функція для обробки комбінованого форматування
      const handleCombinedFormatting = (e: InputEvent) => {
        if (!editorRef.current) return

        // Знаходимо всі елементи зі стилями
        const elementsWithStyle = editorRef.current.querySelectorAll("[style]")

        elementsWithStyle.forEach((element) => {
          const style = (element as HTMLElement).style

          // Обробляємо комбінації форматування
          if (style.fontStyle === "italic") {
            const em = document.createElement("em")
            em.innerHTML = element.innerHTML
            // Зберігаємо інші форматування
            if (element.hasAttribute("class")) em.setAttribute("class", element.getAttribute("class")!)
            if (element instanceof HTMLElement) {
              if (element.tagName === "U") {
                const u = document.createElement("u")
                u.appendChild(em)
                element.parentNode?.replaceChild(u, element)
              } else if (element.tagName === "STRIKE") {
                const strike = document.createElement("strike")
                strike.appendChild(em)
                element.parentNode?.replaceChild(strike, element)
              } else {
                element.parentNode?.replaceChild(em, element)
              }
            }
          }

          // Видаляємо всі inline стилі
          element.removeAttribute("style")
        })
      }

      // Додаємо слухач подій для обробки змін в редакторі
      editorRef.current.addEventListener("input", handleCombinedFormatting as EventListener)

      return () => {
        editorRef.current?.removeEventListener("input", handleCombinedFormatting as EventListener)
      }
    }
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
        history.push({
          content: newContent,
          type: "character",
        })
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (userSettings.allowPaste === false) {
      e.preventDefault()
      return
    }

    if (userSettings.maxLength) {
      const content = editorRef.current?.innerText || ""
      const pastedText = e.clipboardData.getData("text") || ""

      if (content.length + pastedText.length > userSettings.maxLength) {
        e.preventDefault()
        return
      }
    }

    // Отримуємо HTML контент, якщо він є
    const pastedHtml = e.clipboardData.getData("text/html")
    const pastedText = e.clipboardData.getData("text/plain")

    if (pastedHtml) {
      e.preventDefault()
      // Очищуємо HTML від небажаних стилів
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = pastedHtml

      // Замінюємо стильове форматування на семантичні теги
      const cleanupFormats = (element: HTMLElement) => {
        const style = element.style

        if (style.fontWeight === "bold" || style.fontWeight === "700") {
          const strong = document.createElement("strong")
          strong.innerHTML = element.innerHTML
          element.parentNode?.replaceChild(strong, element)
        }

        if (style.fontStyle === "italic") {
          const em = document.createElement("em")
          em.innerHTML = element.innerHTML
          element.parentNode?.replaceChild(em, element)
        }

        if (style.textDecoration === "underline") {
          const u = document.createElement("u")
          u.innerHTML = element.innerHTML
          element.parentNode?.replaceChild(u, element)
        }

        if (style.textDecoration === "line-through") {
          const strike = document.createElement("strike")
          strike.innerHTML = element.innerHTML
          element.parentNode?.replaceChild(strike, element)
        }

        // Видаляємо всі inline стилі
        element.removeAttribute("style")

        // Рекурсивно обробляємо всі дочірні елементи
        Array.from(element.children).forEach((child) => {
          if (child instanceof HTMLElement) {
            cleanupFormats(child)
          }
        })
      }

      cleanupFormats(tempDiv)
      document.execCommand("insertHTML", false, tempDiv.innerHTML)
    } else if (pastedText) {
      e.preventDefault()
      const paragraphs = pastedText
        .split(/\n\s*\n/)
        .map((text) => `<p>${text.trim() || "<br>"}</p>`)
        .join("")

      document.execCommand("insertHTML", false, paragraphs)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()

      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const currentNode = range.commonAncestorContainer

      const listItem = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentElement?.closest("li") : (currentNode as HTMLElement).closest("li")

      if (listItem) {
        if (!listItem.textContent?.trim()) {
          const parentList = listItem.parentNode
          if (parentList) {
            const newParagraph = document.createElement("p")
            newParagraph.innerHTML = "<br>"
            parentList.parentNode?.insertBefore(newParagraph, parentList.nextSibling)
            listItem.remove()

            range.selectNodeContents(newParagraph)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        } else {
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
      <div className={`pencraft-toolbar ${userSettings.toolbar?.fixed ? "fixed" : ""}`}>
        <Toolbar items={[...toolbarItems, ...(pluginManager?.getAllToolbarItems() || [])]} editorRef={editorRef} />
        <ThemeSelector onThemeChange={setCurrentTheme} currentTheme={currentTheme.name} />
      </div>
      <div ref={editorRef} className={`pencraft-editor ${isHTMLMode ? "html-mode" : ""}`} contentEditable={!userSettings.readOnly} onInput={handleInput} onKeyDown={handleKeyDown} onPaste={handlePaste} data-placeholder={userSettings.placeholder} spellCheck={userSettings.spellCheck} suppressContentEditableWarning />
    </div>
  )
})

PencraftEditor.displayName = "PencraftEditor"
