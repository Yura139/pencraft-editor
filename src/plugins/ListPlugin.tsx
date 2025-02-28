import { Plugin, EditorCore } from "../types"

export class ListPlugin implements Plugin {
  name = "list"
  private editor: EditorCore | null = null

  initialize(editor: EditorCore) {
    this.editor = editor
  }

  toolbar = [
    {
      name: "Bullet List",
      icon: "ul",
      checkActive: () => {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return false

        const range = selection.getRangeAt(0)
        const parentElement = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : (range.commonAncestorContainer as HTMLElement)

        return !!parentElement?.closest("ul")
      },
      action: () => {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return

        const range = selection.getRangeAt(0)
        const parentElement = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : (range.commonAncestorContainer as HTMLElement)

        // Перевіряємо, чи знаходимося ми в параграфі
        const paragraph = parentElement?.closest("p")
        if (paragraph) {
          // Якщо ми в параграфі, замінюємо його вміст на список
          const content = paragraph.innerHTML
          const list = document.createElement("ul")
          const li = document.createElement("li")
          li.innerHTML = content
          list.appendChild(li)
          paragraph.parentNode?.replaceChild(list, paragraph)
        } else if (parentElement?.closest("ul")) {
          // Якщо ми вже в списку, перетворюємо назад в параграф
          const listItem = parentElement.closest("li")
          const list = parentElement.closest("ul")
          if (listItem && list) {
            const p = document.createElement("p")
            p.innerHTML = listItem.innerHTML
            if (list.children.length === 1) {
              // Якщо це єдиний елемент списку, замінюємо весь список
              list.parentNode?.replaceChild(p, list)
            } else {
              // Інакше замінюємо тільки поточний елемент
              list.removeChild(listItem)
            }
          }
        } else {
          // Якщо ми не в параграфі і не в списку, створюємо новий список
          document.execCommand("insertUnorderedList", false)
        }
      },
    },
    {
      name: "Numbered List",
      icon: "ol",
      checkActive: () => {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return false

        const range = selection.getRangeAt(0)
        const parentElement = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : (range.commonAncestorContainer as HTMLElement)

        return !!parentElement?.closest("ol")
      },
      action: () => {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount) return

        const range = selection.getRangeAt(0)
        const parentElement = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : (range.commonAncestorContainer as HTMLElement)

        // Перевіряємо, чи знаходимося ми в параграфі
        const paragraph = parentElement?.closest("p")
        if (paragraph) {
          // Якщо ми в параграфі, замінюємо його вміст на список
          const content = paragraph.innerHTML
          const list = document.createElement("ol")
          const li = document.createElement("li")
          li.innerHTML = content
          list.appendChild(li)
          paragraph.parentNode?.replaceChild(list, paragraph)
        } else if (parentElement?.closest("ol")) {
          // Якщо ми вже в списку, перетворюємо назад в параграф
          const listItem = parentElement.closest("li")
          const list = parentElement.closest("ol")
          if (listItem && list) {
            const p = document.createElement("p")
            p.innerHTML = listItem.innerHTML
            if (list.children.length === 1) {
              // Якщо це єдиний елемент списку, замінюємо весь список
              list.parentNode?.replaceChild(p, list)
            } else {
              // Інакше замінюємо тільки поточний елемент
              list.removeChild(listItem)
            }
          }
        } else {
          // Якщо ми не в параграфі і не в списку, створюємо новий список
          document.execCommand("insertOrderedList", false)
        }
      },
    },
  ]
}
