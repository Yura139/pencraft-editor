import { HistoryState } from '../types';

export class History {
  private stack: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 100;

  push(state: HistoryState) {
    // Видаляємо всі стани після поточного індексу
    this.stack = this.stack.slice(0, this.currentIndex + 1);
    
    // Додаємо новий стан
    this.stack.push(state);
    
    // Якщо перевищили максимальний розмір, видаляємо найстаріший стан
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }
    
    this.currentIndex = this.stack.length - 1;
  }

  undo(): HistoryState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.stack[this.currentIndex];
    }
    return null;
  }

  redo(): HistoryState | null {
    if (this.currentIndex < this.stack.length - 1) {
      this.currentIndex++;
      return this.stack[this.currentIndex];
    }
    return null;
  }

  clear() {
    this.stack = [];
    this.currentIndex = -1;
  }
} 