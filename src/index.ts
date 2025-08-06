// Основний компонент
export { PencraftEditor } from "./components/PencraftEditor"

// Типи
export type { EditorProps, EditorRef, Plugin, Theme, ToolbarItem, EditorCore, EditorSettings } from "./types"

// Плагіни
export { TablePlugin } from "./plugins/TablePlugin"
export { ListPlugin } from "./plugins/ListPlugin"
export { HTMLPlugin } from "./plugins/HTMLPlugin"
export { ImagePlugin } from "./plugins/ImagePlugin"
export { LinkPlugin } from "./plugins/LinkPlugin"

// Утиліти
export { ShortcutManager } from "./utils/Shortcuts"
export { History } from "./utils/History"
export { PluginManager } from "./utils/PluginManager"
export { prettifyHTML, minifyHTML } from "./utils/HTMLFormatter"

// Теми
export { defaultThemes, ThemeSelector } from "./components/ThemeSelector"

// Допоміжні компоненти
export { Toolbar } from "./components/Toolbar"
export { Modal } from "./components/Modal"

// Стилі - користувачі повинні імпортувати їх окремо
// import 'pencraft-editor/src/styles/editor.css';
