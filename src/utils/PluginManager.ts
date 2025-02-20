import { Plugin, EditorCore } from '../types';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private editor: EditorCore;

  constructor(editor: EditorCore) {
    this.editor = editor;
  }

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    plugin.initialize(this.editor);
    this.plugins.set(plugin.name, plugin);
  }

  unregister(pluginName: string) {
    const plugin = this.plugins.get(pluginName);
    if (plugin && plugin.destroy) {
      plugin.destroy();
    }
    this.plugins.delete(pluginName);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllToolbarItems() {
    const items: any[] = [];
    this.plugins.forEach(plugin => {
      if (plugin.toolbar) {
        items.push(...plugin.toolbar);
      }
    });
    return items;
  }

  destroy() {
    this.plugins.forEach(plugin => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
    this.plugins.clear();
  }
} 