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
      icon: "•",
      command: "insertUnorderedList",
    },
    {
      name: "Numbered List",
      icon: "1.",
      command: "insertOrderedList",
    },
    {
      name: "Indent",
      icon: "→",
      command: "indent",
    },
    {
      name: "Outdent",
      icon: "←",
      command: "outdent",
    },
  ]
}
