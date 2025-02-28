/**
 * Type for keyboard shortcut event handler
 */
type ShortcutHandler = (e: KeyboardEvent) => void;

/**
 * Interface describing a keyboard shortcut configuration
 */
interface Shortcut {
  /** Key value (e.g., 'a', 'b', 'enter') */
  key: string;
  /** Whether Control key should be pressed */
  ctrl?: boolean;
  /** Whether Shift key should be pressed */
  shift?: boolean;
  /** Whether Alt key should be pressed */
  alt?: boolean;
  /** Description of what the shortcut does */
  description?: string;
  /** Handler function to execute when shortcut is triggered */
  handler: ShortcutHandler;
}

/**
 * Manages keyboard shortcuts for the editor
 */
export class ShortcutManager {
  private shortcuts: Shortcut[] = [];

  /**
   * Registers a new keyboard shortcut
   * @param shortcut Shortcut configuration
   */
  register(shortcut: Shortcut) {
    // Перевіряємо чи такий шорткат вже існує
    const exists = this.shortcuts.some(
      (s) =>
        s.key === shortcut.key &&
        s.ctrl === shortcut.ctrl &&
        s.shift === shortcut.shift &&
        s.alt === shortcut.alt
    );

    if (exists) {
      console.warn(`Shortcut for ${shortcut.key} already exists`);
      return;
    }

    this.shortcuts.push(shortcut);
  }

  /**
   * Handles keydown events and executes registered shortcuts
   */
  handleKeyDown = (e: KeyboardEvent) => {
    // Ігноруємо події в текстових полях, крім самого едітора
    if (
      e.target instanceof HTMLInputElement ||
      (e.target instanceof HTMLTextAreaElement && !e.target.classList.contains('pencraft-editor'))
    ) {
      return;
    }

    this.shortcuts.forEach((shortcut) => {
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

  /**
   * Removes a specific shortcut
   * @param key Key of the shortcut to remove
   */
  unregister(key: string) {
    this.shortcuts = this.shortcuts.filter((s) => s.key !== key);
  }

  /**
   * Returns all registered shortcuts
   */
  getShortcuts(): Readonly<Shortcut[]> {
    return [...this.shortcuts];
  }

  /**
   * Removes all registered shortcuts
   */
  destroy() {
    this.shortcuts = [];
  }
} 