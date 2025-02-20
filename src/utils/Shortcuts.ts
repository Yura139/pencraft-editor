type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
}

export class ShortcutManager {
  private shortcuts: Shortcut[] = [];

  register(shortcut: Shortcut) {
    this.shortcuts.push(shortcut);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.shortcuts.forEach(shortcut => {
      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!shortcut.ctrl === e.ctrlKey &&
        !!shortcut.shift === e.shiftKey &&
        !!shortcut.alt === e.altKey
      ) {
        e.preventDefault();
        shortcut.handler(e);
      }
    });
  };

  destroy() {
    this.shortcuts = [];
  }
} 