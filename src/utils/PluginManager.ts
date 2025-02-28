import { Plugin, EditorCore } from '../types';
import { ShortcutManager } from './Shortcuts';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private editor: EditorCore;
  private shortcutManager: ShortcutManager;

  constructor(editor: EditorCore, shortcutManager: ShortcutManager) {
    this.editor = editor;
    this.shortcutManager = shortcutManager;
  }

  /**
   * Реєструє новий плагін
   * @param plugin Плагін для реєстрації
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    plugin.initialize(this.editor, this.shortcutManager);
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Видаляє зареєстрований плагін
   * @param pluginName Назва плагіна для видалення
   */
  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (plugin?.destroy) {
      plugin.destroy();
    }
    this.plugins.delete(pluginName);
  }

  /**
   * Повертає всі елементи тулбару від зареєстрованих плагінів
   */
  getAllToolbarItems() {
    const items: any[] = [];
    this.plugins.forEach(plugin => {
      if (plugin.toolbar) {
        items.push(...plugin.toolbar);
      }
    });
    return items;
  }

  /**
   * Очищує всі зареєстровані плагіни
   */
  destroy(): void {
    this.plugins.forEach(plugin => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
    this.plugins.clear();
  }
} 