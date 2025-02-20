import { ReactNode } from 'react';

// Базові типи для редактора
export interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  settings?: EditorSettings;
  toolbarItems?: ToolbarItem[];
}

export interface EditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}

// Типи для тулбару
export interface ToolbarProps {
  items: ToolbarItem[];
  editorRef: React.MutableRefObject<HTMLDivElement>;
}

export interface ToolbarItemProps {
  onClick: () => void;
}

export interface ToolbarItem {
  name: string;
  icon: string;
  command?: string;
  value?: string;
  action?: (editor: HTMLDivElement) => void;
  render?: () => React.ReactNode;
}

export interface EditorCore {
  getContent: () => string;
  setContent: (content: string) => void;
  insertHTML: (html: string) => void;
  focus: () => void;
  blur: () => void;
  undo: () => void;
  redo: () => void;
  isHTMLMode: () => boolean;
  toggleHTMLMode: () => void;
}

export interface Plugin {
  name: string;
  initialize: (editor: EditorCore) => void;
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
