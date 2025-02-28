import { ReactNode } from 'react';
import { ShortcutManager } from '../utils/Shortcuts';

// Базові типи для редактора
export interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  settings?: EditorSettings;
  toolbarItems?: ToolbarItem[];
}

// Базовий інтерфейс для спільних методів
interface BaseEditorInterface {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}

// Розширюємо базовий інтерфейс для EditorRef
export interface EditorRef extends BaseEditorInterface {
  // EditorRef не потребує додаткових методів
}

// Розширюємо базовий інтерфейс для EditorCore
export interface EditorCore extends BaseEditorInterface {
  insertHTML: (html: string) => void;
  undo: () => void;
  redo: () => void;
  isHTMLMode: () => boolean;
  toggleHTMLMode: () => void;
}

// Типи для тулбару
export interface ToolbarProps {
  items: ToolbarItem[];
  editorRef: React.MutableRefObject<HTMLDivElement>;
}

export interface ToolbarItem {
  name: string;
  command?: string;
  value?: string;
  icon: ReactNode;
  action?: (editor: HTMLElement) => void;
  render?: () => ReactNode;
  isActive?: boolean;
  checkActive?: (editor: HTMLElement) => boolean;
}

export interface Plugin {
  name: string;
  initialize: (editor: EditorCore, shortcutManager: ShortcutManager) => void;
  destroy?: () => void;
  toolbar?: ToolbarItem[];
}

export interface HistoryState {
  content: string;
  selection?: Range | null;
}

export interface EditorSettings {
  readOnly?: boolean;
  spellCheck?: boolean;
  placeholder?: string;
  allowPaste?: boolean;
  maxLength?: number;
  height?: string;
  width?: string;
  toolbar?: {
    fixed?: boolean;
    show?: boolean;
    position?: 'top' | 'bottom';
  };
}

export interface Theme {
  name: string;
  styles: {
    backgroundColor: string;
    textColor: string;
    toolbarBackground: string;
    borderColor: string;
    accentColor: string;
  };
} 
