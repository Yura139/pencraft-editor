export interface Plugin {
  name: string;
  initialize: (editor: EditorCore) => void;
  destroy?: () => void;
  toolbar?: ToolbarItem[];
}

export interface EditorCore {
  getContent: () => string;
  setContent: (content: string) => void;
  insertHTML: (html: string) => void;
  focus: () => void;
  blur: () => void;
  undo: () => void;
  redo: () => void;
  execCommand: (command: string, value?: string) => boolean;
  exportContent: (format: 'html' | 'text' | 'markdown') => string;
}

export interface HistoryState {
  content: string;
  selection?: Range | null;
}

export interface ToolbarItem {
  name: string;
  icon?: string;
  command?: string;
  action?: () => void;
  render?: (props: { onClick: () => void }) => React.ReactNode;
} 