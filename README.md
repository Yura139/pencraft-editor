# Pencraft Editor

A modern, powerful, and highly customizable WYSIWYG (What You See Is What You Get) editor for React applications. Built with TypeScript and designed with extensibility in mind, Pencraft Editor combines the simplicity of traditional text editing with the power of modern web technologies.

## Why Pencraft?

- 🚀 **Lightweight & Fast**: Built from the ground up with performance in mind
- 🎨 **Modern UI**: Clean, intuitive interface with customizable themes
- 🔌 **Plugin Architecture**: Easily extend functionality with a powerful plugin system
- 📱 **Responsive**: Works seamlessly across desktop and mobile devices
- 🛠 **Developer Friendly**: Written in TypeScript with comprehensive documentation
- ⚡ **Real-time Preview**: Instant visual feedback as you type
- 🔒 **Secure**: Sanitized HTML output to prevent XSS attacks
- 📦 **Zero Dependencies**: Minimal footprint with no external dependencies
- 🌐 **Cross-browser Support**: Works in all modern browsers

Perfect for:
- Content Management Systems
- Blog Platforms
- Documentation Tools
- Email Composers
- Form Builders
- And any application requiring rich text editing capabilities

[View Demo](https://yura139.github.io/pencraft-editor/) | [npm Package](https://www.npmjs.com/package/pencraft-editor)

![npm](https://img.shields.io/npm/v/pencraft-editor)
![License](https://img.shields.io/npm/l/pencraft-editor)
![Downloads](https://img.shields.io/npm/dm/pencraft-editor)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/pencraft-editor)

## Features

- 📝 Basic text formatting
- 📊 Table support
- 💻 Code blocks with syntax highlighting
- 📑 Numbered and bulleted lists
- 🎨 Theme support
- ⌨️ Keyboard shortcuts
- 🔌 Plugin system
- 📤 Export to different formats

## Installation

```bash
npm install pencraft-editor
# or
yarn add pencraft-editor
```

**Important:** Don't forget to import the CSS styles in your application:

```tsx
import 'pencraft-editor/src/styles/editor.css';
```

You can import the styles in your main CSS file or directly in your component.

## Basic Usage

```tsx
import { PencraftEditor } from 'pencraft-editor';
import 'pencraft-editor/src/styles/editor.css'; // Імпортуйте стилі

function MyEditor() {
  const handleChange = (content: string) => {
    console.log('Content changed:', content);
  };

  return (
    <PencraftEditor
      initialContent="<p>Hello, world!</p>"
      onChange={handleChange}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `""` | Initial HTML content for the editor |
| `onChange` | `(content: string) => void` | `undefined` | Callback fired when content changes |
| `settings` | `EditorSettings` | See below | Editor configuration options |
| `toolbarItems` | `ToolbarItem[]` | Default items | Custom toolbar items |

### EditorSettings

```typescript
interface EditorSettings {
  readOnly?: boolean;        // Make editor read-only
  spellCheck?: boolean;      // Enable/disable spell checking
  placeholder?: string;      // Placeholder text when editor is empty
  allowPaste?: boolean;      // Allow paste functionality
  maxLength?: number;        // Maximum content length
  toolbar?: {
    fixed?: boolean;        // Fix toolbar position
    show?: boolean;         // Show/hide toolbar
    position?: 'top' | 'bottom'; // Toolbar position
  };
}
```

### Default Toolbar Items

```typescript
const defaultToolbarItems = [
  { name: "Bold", command: "bold", icon: "B" },
  { name: "Italic", command: "italic", icon: "I" },
  { name: "Underline", command: "underline", icon: "U" },
  { name: "Strike", command: "strikeThrough", icon: "S" },
  { name: "Left", command: "justifyLeft", icon: "←" },
  { name: "Center", command: "justifyCenter", icon: "↔" },
  { name: "Right", command: "justifyRight", icon: "→" },
  { name: "H1", command: "formatBlock", value: "h1", icon: "H1" },
  { name: "H2", command: "formatBlock", value: "h2", icon: "H2" },
  { name: "H3", command: "formatBlock", value: "h3", icon: "H3" },
  { name: "Quote", command: "formatBlock", value: "blockquote", icon: "❝" }
];
```

## Plugins

Pencraft Editor comes with several built-in plugins:

### Image Plugin
```tsx
import { PencraftEditor, ImagePlugin } from 'pencraft-editor';
import 'pencraft-editor/src/styles/editor.css';

function MyEditor() {
  return (
    <PencraftEditor
      plugins={[new ImagePlugin()]}
    />
  );
}
```

### Table Plugin
```tsx
import { PencraftEditor, TablePlugin } from 'pencraft-editor';
import 'pencraft-editor/src/styles/editor.css';

function MyEditor() {
  return (
    <PencraftEditor
      plugins={[new TablePlugin()]}
    />
  );
}
```


## Themes

The editor supports custom themes:

```tsx
import { PencraftEditor, Theme } from 'pencraft-editor';
import 'pencraft-editor/src/styles/editor.css';

const customTheme: Theme = {
  name: "Custom",
  styles: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    toolbarBackground: "#f8f9fa",
    borderColor: "#dee2e6",
    accentColor: "#007bff",
  }
};

function MyEditor() {
  return (
    <PencraftEditor
      settings={{
        theme: customTheme
      }}
    />
  );
}
```

## Methods

Access editor methods using ref:

```tsx
import React, { useRef } from 'react';
import { PencraftEditor, EditorRef } from 'pencraft-editor';
import 'pencraft-editor/src/styles/editor.css';

function MyEditor() {
  const editorRef = useRef<EditorRef>(null);

  const handleSave = () => {
    const content = editorRef.current?.getContent();
    console.log('Content:', content);
  };

  return (
    <>
      <PencraftEditor ref={editorRef} />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

## Custom Plugins

Create your own plugins:

```typescript
import { Plugin, EditorCore } from 'pencraft-editor';

class CustomPlugin implements Plugin {
  name = "custom";
  private editor: EditorCore | null = null;

  initialize(editor: EditorCore) {
    this.editor = editor;
  }

  toolbar = [
    {
      name: "Custom Action",
      icon: "🔧",
      action: () => {
        // Your custom action
      }
    }
  ];
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request on [GitHub](https://github.com/Yura139/pencraft-editor).

## Useful Links

- 📦 [npm Package](https://www.npmjs.com/package/pencraft-editor)
- 🌐 [Live Demo](https://yura139.github.io/pencraft-editor/)
- 💻 [GitHub Repository](https://github.com/Yura139/pencraft-editor)
- 📋 [Issues & Bug Reports](https://github.com/Yura139/pencraft-editor/issues)

## License

MIT © Yura Havrylyshyn


