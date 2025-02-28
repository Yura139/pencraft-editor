import React, { useState, useEffect } from "react"
import { ToolbarItem } from "../types"

interface ToolbarProps {
  items: ToolbarItem[]
  editorRef: React.RefObject<HTMLDivElement>
}

export const Toolbar: React.FC<ToolbarProps> = ({ items, editorRef }) => {
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>({})

  const getSelectionParentElement = () => {
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return null

    const range = selection.getRangeAt(0)
    let container = range.commonAncestorContainer

    return container.nodeType === 3 ? container.parentElement : (container as HTMLElement)
  }

  const isFormatActive = (selector: string): boolean => {
    const parentElement = getSelectionParentElement()
    if (!parentElement) return false
    return !!parentElement.closest(selector)
  }

  const checkActiveItems = () => {
    if (!editorRef.current) return

    const newActiveItems: Record<string, boolean> = {}
    const parentElement = getSelectionParentElement()

    if (!parentElement) {
      setActiveItems({})
      return
    }

    // Перевіряємо всі елементи уніфіковано
    items.forEach((item) => {
      if (item.command === "formatBlock" && item.value) {
        // Перевіряємо блочні елементи (заголовки, параграфи тощо)
        newActiveItems[item.name] = isFormatActive(item.value)
      } else if (["bold", "italic", "underline", "strikeThrough"].includes(item.command || "")) {
        // Для inline-форматування використовуємо лише queryCommandState
        try {
          newActiveItems[item.name] = document.queryCommandState(item.command!)
        } catch {
          newActiveItems[item.name] = false
        }
      } else if (item.checkActive) {
        // Використовуємо користувацьку функцію перевірки, якщо вона є
        newActiveItems[item.name] = item.checkActive(editorRef.current)
      } else if (item.command) {
        // Для інших команд використовуємо стандартну перевірку
        try {
          newActiveItems[item.name] = document.queryCommandState(item.command)
        } catch {
          newActiveItems[item.name] = false
        }
      }
    })

    setActiveItems(newActiveItems)
  }

  useEffect(() => {
    // Перевіряємо активні елементи при зміні виділення
    const handleSelectionChange = () => {
      checkActiveItems()
    }

    document.addEventListener("selectionchange", handleSelectionChange)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [items, editorRef])

  const handleClick = (item: ToolbarItem) => {
    if (!editorRef.current) return

    if (item.command) {
      const isInlineFormat = ["bold", "italic", "underline", "strikeThrough"].includes(item.command)

      // Спеціальна обробка для formatBlock
      if (item.command === "formatBlock") {
        const currentBlock = getSelectionParentElement()?.closest(item.value || "")

        if (currentBlock) {
          // Якщо вже є такий блок, перетворюємо його на параграф
          document.execCommand("formatBlock", false, "p")
        } else {
          // Якщо такого блоку немає, створюємо його
          document.execCommand(item.command, false, item.value || "")
        }

        // Оновлюємо стан кнопок блочного форматування
        const newActiveItems = { ...activeItems }
        const isActive = !activeItems[item.name]
        newActiveItems[item.name] = isActive

        // Якщо активували інший блок, деактивуємо всі інші блоки
        if (isActive) {
          items.forEach((otherItem) => {
            if (otherItem.command === "formatBlock" && otherItem.value && otherItem !== item) {
              newActiveItems[otherItem.name] = false
            }
          })
        }

        setActiveItems(newActiveItems)
      } else if (isInlineFormat) {
        // Для inline-форматування перевіряємо поточний стан і перемикаємо його
        const currentState = document.queryCommandState(item.command)
        document.execCommand(item.command, false, item.value || "")

        // Оновлюємо стан кнопки відповідно до нового стану
        const newActiveItems = { ...activeItems }
        newActiveItems[item.name] = !currentState
        setActiveItems(newActiveItems)
      } else {
        // Для інших команд просто виконуємо їх
        document.execCommand(item.command, false, item.value || "")
      }
    } else if (item.action && editorRef.current) {
      item.action(editorRef.current)
    }

    // Запускаємо повну перевірку активних елементів після невеликої затримки
    setTimeout(() => {
      checkActiveItems()
    }, 10)
  }

  return (
    <div className="pencraft-toolbar-items" role="toolbar" aria-label="Панель форматування тексту">
      {items.map((item) =>
        item.render ? (
          <React.Fragment key={item.name}>{item.render()}</React.Fragment>
        ) : (
          <button key={item.name} className={`pencraft-button ${activeItems[item.name] ? "active" : ""}`} onClick={() => handleClick(item)} title={item.name} aria-label={item.name} aria-pressed={activeItems[item.name] ? "true" : "false"}>
            {item.icon}
          </button>
        )
      )}
    </div>
  )
}
