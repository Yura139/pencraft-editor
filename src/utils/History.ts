export interface HistoryState {
  content: string;
  selection?: Range | null;
  type: 'character' | 'paragraph' | 'format' | 'paste' | 'delete' | 'other';
}

export class History {
  private stack: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 100;
  private lastPushTime: number = 0;
  private isUndoOrRedo: boolean = false;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  push(state: HistoryState, shouldGroup: boolean = false) {
    // Пропускаємо, якщо це операція undo/redo
    if (this.isUndoOrRedo) {
      this.isUndoOrRedo = false;
      return;
    }

    const now = Date.now();

    // Якщо стек порожній, просто додаємо перший стан
    if (this.currentIndex === -1) {
      this.stack = [{ ...state }];
      this.currentIndex = 0;
      this.lastPushTime = now;
      return;
    }

    // Отримуємо поточний стан
    const currentState = this.stack[this.currentIndex];
    
    // Перевіряємо чи змінився контент
    if (currentState.content === state.content) {
      return;
    }

    // Перевіряємо чи потрібно групувати
    const timeDiff = now - this.lastPushTime;
    if (shouldGroup && timeDiff < 1000) {
      // Оновлюємо поточний стан
      this.stack[this.currentIndex] = { ...state };
    } else {
      // Видаляємо всі стани після поточного
      this.stack = this.stack.slice(0, this.currentIndex + 1);
      
      // Додаємо новий стан
      this.stack.push({ ...state });
      this.currentIndex++;

      // Якщо стек завеликий, видаляємо старі стани
      if (this.stack.length > this.maxSize) {
        const removeCount = Math.floor(this.maxSize / 4);
        this.stack = this.stack.slice(removeCount);
        this.currentIndex -= removeCount;
      }
    }

    this.lastPushTime = now;
  }

  undo(): HistoryState | null {
    if (this.currentIndex <= 0) {
      return null;
    }

    this.isUndoOrRedo = true;
    this.currentIndex--;
    return this.stack[this.currentIndex];
  }

  redo(): HistoryState | null {
    if (this.currentIndex >= this.stack.length - 1) {
      return null;
    }

    this.isUndoOrRedo = true;
    this.currentIndex++;
    return this.stack[this.currentIndex];
  }

  clear() {
    this.stack = [];
    this.currentIndex = -1;
    this.lastPushTime = 0;
  }

  getCurrentState(): HistoryState | null {
    return this.currentIndex >= 0 ? this.stack[this.currentIndex] : null;
  }

  getStackSize(): number {
    return this.stack.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  saveCurrentState(editorRef: HTMLDivElement, type: 'character' | 'paragraph' | 'format' | 'paste' | 'delete' | 'other' = 'other'): void {
    const selection = window.getSelection();
    let range = null;
    
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }
    
    this.push({
      content: editorRef.innerHTML,
      selection: range,
      type: type
    });
  }
} 